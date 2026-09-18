import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { supabaseAdmin } from '../src/lib/supabase/admin';
import { chunkMarkdown } from '../src/lib/rag/chunk';
import { embedBatch, DailyQuotaExceededError } from '../src/lib/rag/embed';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Tự nạp biến môi trường từ .env.local nếu chưa nạp
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

interface CategoryConfig {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order?: number;
}

interface FaqFrontmatter {
  question: string;
  variants?: string[];
  category?: string;
  priority?: number;
  is_active?: boolean;
}

interface DocFrontmatter {
  title: string;
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  summary?: string;
  tags?: string[];
  audience?: 'public' | 'learning';
}

async function syncDocumentChunks(
  relPath: string,
  title: string,
  content: string,
  categoryId: string | null,
  rawForHash: string,
  audience: 'public' | 'learning' = 'public'
): Promise<void> {
  const newHash = Buffer.from(rawForHash).toString('base64');

  const { data: existingDoc } = await supabaseAdmin
    .from('documents')
    .select('id, content_hash, audience')
    .eq('source_path', relPath)
    .maybeSingle();

  if (
    existingDoc && existingDoc.content_hash === newHash && existingDoc.audience === audience
  ) {
    const { count: totalChunkCount } = await supabaseAdmin
      .from('chunks')
      .select('id', { count: 'exact', head: true })
      .eq('document_id', existingDoc.id);
    const { count: nullEmbeddingCount } = await supabaseAdmin
      .from('chunks')
      .select('id', { count: 'exact', head: true })
      .eq('document_id', existingDoc.id)
      .is('embedding', null);

    if ((totalChunkCount ?? 0) > 0 && (nullEmbeddingCount ?? 0) === 0) {
      console.log(`  ⏭️  Bỏ qua document [${relPath}] — nội dung không đổi, đã có embedding đầy đủ.`);
      return;
    }
  }

  const { data: docData, error: docErr } = await supabaseAdmin
    .from('documents')
    .upsert(
      {
        source_path: relPath,
        title,
        content,
        summary: null,
        category_id: categoryId,
        status: 'published',
        audience,
        content_hash: newHash,
        synced_at: new Date().toISOString(),
      },
      { onConflict: 'source_path' }
    )
    .select('id')
    .single();

  if (docErr || !docData) {
    console.error(`  ❌ Lỗi upsert document [${relPath}]:`, docErr?.message);
    return;
  }

  const docId = docData.id;
  await supabaseAdmin.from('chunks').delete().eq('document_id', docId);

  const chunks = chunkMarkdown(content, 800, 0.15);
  const chunkTexts = chunks.map((c) => c.content);

  let embeddings: (number[] | null)[] = [];
  if (process.env.GEMINI_API_KEY) {
    embeddings = await embedBatch(chunkTexts, process.env.GEMINI_API_KEY, 'RETRIEVAL_DOCUMENT');
  }

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]!;
    const emb = embeddings[i] ?? null;
    await supabaseAdmin.from('chunks').insert({
      document_id: docId,
      ordinal: i + 1,
      content: c.content,
      heading_path: c.headingPath,
      token_count: c.tokenCount,
      embedding: emb,
    });
  }
}

async function main() {
  console.log('=== BẮT ĐẦU ĐỒNG BỘ NỘI DUNG (sync-content) ===');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const dryRun = process.env.SYNC_DRY_RUN === '1';
  const invalidConfig =
    !supabaseUrl ||
    !serviceKey ||
    /placeholder|xxxxx|your_/i.test(supabaseUrl) ||
    /placeholder|xxxxx|your_/i.test(serviceKey);
  const isConfigured = !dryRun && !invalidConfig;

  if (dryRun) {
    console.warn('DRY RUN: local validation only; Supabase writes and embeddings are disabled.');
  } else if (!isConfigured) {
    throw new Error(
      'Supabase is not configured. Set a real URL and service role key, or use SYNC_DRY_RUN=1.',
    );
  } else {
    console.log('Supabase configured. Starting content sync.');
  }

  // 1. Categories
  const catPath = path.join(process.cwd(), 'data', 'categories.yaml');
  const catMap = new Map<string, string>();

  if (fs.existsSync(catPath)) {
    console.log('\n--- 1. Đồng bộ Categories ---');
    const catContent = fs.readFileSync(catPath, 'utf8');
    const categories = yaml.load(catContent) as CategoryConfig[];

    if (Array.isArray(categories)) {
      for (const cat of categories) {
        console.log(`- Category: [${cat.slug}] ${cat.name}`);
        if (isConfigured) {
          const { data, error } = await supabaseAdmin
            .from('categories')
            .upsert(
              {
                slug: cat.slug,
                name: cat.name,
                description: cat.description ?? null,
                icon: cat.icon ?? null,
                sort_order: cat.sort_order ?? 0,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'slug' }
            )
            .select('id')
            .single();

          if (error) {
            console.error(`  ❌ Lỗi upsert category [${cat.slug}]:`, error.message);
          } else if (data) {
            catMap.set(cat.slug, data.id);
          }
        }
      }
    }
  }

  // 2. Config app_settings
  const configPath = path.join(process.cwd(), 'data', 'config.yaml');
  if (fs.existsSync(configPath)) {
    console.log('\n--- 2. Đồng bộ Config App Settings ---');
    const configRaw = fs.readFileSync(configPath, 'utf8');
    const configData = yaml.load(configRaw) as Record<string, unknown>;

    if (configData && typeof configData === 'object') {
      for (const [key, value] of Object.entries(configData)) {
        console.log(`- Config: ${key} = ${JSON.stringify(value)}`);
        if (isConfigured) {
          const { error } = await supabaseAdmin.from('app_settings').upsert({
            key,
            value: value as any,
            updated_at: new Date().toISOString(),
          });
          if (error) {
            console.error(`  ❌ Lỗi upsert config [${key}]:`, error.message);
          }
        }
      }
    }
  }

  // 3. Documents
  const documentDirs = ['documents', 'private-documents']
    .map((dir) => path.join(process.cwd(), 'data', dir)).filter(fs.existsSync);
  if (documentDirs.length > 0) {
    console.log('\n--- 3. Đồng bộ Documents & Chunks ---');
    const docFiles: string[] = [];

    function walkDocs(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDocs(full);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          docFiles.push(full);
        }
      }
    }
    documentDirs.forEach(walkDocs);
    const syncedPaths = new Set(
      docFiles.map((filePath) => path.relative(process.cwd(), filePath).replace(/\\/g, '/')),
    );

    for (const filePath of docFiles) {
      const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(raw);
      const fm = data as DocFrontmatter;

      console.log(`- Document: [${relPath}] "${fm.title || path.basename(filePath)}"`);

      if (isConfigured) {
        const catId = fm.category ? catMap.get(fm.category) ?? null : null;
        await syncDocumentChunks(
          relPath,
          fm.title || path.basename(filePath),
          content,
          catId,
          raw,
          fm.audience ?? 'public',
        );
      }
    }
  }

  // 4. FAQs
  const faqsDir = path.join(process.cwd(), 'data', 'faqs');
  if (fs.existsSync(faqsDir)) {
    console.log('\n--- 4. Đồng bộ FAQs ---');
    const faqFiles = fs.readdirSync(faqsDir).filter((f) => f.endsWith('.md'));

    for (const file of faqFiles) {
      const filePath = path.join(faqsDir, file);
      const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(raw);
      const fm = data as FaqFrontmatter;

      console.log(`- FAQ: [${relPath}] "${fm.question}"`);

      if (isConfigured) {
        const catId = fm.category ? catMap.get(fm.category) ?? null : null;
        const newHash = Buffer.from(raw).toString('base64');

        const { data: existingFaq } = await supabaseAdmin
          .from('faqs')
          .select('id, content_hash, embedding')
          .eq('source_path', relPath)
          .maybeSingle();

        let variantsFullyEmbedded = true;
        if (existingFaq && fm.variants && fm.variants.length > 0) {
          const { count: totalVariantCount } = await supabaseAdmin
            .from('faq_variants')
            .select('id', { count: 'exact', head: true })
            .eq('faq_id', existingFaq.id);
          const { count: nullVariantCount } = await supabaseAdmin
            .from('faq_variants')
            .select('id', { count: 'exact', head: true })
            .eq('faq_id', existingFaq.id)
            .is('embedding', null);
          variantsFullyEmbedded =
            (totalVariantCount ?? 0) === fm.variants.length && (nullVariantCount ?? 0) === 0;
        }

        const faqUnchanged =
          existingFaq &&
          existingFaq.content_hash === newHash &&
          existingFaq.embedding !== null &&
          variantsFullyEmbedded;

        if (faqUnchanged) {
          console.log(`  ⏭️  Bỏ qua FAQ [${relPath}] — nội dung không đổi, đã có embedding đầy đủ.`);
          continue;
        }

        let mainEmbedding: number[] | null = null;

        if (process.env.GEMINI_API_KEY) {
          const embeds = await embedBatch([fm.question], process.env.GEMINI_API_KEY, 'RETRIEVAL_DOCUMENT');
          mainEmbedding = embeds[0] ?? null;
        }

        const { data: faqData, error: faqErr } = await supabaseAdmin
          .from('faqs')
          .upsert(
            {
              source_path: relPath,
              question: fm.question,
              answer: content.trim(),
              category_id: catId,
              priority: fm.priority ?? 0,
              is_active: fm.is_active ?? true,
              embedding: mainEmbedding,
              content_hash: newHash,
              synced_at: new Date().toISOString(),
            },
            { onConflict: 'source_path' }
          )
          .select('id')
          .single();

        if (faqErr || !faqData) {
          console.error(`  ❌ Lỗi upsert FAQ [${relPath}]:`, faqErr?.message);
          continue;
        }

        const faqId = faqData.id;
        await supabaseAdmin.from('faq_variants').delete().eq('faq_id', faqId);

        if (fm.variants && Array.isArray(fm.variants) && fm.variants.length > 0) {
          let variantEmbeddings: (number[] | null)[] = [];
          if (process.env.GEMINI_API_KEY) {
            variantEmbeddings = await embedBatch(fm.variants, process.env.GEMINI_API_KEY, 'RETRIEVAL_DOCUMENT');
          }

          for (let i = 0; i < fm.variants.length; i++) {
            const vText = fm.variants[i]!;
            const vEmb = variantEmbeddings[i] ?? null;
            await supabaseAdmin.from('faq_variants').insert({
              faq_id: faqId,
              question: vText,
              embedding: vEmb,
            });
          }
        }

        // Đồng bộ song song nội dung FAQ vào kho chunks RAG (search_chunks_hybrid/fts),
        // để khi matchFaq() trượt (câu hỏi diễn đạt khác variants), retrieveChunks() vẫn tìm thấy.
        const faqDocContent = `# ${fm.question}\n\n${content.trim()}`;
        await syncDocumentChunks(relPath, fm.question, faqDocContent, catId, raw);
        await sleep(200);
      }
    }
  }

  // 5. Xóa semantic cache khi nội dung thay đổi
  if (isConfigured) {
    await supabaseAdmin.from('semantic_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }

  console.log('\n=== ĐỒNG BỘ NỘI DUNG HOÀN TẤT THÀNH CÔNG ===');
}

main().catch((err) => {
  if (err instanceof DailyQuotaExceededError) {
    console.error('\n💥 Quota embedding Gemini Free Tier theo NGÀY đã cạn (1000 request/ngày).');
    console.error('   Dừng sync ngay để tránh lãng phí thời gian retry vô ích.');
    console.error('   Chờ quota reset (theo ngày, UTC) hoặc đổi GEMINI_API_KEY khác rồi chạy lại.');
    process.exit(1);
  }
  console.error('💥 Lỗi không xác định trong sync-content:', err);
  process.exit(1);
});
