import fs from 'fs';
import path from 'path';

interface OcrResult {
  markdown: string;
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
  detected_language: string;
}

async function main() {
  const args = process.argv.slice(2);
  const imagePath = args[0];

  if (!imagePath) {
    console.error('❌ Lỗi: Vui lòng cung cấp đường dẫn ảnh. Ví dụ: npm run ocr -- path/to/image.png [--hint "..."]');
    process.exit(1);
  }

  const fullPath = path.resolve(imagePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Lỗi: File ảnh không tồn tại tại đường dẫn: ${fullPath}`);
    process.exit(1);
  }

  let hint = '';
  const hintIndex = args.indexOf('--hint');
  if (hintIndex >= 0 && args[hintIndex + 1]) {
    hint = args[hintIndex + 1]!;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Lỗi: Cần khai báo GEMINI_API_KEY trong biến môi trường để chạy script OCR.');
    process.exit(1);
  }

  console.log(`📸 Đang thực hiện OCR cho file ảnh: ${fullPath}`);
  if (hint) {
    console.log(`💡 Gợi ý ngữ cảnh: "${hint}"`);
  }

  const imageBuffer = fs.readFileSync(fullPath);
  const base64Image = imageBuffer.toString('base64');
  const ext = path.extname(fullPath).toLowerCase().replace('.', '');
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

  const systemPrompt = `Bạn là công cụ trích xuất văn bản từ hình ảnh, phục vụ kho tài liệu của một khóa học.

NHIỆM VỤ
Đọc toàn bộ nội dung văn bản trong ảnh và chuyển thành markdown có cấu trúc.

QUY TẮC
1. Trích xuất NGUYÊN VĂN. Không tóm tắt, không diễn giải lại, không "sửa cho hay hơn".
2. Giữ đúng cấu trúc gốc:
   - Bảng trong ảnh  → bảng markdown
   - Tiêu đề         → heading markdown (#, ##, ###)
   - Danh sách       → danh sách markdown
   - Chữ in đậm/gạch chân → **in đậm**
3. Ngày giờ, số tiền, con số: chép CHÍNH XÁC từng ký tự. Đây là phần dễ sai nhất.
4. Chỗ nào KHÔNG đọc rõ: ghi [không đọc rõ] tại đúng vị trí đó. TUYỆT ĐỐI KHÔNG ĐOÁN.
5. Ảnh không chứa văn bản nào → trả markdown rỗng và ghi warning.

${hint ? `GỢI Ý THÊM: ${hint}` : ''}

ĐỊNH DẠNG TRẢ VỀ — CHỈ TRẢ VỀ ĐÚNG MỘT OBJECT JSON, KHÔNG BỌC CODE BLOCK MARKDOWN:
{
  "markdown": "...",
  "warnings": [],
  "confidence": "high",
  "detected_language": "vi"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    console.error(`❌ OCR API Error ${response.status}: ${await response.text()}`);
    process.exit(1);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  console.log('\n================ NỘI DUNG OCR TRÍCH XUẤT (STDOUT) ================');
  try {
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleaned) as OcrResult;
    console.log(result.markdown);
    console.log('\n---------------- METADATA ----------------');
    console.log(`Mức độ tin cậy: ${result.confidence}`);
    console.log(`Ngôn ngữ phát hiện: ${result.detected_language}`);
    if (result.warnings?.length) {
      console.log(`Cảnh báo: ${result.warnings.join(', ')}`);
    }
  } catch {
    console.log(rawText);
  }
  console.log('==================================================================');
  console.log('💡 LƯU Ý: Script OCR không tự ghi vào data/. Hãy kiểm tra lại kết quả trên và copy vào file markdown tương ứng.');
}

main().catch((err) => {
  console.error('💥 Lỗi không xác định:', err);
  process.exit(1);
});
