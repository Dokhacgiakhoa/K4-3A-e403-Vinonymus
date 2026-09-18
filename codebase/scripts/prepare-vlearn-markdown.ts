import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const INPUT_DIR = path.resolve(process.cwd(), 'data', 'Vlearn_data');
const OUTPUT_DIR = path.resolve(process.cwd(), 'data', 'private-documents');
const MISSING_TEXT = /kh.ng c. v.n b.n tr.ch xu.t/i;
const MOJIBAKE = /\u00c3|\u00c2|\u00c6|\u00c4|\u00e2[\u20ac\u2122\u0153\u201c\u201d]|\u00e1[\u00ba\u00bb]/u;

const WINDOWS_1252_BYTES = new Map<string, number>([
  ['\u20ac', 0x80], ['\u201a', 0x82], ['\u0192', 0x83], ['\u201e', 0x84],
  ['\u2026', 0x85], ['\u2020', 0x86], ['\u2021', 0x87], ['\u02c6', 0x88],
  ['\u2030', 0x89], ['\u0160', 0x8a], ['\u2039', 0x8b], ['\u0152', 0x8c],
  ['\u017d', 0x8e], ['\u2018', 0x91], ['\u2019', 0x92], ['\u201c', 0x93],
  ['\u201d', 0x94], ['\u2022', 0x95], ['\u2013', 0x96], ['\u2014', 0x97],
  ['\u02dc', 0x98], ['\u2122', 0x99], ['\u0161', 0x9a], ['\u203a', 0x9b],
  ['\u0153', 0x9c], ['\u017e', 0x9e], ['\u0178', 0x9f],
]);

function listMarkdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(fullPath);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.md') ? [fullPath] : [];
  });
}

function mojibakeScore(text: string): number {
  return [...text.matchAll(new RegExp(MOJIBAKE.source, 'gu'))].length;
}

function decodeWindows1252AsUtf8(text: string): string | null {
  const bytes: number[] = [];
  for (const char of text) {
    const code = char.codePointAt(0)!;
    if (code <= 0xff) bytes.push(code);
    else if (WINDOWS_1252_BYTES.has(char)) bytes.push(WINDOWS_1252_BYTES.get(char)!);
    else return null;
  }

  const decoded = Buffer.from(bytes).toString('utf8');
  return decoded.includes('\uFFFD') ? null : decoded;
}

function repairLine(line: string): string {
  let current = line;
  for (let attempt = 0; attempt < 2 && MOJIBAKE.test(current); attempt += 1) {
    const decoded = decodeWindows1252AsUtf8(current);
    if (!decoded || mojibakeScore(decoded) >= mojibakeScore(current)) break;
    current = decoded;
  }
  return current;
}

function normalizeMarkdown(raw: string, title: string): string {
  let content = raw
    .replace(/^\uFEFF/, '')
    .replace(/\f/g, '\n')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => repairLine(line).trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (/^#\s+day\d+[\w_-]*\s*$/iu.test(content.split('\n')[0] ?? '')) {
    content = content.split('\n').slice(1).join('\n').trimStart();
  }
  if (!content.startsWith('# ')) content = `# ${title}\n\n${content}`;

  return `${content}\n`;
}

function titleFor(filePath: string, raw: string): string {
  const relative = path.relative(INPUT_DIR, filePath);
  const day = relative.match(/Day(\d+)/i)?.[1] ?? '00';
  const item = path.basename(filePath, path.extname(filePath)).match(/[_-](\d+)$/)?.[1] ?? '01';
  const firstLine = raw
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => repairLine(line).replace(/^#+\s*/, '').trim())
    .find(Boolean);

  if (firstLine && firstLine.length <= 100 && !/^day\s*\d+/i.test(firstLine)) return firstLine;
  return `AI in Action \u2014 Ng\u00e0y ${Number(day)} \u2014 T\u00e0i li\u1ec7u ${Number(item)}`;
}

function isBrokenExtraction(raw: string): boolean {
  const nonEmptyLines = raw.split(/\r?\n/).filter((line) => line.trim());
  const missingLines = nonEmptyLines.filter((line) => MISSING_TEXT.test(line));
  return missingLines.length >= 5 && missingLines.length / nonEmptyLines.length >= 0.4;
}

function main(): void {
  if (!fs.existsSync(INPUT_DIR)) throw new Error(`Missing private Markdown directory: ${INPUT_DIR}`);
  if (OUTPUT_DIR !== path.resolve(INPUT_DIR, '..', 'private-documents')) {
    throw new Error('Refusing to write outside codebase/data/private-documents');
  }

  // ponytail: never delete this private directory; use a manifest before adding clean rebuilds.
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const hashes = new Set<string>();
  let prepared = 0;
  let duplicate = 0;
  let broken = 0;

  for (const filePath of listMarkdownFiles(INPUT_DIR).sort()) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const hash = createHash('sha256').update(raw).digest('hex');
    if (hashes.has(hash)) {
      duplicate += 1;
      continue;
    }
    hashes.add(hash);

    if (isBrokenExtraction(raw)) {
      broken += 1;
      continue;
    }

    const relative = path.relative(INPUT_DIR, filePath);
    const title = titleFor(filePath, raw);
    const day = Number(relative.match(/Day(\d+)/i)?.[1] ?? 0);
    const outputPath = path.join(OUTPUT_DIR, relative);
    const content = normalizeMarkdown(raw, title);
    const preparedMarkdown = matter.stringify(content, {
      title,
      category: 'chuong-trinh-hoc',
      status: 'published',
      audience: 'learning',
      day,
      tags: ['ai-in-action', `day-${String(day).padStart(2, '0')}`],
    });

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, preparedMarkdown, 'utf8');
    prepared += 1;
  }

  console.log(`Prepared ${prepared} Markdown files; skipped ${duplicate} duplicates and ${broken} broken files.`);
}

main();
