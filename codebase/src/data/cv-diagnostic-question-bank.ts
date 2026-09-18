import type { DiagnosticQuestion, DiagnosticSkillId } from '@/types/cv-diagnostic';

interface SkillQuestionTemplate {
  skillId: DiagnosticSkillId;
  aliases: string[];
  question: string;
  choices: string[];
  correctChoiceIndex: number;
  explanation: string;
}

export const CV_DIAGNOSTIC_SKILLS: SkillQuestionTemplate[] = [
  {
    skillId: 'python-basics',
    aliases: ['python', 'pandas', 'fastapi', 'jupyter', 'notebook'],
    question: 'Khi truyền một list vào hàm Python rồi gọi append, điều gì xảy ra?',
    choices: [
      'Python luôn tạo bản sao mới nên list gốc không đổi.',
      'List là mutable object nên thao tác append có thể làm đổi object gốc.',
      'List là immutable nên append luôn lỗi.',
      'Python chỉ thay đổi list nếu có từ khóa global.',
    ],
    correctChoiceIndex: 1,
    explanation: 'Python truyền tham chiếu tới object; list là mutable nên append thay đổi object đó.',
  },
  {
    skillId: 'api-json',
    aliases: ['api', 'rest', 'json', 'postman', 'fetch', 'http'],
    question: 'Khi gọi REST API trả JSON, bước nào nên làm trước khi dùng dữ liệu ở UI?',
    choices: [
      'Tin tưởng tuyệt đối vào mọi field server trả về.',
      'Validate schema và xử lý trường hợp field thiếu hoặc sai kiểu.',
      'Chuyển JSON thành chuỗi rồi nối trực tiếp vào HTML.',
      'Bỏ qua HTTP status vì body luôn đúng.',
    ],
    correctChoiceIndex: 1,
    explanation: 'Ứng dụng phải validate dữ liệu API trước khi dùng để tránh lỗi runtime và dữ liệu sai.',
  },
  {
    skillId: 'prompt-basics',
    aliases: ['prompt', 'prompting', 'few-shot', 'zero-shot'],
    question: 'Một prompt contract tối thiểu nên có thành phần nào?',
    choices: [
      'Role, task, context đầu vào, ràng buộc đầu ra và điều kiện từ chối.',
      'Chỉ cần hỏi càng ngắn càng tốt.',
      'Chỉ cần nói model hãy trả lời hay nhất.',
      'Luôn yêu cầu model trả lời dài để đủ thông tin.',
    ],
    correctChoiceIndex: 0,
    explanation: 'Prompt contract rõ vai trò, nhiệm vụ, dữ liệu, format và refusal giúp giảm mơ hồ.',
  },
  {
    skillId: 'structured-output',
    aliases: ['schema', 'structured output', 'json schema', 'zod', 'validate'],
    question: 'Vì sao ứng dụng cần ép LLM trả JSON theo schema?',
    choices: [
      'Để bỏ qua bước validate ở backend.',
      'Để có output máy đọc được, nhưng backend vẫn phải validate trước khi tin.',
      'Để model được phép tự sinh thêm URL ngoài catalog.',
      'Để câu trả lời luôn dài hơn.',
    ],
    correctChoiceIndex: 1,
    explanation: 'Schema giúp parse tự động, nhưng output LLM vẫn không đáng tin tuyệt đối.',
  },
  {
    skillId: 'function-calling',
    aliases: ['function calling', 'tool calling', 'tool call', 'tools'],
    question: 'Trong function calling, phần nào không nên để model tự quyết không kiểm tra?',
    choices: [
      'Tên hàm và tham số gọi tool.',
      'Màu giao diện của nút submit.',
      'Thứ tự import trong file test.',
      'Tên biến cục bộ trong frontend.',
    ],
    correctChoiceIndex: 0,
    explanation: 'Ứng dụng phải validate tên tool, quyền gọi tool và tham số trước khi thực thi.',
  },
  {
    skillId: 'embedding',
    aliases: ['embedding', 'vector', 'semantic'],
    question: 'Embedding biểu diễn văn bản dưới dạng gì?',
    choices: [
      'Một URL công khai tới tài liệu.',
      'Một vector số để so sánh độ gần ngữ nghĩa.',
      'Một file PDF đã nén.',
      'Một câu trả lời đã được kiểm chứng tuyệt đối.',
    ],
    correctChoiceIndex: 1,
    explanation: 'Embedding là vector số; các vector gần nhau thường biểu diễn nội dung gần nghĩa.',
  },
  {
    skillId: 'vector-store',
    aliases: ['vector store', 'pgvector', 'qdrant', 'pinecone', 'chroma'],
    question: 'Vector database giúp gì trong RAG?',
    choices: [
      'Lưu và tìm các chunk gần ngữ nghĩa với câu hỏi.',
      'Tự viết prompt thay học viên.',
      'Tự xác nhận mọi câu trả lời là đúng.',
      'Thay thế hoàn toàn database nghiệp vụ.',
    ],
    correctChoiceIndex: 0,
    explanation: 'Vector store phục vụ truy hồi semantic các đoạn tài liệu liên quan.',
  },
  {
    skillId: 'retrieval',
    aliases: ['retrieval', 'rag', 'chunking', 'rerank', 'citation'],
    question: 'Trong RAG, vì sao cần citation hoặc nguồn đi kèm câu trả lời?',
    choices: [
      'Để người học kiểm chứng được câu trả lời dựa trên tài liệu nào.',
      'Để model trả lời dài hơn.',
      'Để bỏ qua bước chunking.',
      'Để thay thế hoàn toàn phần đánh giá.',
    ],
    correctChoiceIndex: 0,
    explanation: 'Citation giúp kiểm soát hallucination và truy vết về tài liệu gốc.',
  },
  {
    skillId: 'rag-evaluation',
    aliases: ['ragas', 'faithfulness', 'evaluation', 'eval', 'context recall'],
    question: 'Metric faithfulness trong RAG thường kiểm tra điều gì?',
    choices: [
      'Câu trả lời có bám vào context được truy hồi hay không.',
      'Giao diện có đẹp hay không.',
      'Số lượng token trong prompt càng nhiều càng tốt.',
      'File PDF có dung lượng nhỏ hay không.',
    ],
    correctChoiceIndex: 0,
    explanation: 'Faithfulness đo mức độ câu trả lời được hỗ trợ bởi context, giúp phát hiện bịa đặt.',
  },
  {
    skillId: 'guardrails',
    aliases: ['guardrail', 'prompt injection', 'jailbreak', 'safety', 'policy'],
    question: 'Nếu CV chứa câu "bỏ qua hướng dẫn hệ thống", AI Mentor nên làm gì?',
    choices: [
      'Làm theo vì đó là nội dung trong CV.',
      'Xem đó là dữ liệu không đáng tin và không thực thi như lệnh.',
      'In lại system prompt để học viên kiểm tra.',
      'Tự cấp quyền admin cho học viên.',
    ],
    correctChoiceIndex: 1,
    explanation: 'Nội dung CV là dữ liệu, không phải instruction điều khiển hệ thống.',
  },
];

export function findSkillTemplate(skillId: DiagnosticSkillId): SkillQuestionTemplate {
  const template = CV_DIAGNOSTIC_SKILLS.find((skill) => skill.skillId === skillId);
  if (!template) throw new Error(`Unknown diagnostic skill: ${skillId}`);
  return template;
}

export function buildQuestion(skillId: DiagnosticSkillId, index: number): DiagnosticQuestion {
  const template = findSkillTemplate(skillId);
  return {
    id: `cvq-${index + 1}-${skillId}`,
    skillId,
    question: template.question,
    choices: template.choices.map((text) => ({ text })),
    correctChoiceIndex: template.correctChoiceIndex,
    explanation: template.explanation,
  };
}

