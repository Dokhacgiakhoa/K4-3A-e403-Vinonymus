import type { CatalogLab } from '@/types/planner';

// Catalog mẫu cho CP2. Repo công khai nên CHỈ chứa link tài liệu công khai —
// không đưa link Zoom/recording kèm passcode, Drive nội bộ hay nội dung chép từ data pack.
// Nhóm thay bằng tài liệu lab thật ở task T3-01.
export const PLANNER_CATALOG: CatalogLab[] = [
  {
    labId: 'lab-prompt-tool-calling',
    title: 'Lab · Prompt Engineering & Tool Calling',
    description: 'Viết prompt có cấu trúc và cho LLM gọi hàm.',
    items: [
      {
        itemId: 'ptc-setup-colab',
        title: 'Chuẩn bị notebook Colab và API key',
        url: 'https://ai.google.dev/gemini-api/docs/quickstart',
        type: 'notebook',
        minutes: 15,
        level: 'basic',
        tags: ['setup', 'colab', 'notebook', 'api key'],
        why: 'Không có môi trường chạy thì không làm được bài lab.',
      },
      {
        itemId: 'ptc-prompt-basics',
        title: 'Nguyên tắc viết prompt: vai trò, ngữ cảnh, định dạng đầu ra',
        url: 'https://www.promptingguide.ai/introduction/basics',
        type: 'doc',
        minutes: 25,
        level: 'basic',
        tags: ['prompt', 'intro'],
        why: 'Phần lý thuyết nền mà bài lab dùng ngay ở câu đầu.',
      },
      {
        itemId: 'ptc-few-shot',
        title: 'Few-shot và chain-of-thought',
        url: 'https://www.promptingguide.ai/techniques/fewshot',
        type: 'doc',
        minutes: 20,
        level: 'advanced',
        tags: ['prompt', 'few-shot'],
        why: 'Kỹ thuật cần để qua các testcase khó của lab.',
      },
      {
        itemId: 'ptc-function-calling',
        title: 'Function calling với Gemini API',
        url: 'https://ai.google.dev/gemini-api/docs/function-calling',
        type: 'doc',
        minutes: 30,
        level: 'advanced',
        tags: ['tool calling', 'function calling'],
        why: 'Trọng tâm phần thực hành: cho model gọi hàm và xử lý kết quả.',
      },
      {
        itemId: 'ptc-structured-output',
        title: 'Ép model trả JSON đúng schema',
        url: 'https://ai.google.dev/gemini-api/docs/structured-output',
        type: 'doc',
        minutes: 15,
        level: 'advanced',
        tags: ['json', 'schema'],
        why: 'Giúp kết quả tool calling parse được, tránh lỗi khi chấm.',
      },
    ],
  },
  {
    labId: 'lab-ai-product-spec',
    title: 'Lab · Xác định bài toán & viết AI Spec',
    description: 'Tìm nỗi đau có bằng chứng, cắt lát, viết spec.',
    items: [
      {
        itemId: 'aps-mom-test',
        title: 'Phỏng vấn người dùng theo The Mom Test',
        url: 'https://www.momtestbook.com/',
        type: 'doc',
        minutes: 20,
        level: 'basic',
        tags: ['phỏng vấn', 'khảo sát', 'intro'],
        why: 'Cần có bằng chứng người thật trước khi viết spec.',
      },
      {
        itemId: 'aps-jtbd',
        title: 'Viết job statement theo Jobs-to-be-Done',
        url: 'https://strategyn.com/jobs-to-be-done/',
        type: 'doc',
        minutes: 25,
        level: 'basic',
        tags: ['jtbd', 'job'],
        why: 'Mục §1 của spec yêu cầu job statement không có chữ AI.',
      },
      {
        itemId: 'aps-pair',
        title: 'PAIR Guidebook: thiết kế trải nghiệm AI',
        url: 'https://pair.withgoogle.com/guidebook/',
        type: 'doc',
        minutes: 30,
        level: 'advanced',
        tags: ['ux', 'pair', 'nguyên tắc'],
        why: 'Nguồn cho mục §4b nguyên tắc thiết kế.',
      },
      {
        itemId: 'aps-hax',
        title: '18 nguyên tắc HAX của Microsoft',
        url: 'https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/',
        type: 'doc',
        minutes: 15,
        level: 'advanced',
        tags: ['ux', 'hax', 'nguyên tắc'],
        why: 'Checklist nhanh để chọn ≥4 nguyên tắc áp vào prototype.',
      },
    ],
  },
];

export function findLab(labId: string): CatalogLab | undefined {
  return PLANNER_CATALOG.find((lab) => lab.labId === labId);
}
