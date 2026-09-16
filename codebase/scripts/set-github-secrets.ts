import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const repo = 'Dokhacgiakhoa/aiia-notebook';

// Read .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnvValue(key: string): string {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match && match[1] ? match[1].trim() : '';
}

const supabaseUrl = getEnvValue('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvValue('SUPABASE_SERVICE_ROLE_KEY');
const geminiApiKey = getEnvValue('GEMINI_API_KEY');
const appUrl = 'https://aiia.kailabs.io.vn';
const cronSecret = crypto.randomBytes(32).toString('hex');

console.log('🔑 Đang thiết lập các GitHub Secrets cho repository:', repo);

const secrets: Record<string, string> = {
  CRON_SECRET: cronSecret,
  APP_URL: appUrl,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey,
  GEMINI_API_KEY: geminiApiKey,
};

for (const [name, val] of Object.entries(secrets)) {
  if (!val) {
    console.error(`❌ Thiếu giá trị cho ${name}`);
    continue;
  }
  try {
    execSync(`gh secret set ${name} --repo ${repo} --body "${val}"`, { stdio: 'inherit' });
    console.log(`✅ Đã thiết lập GitHub Secret: ${name}`);
  } catch (err: any) {
    console.error(`❌ Lỗi khi thiết lập ${name}:`, err.message);
  }
}

// Thêm CRON_SECRET vào .env.local nếu chưa có
if (!envContent.includes('CRON_SECRET=')) {
  fs.appendFileSync(envPath, `\n# Secret xác thực cho Cron Keep-Alive\nCRON_SECRET=${cronSecret}\n`, 'utf8');
  console.log('✅ Đã lưu CRON_SECRET vào tệp .env.local');
}

console.log('\n🎉 Hoàn thành thiết lập toàn bộ Secrets trên GitHub!');
