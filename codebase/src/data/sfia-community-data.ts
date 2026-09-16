/**
 * K.AI Labs Community Knowledge Hub - Master Curriculum & Mock Tests Data
 * Standard: SFIA Framework (v8 - 7 Levels of Responsibility) & Bloom's Taxonomy
 * Scope: 100% Public Open Educational Materials & Standard Academic Curriculum
 */

export interface SfiaLevelItem {
  id: string;
  levelNumber: number;
  title: string;
  tagline: string;
  bloomTaxonomy: string;
  color: string;
  badgeColor: string;
  accentHex: string;
  autonomy: string;
  targetAudience: string;
  startingFor: string[];
  objectives: string[];
  coreTheory: Array<{ topic: string; detail: string }>;
  techniques: Array<{ name: string; desc: string; code: string }>;
  tools: string[];
  practicalProject: { name: string; desc: string; deliverables: string[] };
}

export interface ProjectRoleItem {
  role: string;
  roleName: string;
  skillsRequired: string[];
  projectDeliverable: string;
}

export interface ModuleAssignmentItem {
  id: string;
  asmNumber: number;
  title: string;
  durationMinutes: number;
  summary: string;
  commandSnippet?: { language: string; title: string; code: string };
  deliverables: string[];
}

export interface CurriculumModuleItem {
  id: string;
  moduleNumber: number;
  levelCode: string;
  title: string;
  tag: string;
  levelTag: string;
  bloomTaxonomy: string;
  targetAudience: string;
  startingFor: 'NONTECH' | 'TECHBASE' | 'AIBASE' | 'UNIVERSAL' | string;
  description: string;
  crossFunctionalRoles?: ProjectRoleItem[];
  assignment?: ModuleAssignmentItem;
  topics: Array<{
    title: string;
    description: string;
    codeSnippet?: { language: string; title: string; code: string };
  }>;
}

export interface MockTestQuestion {
  id: string;
  questionText: string;
  bloomLevel: string;
  codeBlock?: string;
  options: Array<{ id: string; text: string }>;
  correctOption: string;
  explanation: string;
}

export interface MockTestEssayQuestion {
  id: string;
  title: string;
  scenario: string;
  requirements: string[];
  sampleAnswerGuide: string;
  scoringCriteria: string[];
}

export interface MockTestItem {
  id: string;
  title: string;
  targetLevel: string;
  levelNumber: number;
  durationMinutes: number;
  passingScore: number;
  description: string;
  sources: string;
  targetGroup: string;
  questions: MockTestQuestion[];
  essayQuestions?: MockTestEssayQuestion[];
}

export interface TechCategoryItem {
  category: string;
  icon: string;
  description: string;
  technologies: Array<{ name: string; desc: string; tag: string }>;
}

export interface OpenSourceRepoItem {
  id: string;
  organization: string;
  badgeColor: string;
  stars: string;
  repoName: string;
  categoryTag: string;
  description: string;
  practicalHighlight: string;
  coreTopics: string[];
  githubUrl: string;
}

export const SFIA_COMMUNITY_DATA = {
  // 1. 7 CẤP ĐỘ NĂNG LỰC SFIA (v8)
  levels: [
    {
      id: "L1",
      levelNumber: 1,
      title: "FOLLOW (Nhận biết - Remember)",
      tagline: "Vận hành tác vụ AI cơ bản theo quy trình chuẩn từng bước",
      bloomTaxonomy: "Remember",
      color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400",
      badgeColor: "bg-cyan-950/80 text-cyan-300 border-cyan-700/50",
      accentHex: "#06b6d4",
      autonomy: "Làm việc dưới sự hướng dẫn trực tiếp, tuân thủ nghiêm ngặt các quy trình và template có sẵn.",
      targetAudience: "Non-tech & Business, Người mới bắt đầu",
      startingFor: ["NONTECH"],
      objectives: [
        "Hiểu bản chất Token, Context Window và cơ chế sinh xác suất của Large Language Models.",
        "Kiểm soát các siêu tham số cơ bản: Temperature (0.0 - 1.0), Top-p, Max Tokens.",
        "Áp dụng thành thạo các mẫu Prompt Template để tăng hiệu suất làm việc x3 lần.",
        "Nhận diện và chủ động phòng ngừa hiện tượng ảo giác (Hallucination)."
      ],
      coreTheory: [
        {
          topic: "Bản chất Token & Context Window",
          detail: "Token là đơn vị xử lý ngôn ngữ nhỏ nhất (khoảng 0.75 từ tiếng Anh, hoặc 1-2 ký tự tiếng Việt với BPE Tokenizer). Context Window là giới hạn bộ nhớ ngữ cảnh mà mô hình có thể tiếp nhận trong một phiên xử lý."
        },
        {
          topic: "Tham số Temperature & Top-p",
          detail: "Temperature (0.0 - 2.0) điều chỉnh độ ngẫu nhiên xác suất phân phối từ tiếp theo (0: xác định, chính xác; 1.0+: sáng tạo). Top-p (Nucleus Sampling) giới hạn tập hợp các token có tổng xác suất tích lũy đạt p."
        },
        {
          topic: "Hiện tượng Ảo giác (Hallucination)",
          detail: "Xảy ra khi LLM tạo ra thông tin nghe có vẻ hợp lý nhưng hoàn toàn sai lệch thực tế do bản chất là mô hình sinh xác suất (Probabilistic Next-Token Predictor)."
        }
      ],
      techniques: [
        {
          name: "Zero-shot & Few-shot Prompting",
          desc: "Kỹ thuật hướng dẫn mô hình bằng ngữ cảnh rõ ràng kèm 1-3 ví dụ mẫu chuẩn trước khi yêu cầu sinh phản hồi.",
          code: `# Mẫu Few-Shot Prompt Chuẩn
Bạn là chuyên viên phân tích tài chính. Phân loại cảm xúc các câu sau:
1. "Doanh thu quý 3 tăng trưởng vượt kỳ vọng 25%" -> Tích cực
2. "Chi phí vận hành tăng do giá nguyên vật liệu" -> Tiêu cực
3. "Báo cáo tài chính sẽ công bố vào thứ sáu" -> Trung tính
Phân loại câu này: "Lợi nhuận gộp duy trì ổn định nhưng biên lãi giảm nhẹ" -> `
        }
      ],
      tools: ["ChatGPT", "Claude", "Google Gemini", "Notion AI", "Prompt Templates"],
      practicalProject: {
        name: "Bộ Template Tác Vụ Tự Động Hóa Văn Phòng",
        desc: "Xây dựng thư viện Prompt chuẩn hóa cho 5 quy trình nghiệp vụ: Tóm tắt văn bản, Soạn thảo email, Phân loại phản hồi khách hàng, Trích xuất thông tin hợp đồng và Lập dàn ý bài thuyết trình.",
        deliverables: ["Thư viện 10 Master Prompts", "Tài liệu kiểm soát lỗi ảo giác", "Báo cáo hiệu suất công việc"]
      }
    },
    {
      id: "L2",
      levelNumber: 2,
      title: "ASSIST (Hiểu sâu - Understand)",
      tagline: "Hiểu nguyên lý hoạt động, gán nhãn dữ liệu & tạo Prompt pipeline cơ bản",
      bloomTaxonomy: "Understand",
      color: "from-teal-500/20 to-emerald-500/20 border-teal-500/40 text-teal-400",
      badgeColor: "bg-teal-950/80 text-teal-300 border-teal-700/50",
      accentHex: "#14b8a6",
      autonomy: "Làm việc có sự chủ động trong phạm vi quy trình xác định, hỗ trợ kiểm thử và tinh chỉnh.",
      targetAudience: "Non-tech nâng cao, Business Analyst, QA",
      startingFor: ["NONTECH"],
      objectives: [
        "Làm chủ kỹ thuật Chain-of-Thought (CoT) Prompting và Structured Output (JSON Mode).",
        "Hiểu quy trình chuẩn bị và làm sạch dữ liệu gán nhãn (Data Labeling & Cleansing).",
        "Tích hợp mô hình AI vào các công cụ tự động hóa không cần code (Make, Zapier, n8n).",
        "Nắm vững nguyên tắc an toàn dữ liệu cá nhân (PII) và bản quyền sở hữu trí tuệ."
      ],
      coreTheory: [
        {
          topic: "Chain-of-Thought (CoT) Reasoning",
          detail: "Kỹ thuật yêu cầu mô hình suy luận từng bước (Step-by-Step) trước khi đưa ra kết luận, giúp tăng độ chính xác trong các bài toán logic và toán học từ 40% lên hơn 85%."
        },
        {
          topic: "Structured Outputs (JSON Schema)",
          detail: "Cưỡng chế mô hình trả về định dạng JSON nghiêm ngặt tuân theo JSON Schema, đảm bảo dữ liệu đầu ra có thể tích hợp trực tiếp vào hệ thống cơ sở dữ liệu."
        }
      ],
      techniques: [
        {
          name: "Structured Output với Pydantic / JSON Schema",
          desc: "Định nghĩa cấu trúc dữ liệu đầu ra nghiêm ngặt cho API AI.",
          code: `{\n  "name": "extract_invoice",\n  "schema": {\n    "type": "object",\n    "properties": {\n      "invoice_id": {"type": "string"},\n      "amount": {"type": "number"},\n      "due_date": {"type": "string"}\n    },\n    "required": ["invoice_id", "amount", "due_date"]\n  }\n}`
        }
      ],
      tools: ["Make.com", "n8n", "Postman", "OpenAI Playground", "LangSmith Basic"],
      practicalProject: {
        name: "Hệ Thống Trích Xuất Dữ Liệu Hóa Đơn Tự Động",
        desc: "Xây dựng luồng tự động nhận email hóa đơn PDF, trích xuất dữ liệu có cấu trúc JSON và đồng bộ vào bảng dữ liệu quản lý tài chính.",
        deliverables: ["Luồng Workflow tự động n8n/Make", "JSON Schema kiểm soát tính đúng đắn", "Dashboard theo dõi lỗi"]
      }
    },
    {
      id: "L3",
      levelNumber: 3,
      title: "APPLY (Áp dụng - Apply)",
      tagline: "Tự chủ xây dựng MVP, tích hợp Vector DB, Hybrid RAG & Backend FastAPI SSE",
      bloomTaxonomy: "Apply",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400",
      badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-700/50",
      accentHex: "#10b981",
      autonomy: "Tự chủ triển khai toàn bộ tính năng RAG từ khâu xử lý dữ liệu đến tích hợp Vector Database và Backend API.",
      targetAudience: "Tech-base (Web/Mobile/Backend Developers, Data Engineers)",
      startingFor: ["TECHBASE"],
      objectives: [
        "Hiểu sâu về cơ chế tính toán Vector Embedding và khoảng cách Cosine Distance.",
        "Thiết lập và tối ưu hóa Vector Database chuyên dụng (Qdrant, pgvector, ChromaDB).",
        "Áp dụng các chiến lược chia đoạn văn bản (Chunking Strategies: Recursive, Sliding Window).",
        "Xây dựng Web API bất đồng bộ với FastAPI và Server-Sent Events (SSE) Streaming."
      ],
      coreTheory: [
        {
          topic: "Không gian Vector & Cosine Similarity",
          detail: "Mỗi đoạn văn bản được ánh xạ thành một vector đa chiều d (ví dụ d=1536). Độ tương đồng ngữ nghĩa được đo bằng cos(u, v) = (u . v) / (||u|| * ||v||)."
        },
        {
          topic: "Cấu trúc Chỉ mục HNSW (Hierarchical Navigable Small World)",
          detail: "Xây dựng đồ thị đa tầng phân cấp lấy cảm hứng từ Skip List, cho phép tìm kiếm láng giềng gần nhất (ANN) với độ phức tạp thời gian trung bình O(log N)."
        }
      ],
      techniques: [
        {
          name: "FastAPI SSE Streaming & Vector Search",
          desc: "Truy vấn Qdrant và stream token phản hồi về client với thời gian phản hồi đầu tiên (TTFT) dưới 300ms.",
          code: `from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\n\napp = FastAPI()\n\nasync def stream_rag_tokens(query: str):\n    context = await qdrant_search(query)\n    async for chunk in llm_stream(query, context):\n        yield f"data: {chunk}\\n\\n"\n\n@app.get("/api/chat")\nasync def chat(q: str):\n    return StreamingResponse(stream_rag_tokens(q), media_type="text/event-stream")`
        }
      ],
      tools: ["FastAPI", "Qdrant", "ChromaDB", "Asyncio", "Docker", "Next.js"],
      practicalProject: {
        name: "Enterprise Knowledge Base RAG Assistant",
        desc: "Trợ lý tra cứu tài liệu nội bộ tích hợp Vector Search, Streaming Token SSE và trích dẫn bằng chứng tài liệu nguồn.",
        deliverables: ["Backend FastAPI SSE hoàn chỉnh", "Collection Qdrant HNSW tối ưu", "Giao diện Web tra cứu"]
      }
    },
    {
      id: "L4",
      levelNumber: 4,
      title: "ENABLE (Phân tích - Analyze)",
      tagline: "Đồng hành xây dựng hệ thống Multi-Agent LangGraph & Kỹ thuật LoRA PEFT",
      bloomTaxonomy: "Analyze",
      color: "from-indigo-500/20 to-purple-500/20 border-indigo-500/40 text-indigo-400",
      badgeColor: "bg-indigo-950/80 text-indigo-300 border-indigo-700/50",
      accentHex: "#6366f1",
      autonomy: "Độc lập giải quyết các bài toán kỹ thuật phức tạp, tối ưu hóa hiệu năng và hướng dẫn chuyên môn cho thành viên L1-L3.",
      targetAudience: "Tech-base nâng cao & AI-base Bắt đầu",
      startingFor: ["TECHBASE", "AIBASE"],
      objectives: [
        "Làm chủ cơ chế Self-Attention trong kiến trúc Transformer: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V.",
        "Thiết kế hệ thống Multi-Agent dạng đồ thị có trạng thái với LangGraph (StateGraph, Conditional Edges).",
        "Triển khai thuật toán Reciprocal Rank Fusion (RRF) kết hợp Dense Vector và BM25 Sparse Search.",
        "Thực hành Fine-tuning mô hình ngôn ngữ lớn với kỹ thuật LoRA / QLoRA (Rank r=8/16)."
      ],
      coreTheory: [
        {
          topic: "Toán học Self-Attention & Scaling Factor",
          detail: "Tích vô hướng QK^T có phương sai tăng theo d_k. Việc chia cho căn bậc hai của d_k giúp ngăn Softmax bị bão hòa vào vùng đạo hàm cực nhỏ (triệt tiêu gradient)."
        },
        {
          topic: "Bản chất Phân rã Ma Trận LoRA (Low-Rank Adaptation)",
          detail: "Thay vì cập nhật toàn bộ ma trận trọng số gốc W_0 (d x k), LoRA cố định W_0 và học ma trận Delta_W = B (d x r) * A (r x k) với r << min(d, k), giảm hơn 99% tham số cần huấn luyện."
        }
      ],
      techniques: [
        {
          name: "LangGraph Multi-Agent State Machine",
          desc: "Xây dựng đồ thị tác nhân có khả năng tự sửa lỗi (Self-Correction Loop).",
          code: `from langgraph.graph import StateGraph, END\n\nbuilder = StateGraph(AgentState)\nbuilder.add_node("researcher", research_node)\nbuilder.add_node("coder", coding_node)\nbuilder.add_node("evaluator", eval_node)\nbuilder.add_conditional_edges("evaluator", should_continue, {"pass": END, "retry": "coder"})\ngraph = builder.compile()`
        }
      ],
      tools: ["LangGraph", "PyTorch", "HuggingFace PEFT", "Trulens", "Qdrant Hybrid"],
      practicalProject: {
        name: "Autonomous Research & Coding Multi-Agent System",
        desc: "Hệ thống 3 tác nhân AI phối hợp tự động: Researcher thu thập dữ liệu -> Coder viết mã nguồn -> Evaluator kiểm thử và yêu cầu sửa lỗi.",
        deliverables: ["StateGraph hoàn chỉnh với LangGraph", "Fine-tuned LoRA Adapter", "Báo cáo kiểm thử tự động"]
      }
    }
  ],

  // 2. GIÁO TRÌNH 12 CHUYÊN ĐỀ KỸ THUẬT CHUYÊN SÂU (CHUẨN SFIA 8 & BLOOM: LEVEL 1 ➔ LEVEL 4)
  // 2. GIÁO TRÌNH 12 MODULES KỸ THUẬT CHUYÊN SÂU & 12 BÀI TẬP ASSIGNMENT (CHUẨN SFIA 8: L1 ➔ L4)
  curriculumModules: [
    // -------------------------------------------------------------------------
    // LEVEL 1: NON-TECH & FOUNDATION (MODULE 01 - 03) - TỪ L0
    // -------------------------------------------------------------------------
    {
      id: "MOD-1",
      moduleNumber: 1,
      levelCode: "L1",
      title: "Module 01 • Nhập Môn Python Cho AI, Môi Trường Thực Thi (venv/pip) & Bản Chất Tokenizer BPE",
      tag: "Python Basics & Tokenization",
      levelTag: "SFIA L1",
      bloomTaxonomy: "Remember",
      targetAudience: "Non-tech (Người Mới Bắt Đầu Học Code) & Business",
      startingFor: "NONTECH",
      description: "Trang bị nền tảng lập trình Python thực chiến cho AI: Cài đặt môi trường ảo (venv), quản lý thư viện pip, hiểu sâu cơ chế Byte-Pair Encoding (BPE), tỉ lệ nở token tiếng Việt và không gian xác suất Softmax.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Đo lường Token Budget ROI", "Phân tích giới hạn Context Window", "Định nghĩa KPI hệ thống"],
          projectDeliverable: "Bảng tính toán chi phí Token hàng tháng (TCO Model) & Tài liệu PRD"
        },
        {
          role: "FRONTEND",
          roleName: "Frontend & UI",
          skillsRequired: ["Form Validation", "Bộ đếm Ký tự / Token real-time", "Responsive Layout"],
          projectDeliverable: "Component đếm Token trực quan cảnh báo quá tải Context Window"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Kiểm thử Unicode tiếng Việt", "Boundary Test", "Stress Test độ dài văn bản"],
          projectDeliverable: "Bộ 20 test-cases kiểm tra lỗi Tokenizer trên văn bản tiếng Việt có dấu"
        }
      ],
      assignment: {
        id: "LAB-01",
        asmNumber: 1,
        title: "Assignment 01: Thiết Lập Môi Trường Python, Đo Lường Token & Tỉ Lệ Nở Token Tiếng Việt",
        durationMinutes: 45,
        summary: "Khởi tạo môi trường ảo Python venv, phân tích cách Tokenizer mã hóa các ngôn ngữ và đo lường sự biến thiên xác suất theo Temperature.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 01",
          code: "python3 labs/lab01_token_measurement.py --model gpt-4o-mini --text 'K.AI Labs: Nền tảng tự học AI thực chiến 2026'"
        },
        deliverables: ["Script đo lường chi phí token BPE", "Bảng so sánh Tokenization tiếng Việt vs tiếng Anh"]
      },
      topics: [
        {
          title: "1. Nhập Môn Python Cho AI: Môi Trường Ảo (venv), Quản Lý Thư Viện & Script Đầu Tiên",
          description: "Dành riêng cho người học xuất phát điểm Non-tech: Để làm chủ AI, bạn không cần học toàn bộ lý thuyết khoa học máy tính phức tạp mà cần làm chủ 'Python như một công cụ điều khiển AI'. Bước đầu tiên là thiết lập môi trường ảo sạch (venv) để tránh xung đột thư viện, cài đặt các package AI cốt lõi (tiktoken, httpx, python-dotenv) và viết script Python đầu tiên để xử lý dữ liệu chuỗi.",
          codeSnippet: {
            language: "python",
            title: "Khởi Tạo Script Python Đầu Tiên Đo Lường Độ Dài Văn Bản",
            code: `# =========================================================================
# BƯỚC 1: THIẾT LẬP MÔI TRƯỜNG TRÊN TERMINAL
# python -m venv ai_env
# source ai_env/bin/activate  (hoặc .\\ai_env\\Scripts\\activate trên Windows)
# pip install tiktoken python-dotenv httpx
# =========================================================================

def calculate_text_statistics(input_text: str) -> dict:
    """Hàm Python cơ bản tính toán số từ, số ký tự và dòng."""
    character_count = len(input_text)
    word_count = len(input_text.split())
    line_count = len(input_text.splitlines())
    
    return {
        "characters": character_count,
        "words": word_count,
        "lines": line_count,
        "is_vietnamese": any(ord(char) > 127 for char in input_text)
    }

# Thử nghiệm với chuỗi tiếng Việt
sample = "K.AI Labs: Nền tảng tự học AI thực chiến chuẩn quốc tế SFIA v8"
stats = calculate_text_statistics(sample)
print(f"[Thống Kê Văn Bản]: {stats}")`
          }
        },
        {
          title: "2. Thuật Toán Byte-Pair Encoding (BPE) & Hiện Tượng Nở Token Tiếng Việt",
          description: "Mô hình ngôn ngữ lớn không đọc văn bản theo ký tự hay từ hoàn chỉnh mà xử lý thông qua Token IDs. Thuật toán BPE gộp các cặp byte xuất hiện thường xuyên nhất trong tập dữ liệu tiền huấn luyện. Do tiếng Việt sử dụng bảng mã UTF-8 với dấu thanh ghép (ví dụ: 'ế', 'ặ'), một từ tiếng Việt có thể bị phân rã thành 2-4 tokens (so với 1 token ở tiếng Anh), làm tăng chi phí API và nhanh đầy cửa sổ ngữ cảnh (Context Window).",
          codeSnippet: {
            language: "python",
            title: "Lập Trình Python Đo Lường Token & Tỉ Lệ Nở Token Tiếng Việt",
            code: `import tiktoken

# 1. Khởi tạo tokenizer chuẩn GPT-4o / cl100k_base
enc = tiktoken.get_encoding("cl100k_base")

# 2. So sánh giữa tiếng Anh và tiếng Việt
text_en = "Artificial Intelligence Engineering in Action 2026"
text_vi = "Kỹ thuật Trí tuệ Nhân tạo Thực chiến 2026"

tokens_en = enc.encode(text_en)
tokens_vi = enc.encode(text_vi)

print(f"EN: '{text_en}' -> {len(tokens_en)} tokens: {tokens_en}")
print(f"VI: '{text_vi}' -> {len(tokens_vi)} tokens: {tokens_vi}")
print(f"-> Tỉ lệ nở token tiếng Việt: {len(tokens_vi)/len(tokens_en):.2f}x")

# 3. Giải mã từng token để xem cách BPE chia cắt từ
for token_id in tokens_vi:
    print(f"Token ID {token_id:<6} -> '{enc.decode([token_id])}'")`
          }
        }
      ]
    },
    {
      id: "MOD-2",
      moduleNumber: 2,
      levelCode: "L1",
      title: "Module 02 • Cấu Trúc Điều Khiển Python & Lập Trình Gọi LLM API An Toàn",
      tag: "Python Logic & LLM API",
      levelTag: "SFIA L1",
      bloomTaxonomy: "Understand",
      targetAudience: "Non-tech & Business (Bắt Đầu Viết Mã Nguồn)",
      startingFor: "NONTECH",
      description: "Làm chủ cấu trúc điều khiển logic trong Python (If/Else, Vòng lặp For/While, Định nghĩa Hàm def) và lập trình script kết nối an toàn đến LLM Gateway (OpenAI / Gemini / Anthropic) với bảo mật biến môi trường .env.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Viết User Stories cho Fallback Flow", "Thiết lập Timeout SLA", "Định nghĩa thông báo lỗi người dùng"],
          projectDeliverable: "Tài liệu đặc tả luồng Fallback khi LLM gặp sự cố (Rate Limit HTTP 429)"
        },
        {
          role: "BACKEND_DB",
          roleName: "Backend & DB",
          skillsRequired: ["Async HTTP Client (httpx)", "Bảo mật Biến môi trường (.env)", "Exponential Backoff Re-try"],
          projectDeliverable: "Module Python Gateway xử lý ngoại lệ và kết nối an toàn đa LLM"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Mocking HTTP API Responses", "API Key Leak Detection", "Error Code Mapping Tests"],
          projectDeliverable: "Bộ kịch bản kiểm thử giả lập mất kết nối mạng và rò rỉ Secret Key"
        }
      ],
      assignment: {
        id: "LAB-02",
        asmNumber: 2,
        title: "Assignment 02: Lập Trình Python HTTP Client Gọi Đa LLM Gateway Kèm Fallback & .env",
        durationMinutes: 45,
        summary: "Lập trình HTTP Client kết nối an toàn tới OpenAI / Gemini API, thiết lập cơ chế Exponential Backoff re-try và quản lý biến môi trường .env.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 02",
          code: "python3 labs/lab02_llm_gateway.py --provider openai --timeout 15"
        },
        deliverables: ["Module Python Gateway kết nối an toàn qua biến môi trường .env", "Bộ test-cases xử lý lỗi mạng HTTP 429 / 503"]
      },
      topics: [
        {
          title: "1. Cấu Trúc Điều Khiển Python: If-Else, Vòng Lặp & Định Nghĩa Hàm Xử Lý AI",
          description: "Mọi ứng dụng AI đều xoay quanh việc kiểm tra điều kiện (ví dụ: nếu người dùng gửi câu hỏi rỗng, nếu độ dài prompt vượt quá 4000 ký tự) và lặp qua danh sách tài liệu. Học cách viết mã nguồn tinh gọn, có xử lý lỗi logic trước khi gửi dữ liệu lên mô hình AI.",
          codeSnippet: {
            language: "python",
            title: "Viết Hàm Python Kiểm Tra Điều Kiện & Tiền Xử Lý Câu Hỏi",
            code: `def validate_and_format_prompt(user_query: str, max_chars: int = 2000) -> str:
    """Kiểm tra điều kiện đầu vào của người dùng trước khi gửi vào LLM."""
    cleaned_query = user_query.strip()
    
    if not cleaned_query:
        raise ValueError("Câu hỏi không được để trống.")
        
    if len(cleaned_query) > max_chars:
        print(f"[Cảnh Báo]: Câu hỏi vượt quá {max_chars} ký tự -> Tự động cắt ngắn.")
        cleaned_query = cleaned_query[:max_chars] + "..."
        
    formatted_prompt = f"### CÂU HỎI NGƯỜI DÙNG:\\n{cleaned_query}"
    return formatted_prompt

test_q = "   Làm sao để triển khai vLLM trên cụm Kubernetes?   "
print(validate_and_format_prompt(test_q))`
          }
        },
        {
          title: "2. Lập Trình Python Gọi LLM API Chuẩn Production (Bảo Mật Biến Môi Trường)",
          description: "Để xây dựng ứng dụng AI, người học cần biết cách tạo HTTP Client trong Python bằng thư viện `httpx` hoặc SDK chính thức. Nguyên tắc sống còn là TUYỆT ĐỐI KHÔNG hardcode API Key vào code mà phải đọc từ biến môi trường (`.env` qua `python-dotenv`), đồng thời bọc trong khối `try...except` để bắt các lỗi mạng (Timeout, Rate Limit).",
          codeSnippet: {
            language: "python",
            title: "Hàm Python Chuẩn Gọi LLM API Kèm Bắt Lỗi & Quản Lý API Key",
            code: `import os
import httpx
from dotenv import load_dotenv

# 1. Nạp API Key từ file .env bí mật
load_dotenv()
API_KEY = os.getenv("AI_SERVICE_API_KEY", "your-default-key")

def query_llm_service(user_prompt: str, system_instruction: str) -> str:
    """Gửi yêu cầu đến LLM API và xử lý ngoại lệ an toàn."""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    
    try:
        response = httpx.post(url, json=payload, headers=headers, timeout=15.0)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as http_err:
        return f"[Lỗi HTTP {http_err.response.status_code}]: {http_err.response.text}"
    except httpx.RequestError as req_err:
        return f"[Lỗi Kết Nối Mạng]: Không thể kết nối tới LLM Gateway ({req_err})"`
          }
        }
      ]
    },
    {
      id: "MOD-3",
      moduleNumber: 3,
      levelCode: "L1",
      title: "Module 03 • System Prompting XML Đa Tầng, Strict Grounding Chống Ảo Giác & Chain-of-Thought",
      tag: "System Prompt & CoT Reasoning",
      levelTag: "SFIA L1",
      bloomTaxonomy: "Understand",
      targetAudience: "Non-tech & Prompt Engineers",
      startingFor: "NONTECH",
      description: "Làm chủ kiến trúc System Prompt đa tầng chuẩn Anthropic/OpenAI, kỹ thuật phân tách ranh giới dữ liệu bằng thẻ XML, thiết lập quy tắc Strict Grounding triệt tiêu Hallucination và bóc tách luồng suy luận CoT bằng Python regex.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Quy chuẩn Ứng xử Persona Guidelines", "Quy tắc Im lặng khi thiếu dữ liệu", "Phân loại Intent người dùng"],
          projectDeliverable: "Tài liệu Prompt Specifications & Tiêu chuẩn chống ảo giác cho sản phẩm"
        },
        {
          role: "FRONTEND",
          roleName: "Frontend & UI",
          skillsRequired: ["Accordion UI / Thinking Collapsible", "UI cảnh báo nguồn trích dẫn", "Markdown Renderer"],
          projectDeliverable: "Giao diện Playground Prompt Tester & Thinking Trace Viewer"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Prompt Injection Red Teaming", "Jailbreak Testing", "Semantic Drift Validation"],
          projectDeliverable: "Báo cáo kiểm thử bảo mật chống vượt rào (Guardrails Penetration Report)"
        }
      ],
      assignment: {
        id: "LAB-03",
        asmNumber: 3,
        title: "Assignment 03: Thiết Lập Thư Viện Prompt XML Chống Ảo Giác & Bóc Tách Luồng Suy Luận CoT",
        durationMinutes: 45,
        summary: "Xây dựng thư viện Prompt Templates chuẩn XML cho doanh nghiệp, thiết lập 10 test-cases kiểm tra hiện tượng hallucination và viết script Python regex trích xuất luồng suy luận CoT.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 03",
          code: "pytest tests/test_prompt_guardrails.py -v"
        },
        deliverables: ["Bộ Prompt Template chuẩn JSON/YAML", "Báo cáo kiểm thử độ trung thực (Faithfulness Report)"]
      },
      topics: [
        {
          title: "1. Kiến Trúc System Prompt Chuẩn & Kỹ Thuật Grounding Bắt Buộc",
          description: "Ảo giác (Hallucination) xảy ra khi mô hình tự bịa thông tin do thiếu dữ kiện trong ngữ cảnh hoặc bị câu hỏi dẫn dụ (Prompt Injection). Kỹ thuật Strict Grounding sử dụng các thẻ XML để phân tách rạch ròi giữa: [VAI TRÒ], [QUY TẮC PHÁP LÝ], [NGỮ CẢNH TÀI LIỆU], và [CÂU HỎI], đồng thời áp đặt 'Quy Tắc Im Lặng' khi tài liệu không chứa câu trả lời.",
          codeSnippet: {
            language: "markdown",
            title: "Mẫu System Prompt Ngăn Chặn Ảo Giác Tuyệt Đối (Zero Hallucination)",
            code: `[ROLE & CONTEXT]
Bạn là Kỹ sư Trợ lý Kiến trúc Hệ thống AI tuân thủ nghiêm ngặt tiêu chuẩn ISO 42001.

[STRICT GROUNDING RULES]
1. BẮT BUỘC CHỈ sử dụng thông tin được cung cấp trong khối <context>...</context> để trả lời.
2. TUYỆT ĐỐI KHÔNG sử dụng tri thức ngoài hoặc tự suy diễn thêm các số liệu, tên hàm không có trong tài liệu.
3. Nếu <context> KHÔNG chứa đủ thông tin để trả lời chính xác, bạn BẮT BUỘC phải xuất đúng chuỗi:
   "Tài liệu hiện tại không chứa thông tin để trả lời câu hỏi này."
4. Trích dẫn rõ đoạn trích nguồn [Source] cho từng kết luận đưa ra.

<context>
{retrieved_documents_chunk}
</context>

<user_query>
{user_question}
</user_query>`
          }
        },
        {
          title: "2. Lập Trình Python Bóc Tách Luồng Suy Luận CoT Bằng Regular Expressions",
          description: "Khi LLM thực hiện suy luận từng bước (Chain-of-Thought), văn bản trả về sẽ chứa cả phần giải thích (Reasoning Trace) và đáp án kết luận cuối cùng. Bài học này hướng dẫn sử dụng cấu trúc dữ liệu Python `dict`, `list` kết hợp với biểu thức chính quy (Regex) để tự động trích xuất kết quả sạch lưu vào database.",
          codeSnippet: {
            language: "python",
            title: "Hàm Python Trích Xuất Luồng Suy Luận & Kết Quả Bằng Regex",
            code: `import re
from typing import Dict, Any

def parse_chain_of_thought_response(raw_llm_output: str) -> Dict[str, Any]:
    """Phân tách văn bản LLM thành: Lý do suy luận (Thinking) và Đáp án cuối (Answer)."""
    think_pattern = r"<think>(.*?)</think>"
    answer_pattern = r"(?:Kết luận cuối cùng|Đáp án|Final Answer):\s*(.*)"
    
    think_match = re.search(think_pattern, raw_llm_output, re.DOTALL)
    answer_match = re.search(answer_pattern, raw_llm_output, re.IGNORECASE)
    
    reasoning_trace = think_match.group(1).strip() if think_match else "Không có thẻ think."
    final_answer = answer_match.group(1).strip() if answer_match else raw_llm_output.strip()
    
    return {
        "raw_text_length": len(raw_llm_output),
        "reasoning_steps": [step.strip() for step in reasoning_trace.split("\\n") if step.strip()],
        "final_result": final_answer,
        "is_structured": bool(answer_match)
    }`
          }
        }
      ]
    },

    // -------------------------------------------------------------------------
    // LEVEL 2: BUSINESS & AUTOMATION (MODULE 04 - 06) - LẬP TRÌNH ỨNG DỤNG
    // -------------------------------------------------------------------------
    {
      id: "MOD-4",
      moduleNumber: 4,
      levelCode: "L2",
      title: "Module 04 • Lập Trình Pydantic Data Models & Tự Động Hóa Workflow Qua Webhook / n8n",
      tag: "Pydantic & Automation",
      levelTag: "SFIA L2",
      bloomTaxonomy: "Apply",
      targetAudience: "Business & Automation Enthusiasts",
      startingFor: "NONTECH",
      description: "Làm chủ lập trình Hướng đối tượng Python (OOP), định nghĩa Pydantic v2 Models, cưỡng chế LLM trả về đúng 100% JSON Schema Type-Safe và tích hợp tự động hóa qua Webhook/n8n.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Data Dictionary Specification", "Định nghĩa trường bắt buộc (Mandatory Fields)", "Đặc tả luồng Webhook Event"],
          projectDeliverable: "Bản từ điển dữ liệu hóa đơn/hợp đồng (Data Dictionary) chuẩn hóa cho AI"
        },
        {
          role: "BACKEND_DB",
          roleName: "Backend & DB",
          skillsRequired: ["Pydantic v2 BaseModels", "PostgreSQL JSONB Storage", "Webhook Security Signature"],
          projectDeliverable: "Pipeline nhận Webhook và lưu dữ liệu JSON Schema chuẩn vào PostgreSQL"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Schema Fuzz Testing", "Kiểm thử thiếu trường / sai kiểu", "Validation Error Handlers"],
          projectDeliverable: "Bộ 30 test-cases kiểm tra độ bền vững của Parser khi nhận JSON lỗi"
        }
      ],
      assignment: {
        id: "LAB-04",
        asmNumber: 4,
        title: "Assignment 04: Lập Trình Pipeline Trích Xuất Dữ Liệu Có Cấu Trúc Chuẩn Pydantic & n8n",
        durationMinutes: 60,
        summary: "Ứng dụng Instructor và Pydantic v2 để cưỡng chế LLM trả về đúng 100% cấu trúc schema của hóa đơn, hợp đồng và tự động đẩy vào n8n Webhook.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 04",
          code: "python3 labs/lab04_structured_pydantic.py --input sample_invoices/inv_01.pdf"
        },
        deliverables: ["Pydantic Model Schema", "Workflow n8n JSON Export ghi dữ liệu vào PostgreSQL"]
      },
      topics: [
        {
          title: "1. Cưỡng Chế Cấu Trúc Bằng Pydantic & JSON Schema Validation",
          description: "Trong môi trường Production, ứng dụng không thể tiếp nhận văn bản tự do vì dễ gây crash parser khi lưu cơ sở dữ liệu. Sử dụng OpenAI / Instructor Pydantic Schema đảm bảo LLM chỉ sinh đúng định dạng JSON hợp lệ, tự động kiểm tra kiểu dữ liệu (Type Validation), trường bắt buộc và giới hạn miền giá trị.",
          codeSnippet: {
            language: "python",
            title: "Định Nghĩa Pydantic Schema Bắt Buộc Chuẩn Hóa Dữ Liệu",
            code: `from pydantic import BaseModel, Field
from typing import List, Optional

class SystemVulnerabilityReport(BaseModel):
    service_name: str = Field(description="Tên dịch vụ hoặc module hạ tầng gặp sự cố")
    cve_id: Optional[str] = Field(default=None, description="Mã lỗ hổng CVE nếu có")
    severity: str = Field(description="Mức độ nghiêm trọng: LOW | MEDIUM | HIGH | CRITICAL")
    affected_endpoints: List[str] = Field(description="Danh sách các API endpoints bị ảnh hưởng")
    remediation_steps: List[str] = Field(description="Các bước khắc phục kỹ thuật cụ thể")
    is_patch_available: bool = Field(description="Đã có bản vá lỗi chính thức hay chưa")

# JSON Schema sinh tự động để gửi vào LLM API:
# schema = SystemVulnerabilityReport.model_json_schema()`
          }
        },
        {
          title: "2. Tích Hợp Tự Động Hóa Workflow Qua Webhook & n8n",
          description: "Sau khi dữ liệu được chuẩn hóa dưới dạng JSON hợp lệ, hệ thống tự động đẩy payload qua HTTP Webhook vào n8n/Make để kích hoạt các hành động tự động: ghi dữ liệu vào PostgreSQL, gửi cảnh báo Telegram và tạo ticket Jira mà không cần can thiệp thủ công.",
          codeSnippet: {
            language: "python",
            title: "Gửi Payload JSON Đã Validate Sang n8n Webhook Endpoint",
            code: `import httpx
import asyncio

async def dispatch_to_n8n_pipeline(validated_data: dict, webhook_url: str):
    """Gửi payload JSON chuẩn sang n8n Workflow để tự động xử lý."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            webhook_url,
            json=validated_data,
            headers={"Content-Type": "application/json", "X-Source-Service": "AI-Inspector"}
        )
        if response.status_code == 200:
            return {"status": "SUCCESS", "workflow_execution_id": response.json().get("executionId")}
        raise RuntimeError(f"n8n Webhook Error HTTP {response.status_code}: {response.text}")`
          }
        }
      ]
    },
    {
      id: "MOD-5",
      moduleNumber: 5,
      levelCode: "L2",
      title: "Module 05 • Backend Bất Đồng Bộ FastAPI & Server-Sent Events (SSE) Streaming",
      tag: "Async Backend & Streaming",
      levelTag: "SFIA L2",
      bloomTaxonomy: "Apply",
      targetAudience: "Business & Automation (API Integration)",
      startingFor: "NONTECH",
      description: "Xây dựng Backend Non-blocking Asyncio I/O với FastAPI, xử lý streaming từng token thời gian thực qua Server-Sent Events (SSE), tối ưu Time-to-First-Token (TTFT < 250ms).",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Đo lường chỉ số UX Latency (TTFT < 300ms)", "Thiết lập SLA phản hồi", "Phân tích Retention Rate"],
          projectDeliverable: "Báo cáo tiêu chuẩn chất lượng trải nghiệm người dùng (UX Latency Benchmark)"
        },
        {
          role: "FRONTEND",
          roleName: "Frontend & UI",
          skillsRequired: ["Web Streams API (SSE Reader)", "Xử lý Buffer gõ chữ Real-time", "Tự động cuộn trang (Auto-scroll)"],
          projectDeliverable: "Giao diện Chat Streaming mượt mà không bị giật lag khi tải nhiều token"
        },
        {
          role: "BACKEND_DB",
          roleName: "Backend & DB",
          skillsRequired: ["FastAPI Asyncio Event Loop", "StreamingResponse Generator", "Uvicorn Worker Concurrency"],
          projectDeliverable: "FastAPI SSE Streaming Gateway chịu tải 1.000 kết nối đồng thời"
        }
      ],
      assignment: {
        id: "LAB-05",
        asmNumber: 5,
        title: "Assignment 05: Xây Dựng Async FastAPI Gateway Truyền Dữ Liệu Server-Sent Events (SSE)",
        durationMinutes: 60,
        summary: "Lập trình backend bất đồng bộ hỗ trợ 1.000 kết nối đồng thời truyền từng token streaming về giao diện người dùng với TTFT < 250ms.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 05",
          code: "uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
        },
        deliverables: ["FastAPI SSE Streaming Server", "Tài liệu Swagger OpenAPI docs"]
      },
      topics: [
        {
          title: "1. Cơ Chế Non-Blocking Asyncio Trong Xử Lý LLM API",
          description: "Các cuộc gọi đến mô hình LLM thường mất từ 2-15 giây để hoàn thành. Nếu sử dụng lập trình đồng bộ (Synchronous Blocking), mỗi kết nối sẽ chiếm dụng 1 thread, khiến máy chủ bị nghẽn (Denial of Service) khi có vài chục yêu cầu đồng thời. Lập trình bất đồng bộ (Async/Await) giải phóng Event Loop trong thời gian chờ mạng, cho phép 1 server xử lý hàng nghìn kết nối đồng thời.",
          codeSnippet: {
            language: "python",
            title: "FastAPI Async Controller Xử Lý Song Song Nhiều Requests",
            code: `from fastapi import FastAPI, HTTPException
import asyncio
import httpx

app = FastAPI(title="K.AI High-Concurrency Async Gateway")

async def call_llm_upstream(prompt: str, client: httpx.AsyncClient) -> str:
    """Gọi LLM API bất đồng bộ không làm block Event Loop."""
    await asyncio.sleep(0.5)
    return f"Phản hồi đã xử lý cho: {prompt[:20]}..."

@app.post("/api/batch-generate")
async def batch_generate(prompts: list[str]):
    async with httpx.AsyncClient(timeout=30.0) as client:
        tasks = [call_llm_upstream(p, client) for p in prompts]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return {"total": len(prompts), "results": results}`
          }
        },
        {
          title: "2. Thiết Kế API Streaming Với Server-Sent Events (SSE)",
          description: "Server-Sent Events (SSE) là chuẩn HTTP đơn hướng cho phép Server chủ động bắn từng đoạn dữ liệu (data chunks) về Client ngay khi token vừa được giải mã. Giúp giảm Time-to-First-Token (TTFT) từ 5 giây xuống dưới 300ms, mang lại trải nghiệm gõ chữ mượt mà và trực quan cho người dùng.",
          codeSnippet: {
            language: "python",
            title: "FastAPI SSE Streaming Endpoint Chuẩn Production",
            code: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

async def sse_token_stream(query: str):
    """Sinh luồng sự kiện SSE chuẩn định dạng 'data: {...}\\n\\n'"""
    simulated_tokens = ["Kiến", " trúc", " RAG", " chuẩn", " quốc", " tế", " SFIA", " v8."]
    for idx, token in enumerate(simulated_tokens):
        payload = json.dumps({"token_idx": idx, "text": token})
        yield f"data: {payload}\\n\\n"
        await asyncio.sleep(0.04) # Tốc độ gõ 25 tokens/giây
    yield "data: [DONE]\\n\\n"

@app.get("/api/chat/stream")
async def chat_stream(q: str):
    return StreamingResponse(
        sse_token_stream(q),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )`
          }
        }
      ]
    },
    {
      id: "MOD-6",
      moduleNumber: 6,
      levelCode: "L2",
      title: "Module 06 • Toán Học Vector NumPy & Cơ Sở Dữ Liệu Vector Qdrant Chỉ Mục HNSW",
      tag: "Vector Math & Qdrant HNSW",
      levelTag: "SFIA L2",
      bloomTaxonomy: "Apply",
      targetAudience: "Business & Automation (Data Storage)",
      startingFor: "NONTECH",
      description: "Làm chủ đại số tuyến tính căn bản cho AI bằng NumPy (Cosine Similarity 1536D), cài đặt Qdrant Vector Database trên Docker và tối ưu chỉ mục đồ thị HNSW kèm Payload Filtering.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Ma trận phân quyền tài liệu RBAC", "Định nghĩa Metadata phòng ban / dự án", "Chính sách bảo mật dữ liệu"],
          projectDeliverable: "Ma trận phân quyền truy cập thông tin (RBAC Access Matrix) cho AI RAG"
        },
        {
          role: "BACKEND_DB",
          roleName: "Backend & DB",
          skillsRequired: ["Qdrant Python Client SDK", "Cấu hình HNSW Indexing (m=16, ef=100)", "Docker Persistent Storage Volume"],
          projectDeliverable: "Cụm cơ sở dữ liệu Vector Qdrant Production có Payload Filtering bảo mật"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Kiểm thử rò rỉ dữ liệu chéo phòng ban", "RBAC Breach Testing", "Benchmark độ trễ HNSW Search"],
          projectDeliverable: "Báo cáo kiểm thử không rò rỉ dữ liệu mật (Data Isolation Audit Report)"
        }
      ],
      assignment: {
        id: "LAB-06",
        asmNumber: 6,
        title: "Assignment 06: Cài Đặt Cụm Qdrant Docker & Indexing 10.000 Tài Liệu Kèm Lọc Phân Quyền",
        durationMinutes: 60,
        summary: "Dựng cụm Qdrant Vector Store cục bộ bằng Docker, cấu hình chỉ mục HNSW và nạp 10.000 vector embedding kèm truy vấn lọc metadata RBAC.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 06",
          code: "docker run -p 6333:6333 -p 6334:6334 -v $(pwd)/qdrant_storage:/qdrant/storage:z qdrant/qdrant"
        },
        deliverables: ["Collection Qdrant HNSW có Payload Filtering", "Script ETL nạp và tìm kiếm 10.000 vector embedding"]
      },
      topics: [
        {
          title: "1. Không Gian Vector 1536 Chiều & Khoảng Cách Cosine Similarity",
          description: "Mỗi đoạn văn bản sau khi qua mô hình Embedding sẽ trở thành một vector thực d=1536 chiều. Độ tương đồng ngữ nghĩa giữa câu hỏi Q và tài liệu D được đo bằng góc cos giữa hai vector: Cosine(Q, D) = (Q . D) / (||Q|| * ||D||). Khi hai vector cùng hướng, Cosine = 1.0 (ngữ nghĩa giống hệt), khi vuông góc Cosine = 0 (hoàn toàn không liên quan).",
          codeSnippet: {
            language: "python",
            title: "Tính Toán Khoảng Cách Cosine & Normalize Vector Bằng NumPy",
            code: `import numpy as np

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """Tính khoảng cách Cosine Similarity giữa 2 embeddings."""
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(np.dot(v1, v2) / (norm_v1 * norm_v2))

vec_a = np.random.randn(1536)
vec_b = vec_a + np.random.normal(0, 0.1, 1536) # Rất gần vec_a
print(f"Độ tương đồng ngữ nghĩa: {cosine_similarity(vec_a, vec_b):.4f}")`
          }
        },
        {
          title: "2. Cấu Trúc Đồ Thị HNSW & Collection Qdrant Production",
          description: "Quét tuần tự toàn bộ vector (Brute-force) có độ phức tạp O(N) — quá chậm khi dữ liệu đạt hàng triệu bản ghi. Thuật toán HNSW xây dựng đồ thị phân tầng nhiều lớp giúp tìm kiếm láng giềng gần nhất (ANN) với độ phức tạp chỉ O(log N). Qdrant hỗ trợ lọc metadata (Payload Filtering) trực tiếp trong quá trình duyệt đồ thị.",
          codeSnippet: {
            language: "python",
            title: "Khởi Tạo Collection Qdrant HNSW & Tìm Kiếm Phân Quyền",
            code: `from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, HnswConfigDiff, Filter, FieldCondition, MatchValue

client = QdrantClient("http://localhost:6333")

client.recreate_collection(
    collection_name="enterprise_wiki",
    vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
    hnsw_config=HnswConfigDiff(m=16, ef_construct=100)
)

results = client.search(
    collection_name="enterprise_wiki",
    query_vector=[0.05] * 1536,
    query_filter=Filter(
        must=[
            FieldCondition(key="department", match=MatchValue(value="engineering")),
            FieldCondition(key="is_confidential", match=MatchValue(value=False))
        ]
    ),
    limit=5
)`
          }
        }
      ]
    },

    // -------------------------------------------------------------------------
    // LEVEL 3: TECH-BASE: IT / DEVS (MODULE 07 - 09) - KỸ SƯ HỆ THỐNG AI
    // -------------------------------------------------------------------------
    {
      id: "MOD-7",
      moduleNumber: 7,
      levelCode: "L3",
      title: "Module 07 • Kỹ Thuật Phân Tách Văn Bản (Semantic Chunking) & Embeddings Đa Ngôn Ngữ BGE-M3",
      tag: "Semantic Chunking & BGE-M3",
      levelTag: "SFIA L3",
      bloomTaxonomy: "Apply",
      targetAudience: "Tech-base (Software Engineers & Devs)",
      startingFor: "TECHBASE",
      description: "Làm chủ chiến lược phân tách tài liệu thông minh: Fixed-size, Recursive Character và Semantic Chunking; tích hợp mô hình Embedding đa ngôn ngữ BAAI/bge-m3 & Cohere.",
      crossFunctionalRoles: [
        {
          role: "DATA_ENG",
          roleName: "Data & Pipeline",
          skillsRequired: ["Parser tài liệu PDF/DOCX/Markdown", "Semantic Boundary Splitting", "Tối ưu hóa BGE-M3 Embeddings"],
          projectDeliverable: "ETL Ingestion Pipeline tự động phân tách tài liệu không làm đứt gãy ngữ cảnh"
        },
        {
          role: "FRONTEND",
          roleName: "Frontend & UI",
          skillsRequired: ["Chunk Previewer Component", "Trích dẫn nguồn Citation Highlighting", "Drawer xem tài liệu gốc"],
          projectDeliverable: "Giao diện tra cứu hiển thị trực quan đoạn trích nguồn được highlight"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Đo lường tỷ lệ mất mát ngữ cảnh (Context Loss)", "Ground Truth Retrieval Tests", "Embedding Latency Benchmark"],
          projectDeliverable: "Báo cáo đánh giá chất lượng phân tách Chunking trên 100 hợp đồng mẫu"
        }
      ],
      assignment: {
        id: "LAB-07",
        asmNumber: 7,
        title: "Assignment 07: Xây Dựng Pipeline Semantic Chunking & Benchmark Embeddings BGE-M3",
        durationMinutes: 75,
        summary: "Tích hợp mô hình embedding BAAI/bge-m3 đa ngôn ngữ để truy vấn tương đồng cosine đạt độ trễ < 5ms và phân tách tài liệu bằng Semantic Chunking.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 07",
          code: "python3 labs/lab07_semantic_chunking.py --input corpus/handbook.pdf --threshold 0.75"
        },
        deliverables: ["Pipeline phân tách văn bản thông minh không đứt gãy ngữ cảnh", "Báo cáo benchmark độ trễ và độ tương đồng cosine"]
      },
      topics: [
        {
          title: "1. So Sánh Các Chiến Lược Phân Tách Chunking (Fixed vs Recursive vs Semantic)",
          description: "Phân tách sai tài liệu là nguyên nhân số 1 khiến RAG bị mất ngữ cảnh (Context Loss). Chiến lược Semantic Chunking tính toán độ tương đồng giữa các câu liền kề để chỉ cắt đoạn khi chủ đề thay đổi, bảo toàn 100% ngữ nghĩa của các điều khoản luật hoặc hàm code.",
          codeSnippet: {
            language: "python",
            title: "Triển Khai Semantic Chunking Dựa Trên Ngưỡng Tương Đồng Vector",
            code: `import numpy as np

def semantic_chunking(sentences: list[str], sentence_embeddings: np.ndarray, threshold: float = 0.75) -> list[str]:
    """Gộp các câu liền kề có độ tương đồng cosine >= threshold thành 1 chunk."""
    chunks = []
    current_chunk = [sentences[0]]
    
    for i in range(len(sentences) - 1):
        sim = float(np.dot(sentence_embeddings[i], sentence_embeddings[i+1]) / 
                   (np.linalg.norm(sentence_embeddings[i]) * np.linalg.norm(sentence_embeddings[i+1])))
        
        if sim >= threshold:
            current_chunk.append(sentences[i+1])
        else:
            chunks.append(" ".join(current_chunk))
            current_chunk = [sentences[i+1]]
            
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks`
          }
        },
        {
          title: "2. Tích Hợp Mô Hình Embedding Đa Ngôn Ngữ BAAI/bge-m3",
          description: "BGE-M3 là mô hình embedding SOTA hỗ trợ đồng thời 3 khả năng: Dense Retrieval (1024D), Sparse Retrieval (Lexical weights) và Multi-Vector ColBERT, hỗ trợ xuất sắc tiếng Việt và hơn 100 ngôn ngữ khác.",
          codeSnippet: {
            language: "python",
            title: "Trích Xuất Embeddings Đa Năng Bằng FlagEmbedding BGE-M3",
            code: `from FlagEmbedding import BGEM3FlagModel

model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
sentences = ["Hạ tầng tính toán AI phục vụ mô hình ngôn ngữ lớn.", "FastAPI streaming server with Server-Sent Events."]
embeddings = model.encode(sentences, return_dense=True, return_sparse=True)
print(f"Kích thước Dense Vector: {embeddings['dense_vecs'].shape}")`
          }
        }
      ]
    },
    {
      id: "MOD-8",
      moduleNumber: 8,
      levelCode: "L3",
      title: "Module 08 • Tìm Kiếm Lai (Hybrid Search: Qdrant Dense + BM25 Sparse) & Hợp Nhất RRF",
      tag: "Hybrid Search & RRF",
      levelTag: "SFIA L3",
      bloomTaxonomy: "Apply",
      targetAudience: "Tech-base (Search & RAG Engineers)",
      startingFor: "TECHBASE",
      description: "Kết hợp Vector Search (Dense) + BM25 (Sparse) qua thuật toán Reciprocal Rank Fusion (RRF) và Cross-Encoder Reranker, loại bỏ tài liệu rác và tăng độ chính xác tìm kiếm 35%.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Thiết lập KPI Tìm kiếm (Top-3 Accuracy > 92%)", "Đo lường tỉ lệ Zero-Result Rate", "Phân tích Search Query Log"],
          projectDeliverable: "Bảng định nghĩa tiêu chí đánh giá chất lượng tìm kiếm doanh nghiệp"
        },
        {
          role: "BACKEND_DB",
          roleName: "Backend & DB",
          skillsRequired: ["Qdrant Hybrid Search", "BM25 Sparse Inverted Index", "Cross-Encoder FlashRank Model"],
          projectDeliverable: "Hệ thống Hybrid RAG Pipeline kết hợp Dense + Sparse + Re-ranker"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["A/B Testing Search Algorithms", "MRR (Mean Reciprocal Rank) Eval", "Keyword Exact-Match Tests"],
          projectDeliverable: "Báo cáo A/B Test chứng minh Hybrid RRF tăng độ chính xác 35% so với Dense-only"
        }
      ],
      assignment: {
        id: "LAB-08",
        asmNumber: 8,
        title: "Assignment 08: Lập Trình Hybrid Search RAG Pipeline Kèm Cross-Encoder Re-ranker",
        durationMinutes: 75,
        summary: "Hợp nhất kết quả tìm kiếm từ khóa chính xác BM25 và Vector HNSW qua thuật toán RRF kèm Cross-Encoder Re-ranker.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 08",
          code: "python3 labs/lab08_hybrid_rag.py --eval-file data/gold_dataset.json"
        },
        deliverables: ["Hệ thống Hybrid RAG Pipeline kết hợp Dense + Sparse + RRF", "Báo cáo A/B Test chứng minh cải thiện 35% độ chính xác"]
      },
      topics: [
        {
          title: "1. Sự Kết Hợp Giữa Dense Vector & BM25 Sparse Search",
          description: "Vector Search rất mạnh trong việc hiểu ngữ nghĩa tương đồng nhưng dễ bị 'mù' trước các từ khóa chính xác như mã SKU, tên hàm code, mã định danh lỗi (ví dụ: 'ERR-503-GATEWAY'). Ngược lại, BM25 tính toán tần suất xuất hiện từ vựng theo trọng số TF-IDF giúp bắt trọn từ khóa chính xác. Mô hình Hybrid Search chạy song song 2 luồng và hợp nhất kết quả.",
          codeSnippet: {
            language: "python",
            title: "Thuật Toán Hợp Nhất Xếp Hạng Reciprocal Rank Fusion (RRF)",
            code: `def reciprocal_rank_fusion(dense_rankings: list[str], sparse_rankings: list[str], k: int = 60) -> list[tuple[str, float]]:
    """Hợp nhất thứ hạng từ Dense Vector và BM25 Sparse Search bằng công thức RRF."""
    rrf_scores = {}
    for rank, doc_id in enumerate(dense_rankings):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    for rank, doc_id in enumerate(sparse_rankings):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    return sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)`
          }
        },
        {
          title: "2. Tinh Chỉnh Thứ Hạng Với Cross-Encoder Re-ranker",
          description: "Mô hình Bi-Encoder tính toán vector của Query và Document độc lập. Cross-Encoder nhận đồng thời cả cặp (Query, Document) vào cùng một mạng Transformer để chấm điểm tương quan trực tiếp, đưa đoạn văn bản chất lượng nhất lên vị trí Top 1.",
          codeSnippet: {
            language: "python",
            title: "Áp Dụng Cross-Encoder Re-ranker Cho Top K Ứng Viên",
            code: `from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
query = "Cách cấu hình vLLM Continuous Batching trên Kubernetes?"
candidate_docs = ["Tài liệu hướng dẫn vLLM Continuous Batching.", "Hướng dẫn cài đặt Docker."]
pairs = [[query, doc] for doc in candidate_docs]
scores = reranker.predict(pairs)
print(f"Top 1 Re-ranked Score: {scores[0]:.4f}")`
          }
        }
      ]
    },
    {
      id: "MOD-9",
      moduleNumber: 9,
      levelCode: "L3",
      title: "Module 09 • Điều Phối Đa Tác Nhân Tự Chủ (LangGraph) & Tinh Chỉnh Mô Hình PEFT / LoRA",
      tag: "Stateful Agent & PEFT LoRA",
      levelTag: "SFIA L3",
      bloomTaxonomy: "Analyze",
      targetAudience: "Tech-base (Devs & Multi-Agent Engineers)",
      startingFor: "TECHBASE",
      description: "Mô hình hóa hệ thống Multi-Agent bằng Đồ thị trạng thái có chu trình (Cyclic StateGraph), quản lý bộ nhớ Checkpointing và fine-tuning mô hình bằng PEFT / LoRA (QLoRA 4-bit NF4) trên 1 GPU.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Sơ đồ quy trình nghiệp vụ BPMN", "Định nghĩa điểm phê duyệt Human-in-the-loop", "Xác định giới hạn Re-try"],
          projectDeliverable: "Bản đồ quy trình tự chủ đa tác nhân (Multi-Agent Workflow Blueprint)"
        },
        {
          role: "FRONTEND",
          roleName: "Frontend & UI",
          skillsRequired: ["Agent Timeline Visualizer", "Trạng thái phê duyệt (Approve / Reject Dialog)", "Real-time Node Status"],
          projectDeliverable: "Dashboard theo dõi tiến độ thực thi của các Agents thời gian thực"
        },
        {
          role: "BACKEND_DB",
          roleName: "Backend & DB",
          skillsRequired: ["LangGraph StateGraph Engine", "PostgreSQL Checkpointer", "PEFT LoRA Config / PyTorch"],
          projectDeliverable: "Hệ thống Multi-Agent tự sửa lỗi và LoRA Adapter được huấn luyện hoàn chỉnh"
        }
      ],
      assignment: {
        id: "LAB-09",
        asmNumber: 9,
        title: "Assignment 09: Xây Dựng Multi-Agent StateGraph Tự Sửa Code & Fine-tune LoRA Trên 1 GPU",
        durationMinutes: 90,
        summary: "Mô hình hóa 3 tác nhân AI (Planner, Coder, Tester) trên LangGraph Cyclic StateGraph kèm tinh chỉnh LoRA Adapter trên 1 GPU.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 09",
          code: "python3 labs/lab09_langgraph_multiagent.py --task 'Implement OAuth2' && python3 labs/lab09_lora_train.py"
        },
        deliverables: ["StateGraph LangGraph có chu trình tự sửa lỗi và Memory Checkpoint", "LoRA Adapter chuyên biệt huấn luyện bằng QLoRA 4-bit NF4"]
      },
      topics: [
        {
          title: "1. Kiến Trúc State Machine & Rẽ Nhánh Điều Kiện Trong LangGraph",
          description: "LangGraph cho phép xây dựng đồ thị trạng thái có chu trình (Cyclic Graph), trong đó các tác nhân (Planner, Coder, Tester) cùng đọc và ghi vào một đối tượng State chung, cho phép hệ thống tự lặp lại bước code nếu kiểm thử chưa đạt yêu cầu.",
          codeSnippet: {
            language: "python",
            title: "Xây Dựng StateGraph Multi-Agent Với Vòng Lặp Tự Sửa Lỗi",
            code: `from typing import TypedDict
from langgraph.graph import StateGraph, END

class DevTeamState(TypedDict):
    task_description: str
    generated_code: str
    retry_count: int
    is_passed: bool

def coder_agent(state: DevTeamState) -> DevTeamState:
    return {**state, "generated_code": "def solve(): return 42", "retry_count": state["retry_count"] + 1}

def tester_agent(state: DevTeamState) -> DevTeamState:
    return {**state, "is_passed": state["retry_count"] >= 2}

workflow = StateGraph(DevTeamState)
workflow.add_node("coder", coder_agent)
workflow.add_node("tester", tester_agent)
workflow.set_entry_point("coder")
workflow.add_edge("coder", "tester")
workflow.add_conditional_edges("tester", lambda s: END if s["is_passed"] else "coder")`
          }
        },
        {
          title: "2. Tinh Chỉnh Mô Hình Tối Ưu Tham Số Với PEFT / LoRA (QLoRA 4-bit)",
          description: "Low-Rank Adaptation (LoRA) đóng băng toàn bộ trọng số gốc W0 và chỉ huấn luyện 2 ma trận phân rã hạng thấp B và A theo công thức: W = W0 + (alpha / r) * (B x A). Kết hợp QLoRA 4-bit NF4 giúp fine-tune mô hình 8B trên 1 GPU 16GB VRAM.",
          codeSnippet: {
            language: "python",
            title: "Cấu Hình LoRA Adapter Với Thư Viện PEFT",
            code: `from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM

base_model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")
lora_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"], task_type=TaskType.CAUSAL_LM)
model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()`
          }
        }
      ]
    },

    // -------------------------------------------------------------------------
    // LEVEL 4: AI-BASE: DEEP LEARNING (MODULE 10 - 12) - HẠ TẦNG & QUẢN TRỊ
    // -------------------------------------------------------------------------
    {
      id: "MOD-10",
      moduleNumber: 10,
      levelCode: "L4",
      title: "Module 10 • Hạ Tầng Suy Luận Hiệu Năng Cao: vLLM PagedAttention & Continuous Batching",
      tag: "High-Throughput vLLM Serving",
      levelTag: "SFIA L4",
      bloomTaxonomy: "Analyze",
      targetAudience: "MLOps & Infrastructure Leads",
      startingFor: "AIBASE",
      description: "Thuật toán PagedAttention quản lý KV Cache không phân mảnh, cơ chế Continuous Batching, Tensor Parallelism và tối ưu hóa Throughput GPU gấp 15 lần trên cụm Kubernetes.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Bài toán TCO Hạ tầng (Cloud API vs Thuê GPU Dedicated)", "Định nghĩa Service Level Agreement (SLA)", "Ước tính Concurrency"],
          projectDeliverable: "Bản phân tích hiệu quả chi phí hạ tầng (TCO Infrastructure Model)"
        },
        {
          role: "BACKEND_DB",
          roleName: "Backend & DevOps",
          skillsRequired: ["vLLM Engine Config", "Kubernetes Multi-GPU Deployment", "PagedAttention Memory Profiling"],
          projectDeliverable: "Cụm Inference Server vLLM Autoscaling trên Kubernetes đạt 1.200 tokens/sec"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Stress Test tải nặng bằng Locust", "Đo lường P99 Latency dưới 500 CCU", "VRAM OOM Chaos Testing"],
          projectDeliverable: "Báo cáo kiểm thử chịu tải hạ tầng GPU (Load & Stress Testing Report)"
        }
      ],
      assignment: {
        id: "LAB-10",
        asmNumber: 10,
        title: "Assignment 10: Triển Khai Cụm vLLM High-Throughput Inference Server Trên Kubernetes",
        durationMinutes: 90,
        summary: "Triển khai cụm vLLM serving model Llama 3 qua Docker / Kubernetes, cấu hình Tensor Parallelism 2-GPU và thực hiện Stress Test với Locust.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 10",
          code: "kubectl apply -f k8s/vllm-deployment.yaml && locust -f tests/locustfile.py --headless -u 100 -r 10"
        },
        deliverables: ["Manifest Kubernetes triển khai cụm vLLM Tensor Parallelism", "Báo cáo Stress Test chịu tải 100-500 CCU"]
      },
      topics: [
        {
          title: "1. Thuật Toán PagedAttention & Cơ Chế Continuous Batching Trong vLLM",
          description: "PagedAttention chia nhỏ KV Cache thành các khối trang bộ nhớ không cần liên tục, giúp loại bỏ hoàn toàn hiện tượng phân mảnh bộ nhớ và tăng thông lượng phục vụ lên gấp 10-15 lần.",
          codeSnippet: {
            language: "bash",
            title: "Khởi Chạy vLLM Server Với Tối Ưu Hóa GPU Memory",
            code: `python3 -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Meta-Llama-3-8B-Instruct \\
  --tensor-parallel-size 1 \\
  --gpu-memory-utilization 0.92 \\
  --max-model-len 8192 \\
  --enable-chunked-prefill \\
  --port 8000`
          }
        },
        {
          title: "2. Cấu Hình Tensor Parallelism Đa GPU Trên Kubernetes",
          description: "Kỹ thuật chia sẻ ma trận trọng số mô hình lớn qua nhiều GPU song song (Tensor Parallelism) và triển khai cụm vLLM Autoscaling trên Kubernetes.",
          codeSnippet: {
            language: "yaml",
            title: "Kubernetes Deployment Cụm vLLM Worker Multi-GPU",
            code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-llama3-worker
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        resources:
          limits:
            nvidia.com/gpu: 2 # 2 GPU Tensor Parallel
        command: ["python3", "-m", "vllm.entrypoints.openai.api_server"]
        args: ["--model", "meta-llama/Meta-Llama-3-70B-Instruct", "--tensor-parallel-size", "2"]`
          }
        }
      ]
    },
    {
      id: "MOD-11",
      moduleNumber: 11,
      levelCode: "L4",
      title: "Module 11 • Đánh Giá Định Lượng RAG Triad Với Ragas & Truy Vết Toàn Diện OpenTelemetry Phoenix",
      tag: "Ragas Evals & Observability",
      levelTag: "SFIA L4",
      bloomTaxonomy: "Analyze",
      targetAudience: "AI QA & MLOps Engineers",
      startingFor: "AIBASE",
      description: "Đo lường định lượng 3 chỉ số vàng RAG Triad tự động (Faithfulness, Answer Relevance, Context Recall) và thiết lập hệ thống Prompt Tracing toàn diện với OpenTelemetry & Arize Phoenix.",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "PM / BA",
          skillsRequired: ["Thiết lập Quality KPI Dashboard", "Định nghĩa ngưỡng chấp nhận chất lượng (Threshold > 0.88)", "Phân tích User Feedback Loop"],
          projectDeliverable: "Dashboard theo dõi chỉ số chất lượng phản hồi AI theo thời gian thực"
        },
        {
          role: "FRONTEND",
          roleName: "Frontend & UI",
          skillsRequired: ["Feedback Collector (Like/Dislike/Report)", "Thu thập User Correction Text", "Hiển thị Badge độ tin cậy"],
          projectDeliverable: "Giao diện thu thập phản hồi người dùng tích hợp trực tiếp vào Chat UI"
        },
        {
          role: "QA_SECURITY",
          roleName: "QA & Security",
          skillsRequired: ["Tự động hóa Ragas trên CI/CD Pipeline", "OpenTelemetry Distributed Tracing", "Arize Phoenix Evals Setup"],
          projectDeliverable: "Pipeline tự động kiểm thử chất lượng RAG trước mỗi đợt Release lên Production"
        }
      ],
      assignment: {
        id: "LAB-11",
        asmNumber: 11,
        title: "Assignment 11: Thiết Lập Pipeline Đánh Giá Ragas Tự Động Trên CI/CD & Phoenix Tracing",
        durationMinutes: 90,
        summary: "Đo lường định lượng 3 chỉ số vàng RAG Triad tự động bằng Ragas và thiết lập bảng điều khiển OpenTelemetry Phoenix Tracing theo dõi từng node thực thi.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 11",
          code: "python3 labs/lab11_ragas_eval.py --eval-suite full && python3 -m phoenix.server.main"
        },
        deliverables: ["Dashboard đánh giá định lượng 3 chỉ số RAG Triad", "Hệ thống Phoenix Tracing truy vết chi tiết từng node LLM"]
      },
      topics: [
        {
          title: "1. Đo Lường Định Lượng RAG Triad Tự Động Với Ragas",
          description: "Bộ chỉ số Ragas đo lường 3 góc độ: 1) Faithfulness: Tỉ lệ phát biểu trong câu trả lời có bằng chứng xác thực trong tài liệu; 2) Answer Relevance: Độ phù hợp của câu trả lời với câu hỏi; 3) Context Recall: Mức độ bao phủ đầy đủ dữ kiện cần thiết của tài liệu.",
          codeSnippet: {
            language: "python",
            title: "Đánh Giá Điểm Số RAG Triad Bằng Ragas Tự Động",
            code: `from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevance, context_precision
from datasets import Dataset

eval_data = {
    "question": ["Cơ chế PagedAttention hoạt động như thế nào?"],
    "contexts": [["PagedAttention chia KV Cache thành các khối trang bộ nhớ ảo để chống phân mảnh VRAM."]],
    "answer": ["PagedAttention chia nhỏ KV Cache thành các trang bộ nhớ giúp tối ưu hoá 80% VRAM."]
}

dataset = Dataset.from_dict(eval_data)
results = evaluate(dataset, metrics=[faithfulness, answer_relevance, context_precision])
print(f"Faithfulness Score: {results['faithfulness']:.4f} (Mục tiêu > 0.90)")`
          }
        },
        {
          title: "2. Giám Sát Chi Phí & Truy Vết LLM Với OpenTelemetry & Phoenix",
          description: "Tích hợp OpenTelemetry để ghi log từng request, thời gian trễ TTFT, tổng token tiêu thụ và truy vết từng node thực thi trong LangGraph StateGraph.",
          codeSnippet: {
            language: "python",
            title: "Cấu Hình Phoenix Tracing Tự Động Bắt Lời Gọi LLM",
            code: `import phoenix as px
from openinference.instrumentation.langchain import LangChainInstrumentor

session = px.launch_app(port=6006)
LangChainInstrumentor().instrument()
print(f"Phoenix Tracing Dashboard đang chạy tại: {session.url}")`
          }
        }
      ]
    },
    {
      id: "MOD-12",
      moduleNumber: 12,
      levelCode: "L4",
      title: "Module 12 • Thiết Kế Kiến Trúc AI Doanh Nghiệp (C4 Model), Lakehouse CDC & Quản Trị ISO 42001",
      tag: "Enterprise C4 & ISO 42001",
      levelTag: "SFIA L4",
      bloomTaxonomy: "Analyze",
      targetAudience: "Chief AI Officers & Enterprise Architects",
      startingFor: "AIBASE",
      description: "Mô hình hóa hệ thống AI theo C4 Diagrams 4 tầng, xây dựng Semantic Caching (Redis), Data Lakehouse CDC (Kafka / Debezium) và khung quản trị an toàn ISO/IEC 42001 (AIMS Matrix).",
      crossFunctionalRoles: [
        {
          role: "PM_BA",
          roleName: "Chief AI Officer / Legal",
          skillsRequired: ["Hồ sơ ISO/IEC 42001 Compliance", "Đánh giá tác động rủi ro AI Impact Assessment", "Chiến lược công nghệ AI 3-5 năm"],
          projectDeliverable: "Bộ tài liệu Quy chế Quản trị Hệ thống AI Doanh nghiệp (AIMS Manual)"
        },
        {
          role: "DATA_ENG",
          roleName: "Data & Pipeline",
          skillsRequired: ["Apache Kafka Cluster", "Debezium CDC Connector", "Data Lakehouse Delta/Iceberg Ingestion"],
          projectDeliverable: "Pipeline tự động đồng bộ thay đổi từ Database sang Vector Store thời gian thực"
        },
        {
          role: "BACKEND_DB",
          roleName: "Security & Architect",
          skillsRequired: ["PII Sanitization Regex & Presidio", "Redis Semantic Caching", "Audit Logging chuẩn SOC 2"],
          projectDeliverable: "Module AI Gateway bảo mật tích hợp Semantic Cache và bộ lọc PII Sanitizer"
        }
      ],
      assignment: {
        id: "LAB-12",
        asmNumber: 12,
        title: "Assignment 12: Đóng Gói Toàn Diện Nền Tảng Enterprise AI Production Đạt Chuẩn ISO 42001",
        durationMinutes: 120,
        summary: "Đóng gói toàn diện nền tảng Enterprise AI: C4 Architecture Diagrams, Data Lakehouse CDC Kafka Ingestion và Module Gateway PII Sanitizer đạt chuẩn ISO/IEC 42001.",
        commandSnippet: {
          language: "bash",
          title: "Lệnh Chạy Assignment 12",
          code: "docker compose -f docker-compose.enterprise.yml up -d && pytest tests/test_security_guardrails.py"
        },
        deliverables: ["Bộ hồ sơ thiết kế C4 Diagrams 4 cấp độ", "Data Lakehouse CDC Kafka Ingestion Pipeline", "Module Gateway PII Sanitizer đạt chuẩn ISO 42001"]
      },
      topics: [
        {
          title: "1. Mô Hình Hóa Kiến Trúc Enterprise AI Theo C4 Model",
          description: "Hệ thống AI Enterprise cần được đặc tả ở 4 cấp độ trực quan: System Context, Container, Component và Code, kết hợp Redis Semantic Cache để giảm 70% chi phí gọi LLM.",
          codeSnippet: {
            language: "text",
            title: "Sơ Đồ Kiến Trúc C4 Container Diagram",
            code: `[Enterprise Users / Mobile / Web Clients]
                    │ (HTTPS / SSE Streaming)
                    ▼
[AI Gateway Proxy: Rate Limiting, Semantic Cache & Multi-LLM Router]
        │                                       │
        ├── (Cache Hit: < 15ms)                 ├── (Cache Miss: Forward Request)
        ▼                                       ▼
[Redis Semantic Cache]            [Orchestration Engine: FastAPI Async SSE]
                                        │                       │
                        (Hybrid RAG Search)            (Agent State Execution)
                                        │                       │
                                        ▼                       ▼
                        [Qdrant Distributed Cluster]   [LangGraph Multi-Agent Engine]
                                                                │
                                                (High-Throughput Token Generation)
                                                                │
                                                                ▼
                                                [vLLM Inference Cluster on K8s]`
          }
        },
        {
          title: "2. Khung Quản Trị AI Doanh Nghiệp Theo Chuẩn ISO/IEC 42001 & PII Guardrails",
          description: "Tiêu chuẩn quốc tế ISO/IEC 42001 quy định 4 trụ cột bắt buộc: AI Impact Assessment (AIA), Data Governance & PII Masking, Explainability và Continuous Monitoring.",
          codeSnippet: {
            language: "python",
            title: "Bộ Lọc An Toàn Dữ Liệu PII & Guardrails Trước Khi Gửi Vào LLM",
            code: `import re

def pii_sanitization_guardrail(raw_prompt: str) -> str:
    """Tự động phát hiện và ẩn danh hoá thông tin nhạy cảm PII chuẩn ISO 42001."""
    sanitized = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[REDACTED_EMAIL]", raw_prompt)
    sanitized = re.sub(r"(\+84|0)\d{9,10}", "[REDACTED_PHONE]", sanitized)
    sanitized = re.sub(r"\b\d{12}\b", "[REDACTED_NATIONAL_ID]", sanitized)
    sanitized = re.sub(r"(sk-[a-zA-Z0-9]{32,})", "[REDACTED_SECRET_KEY]", sanitized)
    return sanitized`
          }
        }
      ]
    }
  ],

  // 3. NGÂN HÀNG ĐỀ THI MÔ PHỎNG (MOCK EXAMS - 100% TUÂN THỦ BẢO MẬT & NDA)
  mockTests: [
    {
      id: "MOCK-L1",
      title: "Bài Test Level 1: Đánh Giá Năng Lực Nhận Biết & Vận Hành AI Cơ Bản",
      targetLevel: "SFIA Level 1 (Follow)",
      levelNumber: 1,
      durationMinutes: 30,
      passingScore: 70,
      description: "Đánh giá mức độ hiểu biết về Token, Context-window, kiểm soát tham số Temperature, kỹ thuật Prompting cơ bản và phòng ngừa ảo giác.",
      sources: "SFIA Foundation (v8), DeepLearning.AI, OpenAI Prompt Guide",
      targetGroup: "Non-tech & Business, Người mới bắt đầu",
      questions: [
        {
          id: "L1-Q1",
          questionText: "Trong các mô hình ngôn ngữ lớn (LLM), 'Token' được định nghĩa chính xác là gì?",
          bloomLevel: "Remember",
          options: [
            { id: "A", text: "Là một từ tiếng Anh hoàn chỉnh được định nghĩa trong từ điển Oxford." },
            { id: "B", text: "Là đơn vị xử lý ngôn ngữ nhỏ nhất (khoảng 0.75 từ tiếng Anh, hoặc 1-2 ký tự tiếng Việt với BPE Tokenizer)." },
            { id: "C", text: "Là một câu hoàn chỉnh kết thúc bằng dấu chấm." },
            { id: "D", text: "Là một bức ảnh được nén thành chuỗi nhị phân." }
          ],
          correctOption: "B",
          explanation: "Token là các khối con của từ (Sub-word units) được thuật toán Byte-Pair Encoding (BPE) trích xuất để mô hình tiếp nhận và tính toán xác suất."
        },
        {
          id: "L1-Q2",
          questionText: "Khi cần LLM thực hiện tác vụ trích xuất dữ liệu chính xác từ hóa đơn, bạn nên điều chỉnh tham số Temperature như thế nào?",
          bloomLevel: "Understand",
          options: [
            { id: "A", text: "Đặt Temperature gần 0.0 (ví dụ: 0.0 - 0.2) để câu trả lời có tính xác định và chính xác cao nhất." },
            { id: "B", text: "Đặt Temperature tối đa 2.0 để mô hình sáng tạo thêm thông tin còn thiếu." },
            { id: "C", text: "Đặt Temperature bằng 1.5 để mô hình dịch sang nhiều ngôn ngữ khác nhau." },
            { id: "D", text: "Tham số Temperature không ảnh hưởng gì đến kết quả trích xuất." }
          ],
          correctOption: "A",
          explanation: "Temperature thấp (gần 0) làm sắc nét phân phối xác suất, khiến mô hình luôn chọn token có xác suất cao nhất, đảm bảo tính chính xác và nhất quán."
        },
        {
          id: "L1-Q3",
          questionText: "Hiện tượng 'Ảo giác' (Hallucination) trong LLM xảy ra do nguyên nhân cốt lõi nào?",
          bloomLevel: "Understand",
          options: [
            { id: "A", text: "Do server của nhà cung cấp bị mất kết nối Internet tạm thời." },
            { id: "B", text: "Do bản chất của LLM là mô hình sinh xác suất token tiếp theo, không có cơ chế tự kiểm chứng sự thật khách quan." },
            { id: "C", text: "Do người dùng viết hoa toàn bộ câu hỏi." },
            { id: "D", text: "Do máy tính của người dùng bị nhiễm virus." }
          ],
          correctOption: "B",
          explanation: "LLM sinh ra các từ nghe có vẻ hợp lý dựa trên xác suất thống kê trong dữ liệu huấn luyện, chứ không sở hữu cơ sở tri thức thực tế để tự kiểm tra tính chân thực nếu không được cung cấp ngữ cảnh (RAG)."
        },
        {
          id: "L1-Q4",
          questionText: "Kỹ thuật 'Few-shot Prompting' khác biệt với 'Zero-shot Prompting' ở điểm nào?",
          bloomLevel: "Remember",
          options: [
            { id: "A", text: "Few-shot cung cấp sẵn 1 đến vài cặp ví dụ mẫu (Input -> Output) trong lời nhắc trước khi yêu cầu mô hình xử lý." },
            { id: "B", text: "Few-shot bắt buộc phải huấn luyện lại toàn bộ trọng số của mô hình." },
            { id: "C", text: "Few-shot chỉ áp dụng được cho ngôn ngữ tiếng Anh." },
            { id: "D", text: "Few-shot không cho phép sử dụng dấu ngoặc kép." }
          ],
          correctOption: "A",
          explanation: "Few-shot đưa vào ngữ cảnh vài mẫu ví dụ thực tế giúp mô hình nắm bắt định dạng và quy luật mong muốn của người dùng ngay lập tức."
        },
        {
          id: "L1-Q5",
          questionText: "Khái niệm 'Context Window' (Cửa sổ ngữ cảnh) của một mô hình LLM có ý nghĩa gì?",
          bloomLevel: "Remember",
          options: [
            { id: "A", text: "Là kích thước màn hình máy tính của người dùng khi mở ứng dụng chat." },
            { id: "B", text: "Là tổng số lượng token tối đa (bao gồm cả prompt đầu vào và câu trả lời đầu ra) mà mô hình có thể xử lý trong một phiên." },
            { id: "C", text: "Là số lượng cửa sổ trình duyệt tối đa được phép mở cùng lúc." },
            { id: "D", text: "Là thời gian mô hình phản hồi tính bằng mili giây." }
          ],
          correctOption: "B",
          explanation: "Context Window xác định dung lượng bộ nhớ làm việc của mô hình trong 1 request. Nếu vượt quá giới hạn này, thông tin cũ sẽ bị cắt bỏ (Truncated)."
        }
      ],
      essayQuestions: [
        {
          id: "L1-E1",
          title: "Tình huống: Xây dựng Master Prompt tự động hóa hỗ trợ khách hàng",
          scenario: "Một công ty thương mại điện tử nhận được hàng nghìn email phàn nàn mỗi ngày về việc giao hàng chậm trễ. Hiện tại nhân viên CSKH đang mất quá nhiều thời gian để soạn từng email xin lỗi thủ công.",
          requirements: [
            "Viết một Master Prompt chuẩn (áp dụng Persona, Context, Clear Instruction và Guardrails).",
            "Nêu rõ các biện pháp trong prompt để ngăn chặn AI cam kết bồi thường tiền vượt thẩm quyền (chống ảo giác)."
          ],
          sampleAnswerGuide: "Prompt cần định rõ: Role (Chuyên viên CSKH), Context (Giao hàng trễ), Quy tắc bồi thường (Chỉ tặng voucher 10%, không cam kết hoàn tiền nếu chưa có xác nhận từ kế toán), Output format (Lịch sự, chân thành, ngắn gọn < 150 từ).",
          scoringCriteria: [
            "Cấu trúc Prompt chuẩn mực (Persona, Rules, Format): 50%",
            "Kiểm soát rủi ro & chống ảo giác chính sách: 50%"
          ]
        }
      ]
    },
    {
      id: "MOCK-L2",
      title: "Bài Test Level 2: Đánh Giá Năng Lực Hiểu Sâu & Xây Dựng Prompt Pipeline",
      targetLevel: "SFIA Level 2 (Understand)",
      levelNumber: 2,
      durationMinutes: 45,
      passingScore: 75,
      description: "Đánh giá khả năng áp dụng Chain-of-Thought, cưỡng chế đầu ra JSON Schema, xử lý luồng công việc tự động và an toàn dữ liệu PII.",
      sources: "SFIA Foundation (v8), Stanford CS224N, OpenAI Cookbooks",
      targetGroup: "Non-tech Nâng Cao, Business Analysts, QA",
      questions: [
        {
          id: "L2-Q1",
          questionText: "Kỹ thuật Chain-of-Thought (CoT) Prompting đem lại lợi ích lớn nhất trong nhóm bài toán nào?",
          bloomLevel: "Understand",
          options: [
            { id: "A", text: "Các bài toán suy luận logic, toán học nhiều bước và phân tích tình huống phức tạp." },
            { id: "B", text: "Các tác vụ dịch từ đơn giản từ tiếng Anh sang tiếng Pháp." },
            { id: "C", text: "Các tác vụ đổi chữ thường thành chữ in hoa." },
            { id: "D", text: "Tác vụ đếm số ký tự trong một đoạn văn bản ngắn." }
          ],
          correctOption: "A",
          explanation: "CoT cho phép mô hình phân rã bài toán phức tạp thành các bước suy luận trung gian (Intermediate steps), giúp tăng tỷ lệ tính đúng từ 40% lên trên 85%."
        },
        {
          id: "L2-Q2",
          questionText: "Khi cần tích hợp kết quả từ AI vào hệ thống Backend Database, tại sao nên dùng Structured Output (JSON Schema) thay vì văn bản tự do?",
          bloomLevel: "Understand",
          options: [
            { id: "A", text: "Vì định dạng JSON đảm bảo cấu trúc dữ liệu nghiêm ngặt, có thể parse an toàn bằng JSON.parse() mà không bị lỗi cú pháp." },
            { id: "B", text: "Vì JSON giúp mô hình trả lời nhanh gấp 10 lần." },
            { id: "C", text: "Vì JSON giúp giảm dung lượng ổ cứng của server xuống 0." },
            { id: "D", text: "Vì JSON là ngôn ngữ bí mật của các kỹ sư AI." }
          ],
          correctOption: "A",
          explanation: "Structured Output bắt buộc mô hình tuân thủ tuyệt đối Schema đã định nghĩa, đảm bảo các trường bắt buộc và kiểu dữ liệu luôn đúng để backend xử lý."
        },
        {
          id: "L2-Q3",
          questionText: "Khái niệm PII (Personally Identifiable Information) trong quy định an toàn dữ liệu AI bao gồm những thông tin nào?",
          bloomLevel: "Remember",
          options: [
            { id: "A", text: "Số CMND/CCCD, Số thẻ tín dụng, Số điện thoại cá nhân, Địa chỉ nhà riêng." },
            { id: "B", text: "Tên hệ điều hành Windows hoặc macOS của người dùng." },
            { id: "C", text: "Dung lượng RAM của máy chủ AI." },
            { id: "D", text: "Mã màu hex của giao diện website." }
          ],
          correctOption: "A",
          explanation: "PII là bất kỳ thông tin nào có thể dùng để định danh trực tiếp hoặc gián tiếp một cá nhân, bắt buộc phải lọc bỏ (Redaction) trước khi gửi qua API công cộng."
        }
      ],
      essayQuestions: [
        {
          id: "L2-E1",
          title: "Tình huống: Thiết kế luồng xử lý trích xuất hồ sơ ứng viên tự động",
          scenario: "Bộ phận Tuyển dụng nhận hàng trăm CV định dạng PDF mỗi tuần. Họ cần trích xuất: Họ tên, Số năm kinh nghiệm, Kỹ năng chính, và Cấp độ SFIA tương ứng vào một bảng dữ liệu chuẩn.",
          requirements: [
            "Thiết kế JSON Schema hoàn chỉnh cho hồ sơ ứng viên.",
            "Nêu quy trình xử lý dữ liệu PII nhạy cảm trước khi lưu trữ."
          ],
          sampleAnswerGuide: "JSON Schema cần chứa các trường: full_name (string), years_of_experience (number), skills (array of strings), estimated_sfia_level (enum: L1-L7). Mô tả giải pháp che số CCCD và địa chỉ chi tiết.",
          scoringCriteria: [
            "Chuẩn xác cấu trúc JSON Schema: 50%",
            "Biện pháp bảo vệ PII & Tuân thủ đạo đức: 50%"
          ]
        }
      ]
    },
    {
      id: "MOCK-L3",
      title: "Bài Test Level 3: Đánh Giá Năng Lực Áp Dụng Lập Trình Backend AI, Vector DB & Hybrid RAG",
      targetLevel: "SFIA Level 3 (Apply)",
      levelNumber: 3,
      durationMinutes: 60,
      passingScore: 75,
      description: "Đánh giá kỹ thuật lập trình FastAPI SSE Streaming, chỉ mục HNSW trong Qdrant/pgvector, tính khoảng cách Cosine Distance và chiến lược Chunking.",
      sources: "SFIA Foundation (v8), Qdrant Documentation, FastAPI Guide",
      targetGroup: "Tech-base (Web/Mobile/Backend Developers, Data Engineers)",
      questions: [
        {
          id: "L3-Q1",
          questionText: "Trong cơ chế tìm kiếm vector ngữ nghĩa, công thức nào thường được dùng để tính độ tương đồng giữa 2 vector u và v?",
          bloomLevel: "Apply",
          codeBlock: "Cosine Similarity = (u . v) / (||u|| * ||v||)",
          options: [
            { id: "A", text: "Cosine Similarity (Tích vô hướng chia cho tích độ dài của 2 vector)." },
            { id: "B", text: "Phép nhân ma trận nghịch đảo u * v^(-1)." },
            { id: "C", text: "Phép cộng trực tiếp các phần tử vector (u + v)." },
            { id: "D", text: "Phép biến đổi Fourier nhanh (FFT)." }
          ],
          correctOption: "A",
          explanation: "Cosine Similarity đo góc giữa 2 vector trong không gian đa chiều, nhận giá trị từ -1 đến 1, phản ánh độ tương đồng ngữ nghĩa mà không bị ảnh hưởng bởi độ dài văn bản."
        },
        {
          id: "L3-Q2",
          questionText: "Cấu trúc chỉ mục HNSW (Hierarchical Navigable Small World) trong Vector DB giải quyết bài toán tìm kiếm với độ phức tạp trung bình là bao nhiêu?",
          bloomLevel: "Analyze",
          options: [
            { id: "A", text: "O(log N) - Logarithmic tương tự như tìm kiếm trên Skip List nhiều tầng." },
            { id: "B", text: "O(N) - Quét tuần tự toàn bộ vector." },
            { id: "C", text: "O(N^2) - Toàn bộ các cặp khoảng cách." },
            { id: "D", text: "O(1) - Tra bảng không đổi." }
          ],
          correctOption: "A",
          explanation: "HNSW xây dựng đồ thị phân tầng giúp nhảy xa ở tầng trên và hội tụ chính xác ở tầng dưới, đạt tốc độ tìm kiếm O(log N) cho hàng triệu vector."
        },
        {
          id: "L3-Q3",
          questionText: "Tại sao trong ứng dụng AI Chatbot thời gian thực, giao thức Server-Sent Events (SSE) lại được ưu tiên hơn REST API truyền thống?",
          bloomLevel: "Apply",
          options: [
            { id: "A", text: "Vì SSE cho phép stream từng token sinh ra về Client ngay lập tức, giảm thời gian chờ đợi nhận thức (TTFT < 300ms)." },
            { id: "B", text: "Vì REST API không thể gửi được văn bản tiếng Việt." },
            { id: "C", text: "Vì SSE hoàn toàn không tiêu tốn băng thông mạng." },
            { id: "D", text: "Vì REST API bị cấm trong các hệ thống doanh nghiệp." }
          ],
          correctOption: "A",
          explanation: "Với SSE, người dùng có thể đọc câu trả lời ngay khi LLM vừa sinh những từ đầu tiên, thay vì phải đợi 5-10 giây cho toàn bộ câu trả lời hoàn tất."
        }
      ],
      essayQuestions: [
        {
          id: "L3-E1",
          title: "Tình huống: Thiết kế hệ thống RAG tra cứu cẩm nang nhân sự 500 trang",
          scenario: "Doanh nghiệp có tài liệu cẩm nang nội bộ dạng PDF 500 trang. Cần xây dựng dịch vụ tra cứu hỏi đáp trả về câu trả lời kèm chính xác số trang và trích dẫn.",
          requirements: [
            "Đề xuất chiến lược chia đoạn (Chunking Strategy) và kích thước chunk/overlap.",
            "Thiết kế cấu trúc Schema Payload trong Qdrant để lưu trữ metadata phục vụ lọc theo phòng ban.",
            "Viết mã nguồn khung FastAPI SSE streaming trả lời người dùng."
          ],
          sampleAnswerGuide: "Đề xuất RecursiveCharacterTextSplitter (chunk_size=1000, overlap=150). Payload: document_id, page_number, department, section_title. Code FastAPI dùng StreamingResponse và async generator.",
          scoringCriteria: [
            "Chiến lược Chunking & Qdrant Payload: 40%",
            "Kiến trúc Backend Async FastAPI Streaming: 60%"
          ]
        }
      ]
    },
    {
      id: "MOCK-L4",
      title: "Bài Test Level 4: Đánh Giá Năng Lực Phân Tích Multi-Agent LangGraph & LoRA Fine-Tuning",
      targetLevel: "SFIA Level 4 (Analyze)",
      levelNumber: 4,
      durationMinutes: 60,
      passingScore: 80,
      description: "Đánh giá cơ chế toán học Attention ($QK^T / \\sqrt{d_k}$), đồ thị tác nhân LangGraph State Machine, thuật toán Reciprocal Rank Fusion (RRF) và kỹ thuật LoRA.",
      sources: "SFIA Foundation (v8), Stanford CS224N, HuggingFace, DeepLearning.AI",
      targetGroup: "Tech-base Nâng Cao & AI-base Bắt Đầu",
      questions: [
        {
          id: "L4-Q1",
          questionText: "Trong cơ chế Scaled Dot-Product Attention, tại sao tích ma trận (Q * K^T) lại phải chia cho căn bậc hai của d_k (sqrt(d_k)) trước khi đưa qua hàm Softmax?",
          bloomLevel: "Understand",
          codeBlock: "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V",
          options: [
            { id: "A", text: "Để tránh giá trị tích vô hướng quá lớn làm Softmax rơi vào vùng có đạo hàm cực nhỏ (Vanishing Gradient)." },
            { id: "B", text: "Để giảm kích thước ma trận xuống giúp GPU xử lý nhanh hơn." },
            { id: "C", text: "Để chuyển đổi giá trị Attention Scores về phân phối chuẩn Gauss." },
            { id: "D", text: "Để ma trận kết quả luôn có định thức bằng 1." }
          ],
          correctOption: "A",
          explanation: "Khi d_k lớn, phương sai của tích vô hướng tăng lên d_k. Nếu không scale, các giá trị lớn sẽ khiến Softmax bị bão hòa, làm triệt tiêu gradient trong quá trình lan truyền ngược."
        },
        {
          id: "L4-Q2",
          questionText: "Trong kỹ thuật Low-Rank Adaptation (LoRA), nếu ma trận trọng số gốc W_0 có kích thước 4096 x 4096 và chọn Rank r = 16, số lượng tham số cần huấn luyện qua 2 ma trận phân rã B (4096 x 16) và A (16 x 4096) giảm bao nhiêu % so với W_0?",
          bloomLevel: "Apply",
          codeBlock: "Delta_W = B (4096 x 16) * A (16 x 4096) = 131,072 params\nW_0 = 4096 * 4096 = 16,777,216 params",
          options: [
            { id: "A", text: "Giảm hơn 99.2% số tham số cần huấn luyện." },
            { id: "B", text: "Giảm khoảng 50% số tham số." },
            { id: "C", text: "Giảm khoảng 80% số tham số." },
            { id: "D", text: "Không làm giảm số tham số." }
          ],
          correctOption: "A",
          explanation: "Tổng tham số LoRA = 131,072 so với 16,777,216 của ma trận gốc, tức chỉ chiếm 0.78% (giảm tới 99.22% tham số cần gradient update)."
        },
        {
          id: "L4-Q3",
          questionText: "Khi xây dựng pipeline Hybrid Search kết hợp Dense Vector Search và BM25 Sparse Search, thuật toán nào thường được dùng để hợp nhất thứ hạng các tài liệu từ 2 nguồn?",
          bloomLevel: "Apply",
          options: [
            { id: "A", text: "Reciprocal Rank Fusion (RRF) với hằng số làm mượt k=60." },
            { id: "B", text: "Linear Weighted Sum trực tiếp của điểm số Cosine và BM25 thô." },
            { id: "C", text: "Thuật toán K-Means Clustering." },
            { id: "D", text: "Thuật toán PageRank." }
          ],
          correctOption: "A",
          explanation: "RRF là phương pháp chuẩn mực vì nó không phụ thuộc vào thang điểm tuyệt đối khác nhau giữa Cosine (0 đến 1) và BM25 (0 đến vô cùng), mà chỉ dựa vào thứ hạng xếp hạng rank(d)."
        }
      ],
      essayQuestions: [
        {
          id: "L4-E1",
          title: "Tình huống: Thiết kế hệ sinh thái Multi-Agent tự động viết và kiểm thử code",
          scenario: "Một công ty công nghệ muốn tự động hóa quy trình viết Unit Test cho mã nguồn Python. Họ muốn xây dựng hệ thống gồm 3 Agent: Planner phân tích yêu cầu -> Tester sinh mã Unit test -> Reviewer chạy kiểm thử và phản hồi nếu có lỗi.",
          requirements: [
            "Vẽ sơ đồ luồng trạng thái StateGraph hoàn chỉnh với LangGraph (kèm điều kiện rẽ nhánh).",
            "Định nghĩa kiểu dữ liệu AgentState bằng TypedDict.",
            "Nêu giải pháp ngăn chặn vòng lặp vô hạn (Infinite Loop prevention) khi test liên tục fail."
          ],
          sampleAnswerGuide: "Định nghĩa StateGraph với conditional edges kiểm tra retry_count <= 3. State chứa: code, test_code, test_result, retry_count. Rẽ nhánh sang END nếu pass hoặc quá số lần thử.",
          scoringCriteria: [
            "Thiết kế LangGraph StateGraph chuẩn xác & Xử lý vòng lặp: 50%",
            "Tư duy tối ưu hóa hiệu năng & An toàn hệ thống: 50%"
          ]
        }
      ]
    },
    {
      id: "MOCK-PLACEMENT",
      title: "Bài Test Tổng Quát Định Vị Cấp Độ (SFIA Placement Test)",
      targetLevel: "Đa Cấp Độ (Level 1 -> Level 4)",
      levelNumber: 0,
      durationMinutes: 45,
      passingScore: 60,
      description: "Bài kiểm tra ma trận đa cấp độ giúp bạn xác định chính xác trình độ hiện tại của bản thân để gợi ý lộ trình học tập tối ưu nhất (Non-tech -> L1, Tech-base -> L3, hay AI-base -> L4).",
      sources: "SFIA Foundation (v8), Stanford CS224N, DeepLearning.AI",
      targetGroup: "Dành Cho Tất Cả Học Viên Chưa Biết Điểm Bắt Đầu Của Mình",
      questions: [
        {
          id: "PL-Q1",
          questionText: "[Nhận biết - L1] Khái niệm Temperature trong mô hình ngôn ngữ lớn kiểm soát điều gì?",
          bloomLevel: "Remember",
          options: [
            { id: "A", text: "Mức độ ngẫu nhiên và tính sáng tạo trong phân phối xác suất từ ngữ tiếp theo." },
            { id: "B", text: "Nhiệt độ vật lý của chip GPU khi xử lý phép tính." },
            { id: "C", text: "Tốc độ quạt tản nhiệt của máy chủ." },
            { id: "D", text: "Dung lượng pin của thiết bị người dùng." }
          ],
          correctOption: "A",
          explanation: "Temperature điều chỉnh độ phẳng của hàm Softmax trên tập Logits của từ vựng."
        },
        {
          id: "PL-Q2",
          questionText: "[Hiểu sâu - L2] Khi nào bạn nên áp dụng Chain-of-Thought (CoT) Prompting?",
          bloomLevel: "Understand",
          options: [
            { id: "A", text: "Khi giải các bài toán cần suy luận logic nhiều bước hoặc tính toán số liệu." },
            { id: "B", text: "Khi chỉ cần dịch một từ vựng đơn lẻ." },
            { id: "C", text: "Khi muốn mô hình trả lời nhanh trong 10 mili giây." },
            { id: "D", text: "Khi không có kết nối Internet." }
          ],
          correctOption: "A",
          explanation: "CoT kích hoạt các bước suy luận trung gian giúp giải quyết bài toán phức tạp chính xác hơn."
        },
        {
          id: "PL-Q3",
          questionText: "[Áp dụng - L3] Vector Database (như Qdrant) sử dụng cơ chế nào để tìm kiếm dữ liệu tương đồng ngữ nghĩa?",
          bloomLevel: "Apply",
          options: [
            { id: "A", text: "Tính toán khoảng cách Cosine hoặc Euclidean giữa các vector embedding trong không gian nhiều chiều." },
            { id: "B", text: "So khớp chính xác từng ký tự theo câu lệnh SQL LIKE '%...%'." },
            { id: "C", text: "Sắp xếp dữ liệu theo bảng chữ cái từ A đến Z." },
            { id: "D", text: "Đếm số lần xuất hiện của từ khóa trong văn bản." }
          ],
          correctOption: "A",
          explanation: "Vector DB tính toán khoảng cách góc (Cosine Distance) hoặc khoảng cách hình học trong không gian vector để tìm các đoạn văn có ngữ nghĩa tương tự."
        },
        {
          id: "PL-Q4",
          questionText: "[Phân tích - L4] Mục đích chính của kỹ thuật Low-Rank Adaptation (LoRA) là gì?",
          bloomLevel: "Analyze",
          options: [
            { id: "A", text: "Cho phép Fine-tuning mô hình ngôn ngữ lớn hiệu quả bằng cách chỉ cập nhật một ma trận phân rã hạng thấp, tiết kiệm hơn 90% bộ nhớ GPU." },
            { id: "B", text: "Giảm độ phân giải của hình ảnh trước khi đưa vào mô hình." },
            { id: "C", text: "Tăng kích thước file trọng số mô hình lên gấp 10 lần." },
            { id: "D", text: "Chuyển đổi toàn bộ code Python sang ngôn ngữ C++." }
          ],
          correctOption: "A",
          explanation: "LoRA cố định trọng số gốc và học ma trận delta hạng thấp r, giúp tiết kiệm bộ nhớ VRAM và chi phí tính toán khi fine-tuning."
        }
      ],
      essayQuestions: [
        {
          id: "PL-E1",
          title: "Định Vị Năng Lực & Mục Tiêu Cá Nhân",
          scenario: "Bạn hãy mô tả nền tảng hiện tại của mình (Ví dụ: Đang làm Business/Marketing, đang là Lập trình viên Web/Backend, hay đang nghiên cứu AI) và bài toán AI bạn muốn giải quyết trong 3 tháng tới.",
          requirements: [
            "Mô tả nền tảng hiện tại (Non-tech, Tech-base, hay AI-base).",
            "Trình bày giải pháp công nghệ bạn dự định áp dụng để giải quyết bài toán đó."
          ],
          sampleAnswerGuide: "AI sẽ phân tích câu trả lời để xếp học viên vào lộ trình xuất phát tối ưu nhất (Level 1, Level 3, hoặc Level 4).",
          scoringCriteria: [
            "Mức độ rõ ràng về mục tiêu & Định vị năng lực: 100%"
          ]
        }
      ]
    }
  ],

  // 4. TECH STACK THAM CHIẾU
  techStack: [
    {
      category: "Async Python & FastAPIs",
      icon: "zap",
      description: "Nền tảng lập trình hiệu năng cao cho backend AI xử lý đồng thời hàng nghìn kết nối.",
      technologies: [
        { name: "FastAPI", desc: "Framework web hiện đại, hỗ trợ chuẩn xác OpenAPI, Pydantic v2 và SSE Streaming.", tag: "Core Backend" },
        { name: "Asyncio & Aiohttp", desc: "Xử lý Non-blocking I/O cho các lệnh gọi LLM API và Vector Database song song.", tag: "Concurrency" },
        { name: "Pydantic v2", desc: "Xác thực Schema dữ liệu tốc độ cao viết bằng Rust, đảm bảo Type Safety tuyệt đối.", tag: "Data Validation" }
      ]
    },
    {
      category: "Vector Databases & Search",
      icon: "database",
      description: "Cơ sở dữ liệu chuyên dụng lưu trữ và tìm kiếm vector tương đồng ngữ nghĩa quy mô hàng triệu bản ghi.",
      technologies: [
        { name: "Qdrant", desc: "Vector DB viết bằng Rust, tối ưu HNSW Index, hỗ trợ Payload Filtering mạnh mẽ.", tag: "Production Vector DB" },
        { name: "ChromaDB", desc: "Vector DB mã nguồn mở gọn nhẹ, lý tưởng cho môi trường thử nghiệm và MVP nhanh.", tag: "Prototyping" },
        { name: "Milvus / pgvector", desc: "Giải pháp vector phân tán cho Big Data hoặc mở rộng trực tiếp trên PostgreSQL có sẵn.", tag: "Enterprise Scale" }
      ]
    },
    {
      category: "Agent Frameworks & Orchestration",
      icon: "cpu",
      description: "Bộ khung xây dựng các tác nhân AI tự chủ có khả năng suy luận, lập kế hoạch và phối hợp đa tác nhân.",
      technologies: [
        { name: "LangGraph", desc: "Xây dựng Agent dạng đồ thị có trạng thái (Stateful Graph), kiểm soát chính xác luồng ReAct.", tag: "Stateful Agent" },
        { name: "CrewAI", desc: "Framework mô phỏng đội nhóm tác nhân AI phân vai chuyên biệt phối hợp cùng hoàn thành mục tiêu.", tag: "Multi-Agent" },
        { name: "LlamaIndex", desc: "Framework chuyên sâu về Data Ingestion, Advanced RAG và kết nối dữ liệu cấu trúc phức tạp.", tag: "RAG Framework" }
      ]
    },
    {
      category: "Inference Engines & Optimization",
      icon: "server",
      description: "Hạ tầng phục vụ suy luận mô hình ngôn ngữ lớn tốc độ cao trên phần cứng GPU.",
      technologies: [
        { name: "vLLM", desc: "Inference Engine dẫn đầu với công nghệ PagedAttention và Continuous Batching tối đa hóa GPU throughput.", tag: "High-Throughput" },
        { name: "TensorRT-LLM", desc: "Thư viện tối ưu hóa suy luận từ NVIDIA tận dụng tối đa kiến trúc Tensor Core GPU.", tag: "NVIDIA Hardware" },
        { name: "Ollama / SGLang", desc: "Công cụ triển khai mô hình cục bộ nhanh chóng cho môi trường phát triển và kiểm thử.", tag: "Local Serving" }
      ]
    }
  ],

  // 5. OPEN SOURCE HUB REPOSITORIES
  openSourceHub: [
    {
      id: "hub-1",
      organization: "Hugging Face",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      stars: "140k+",
      repoName: "huggingface/transformers",
      categoryTag: "Core NLP & Model Hub",
      description: "Thư viện chuẩn mực toàn cầu cung cấp hàng nghìn mô hình Transformer tiền huấn luyện phục vụ NLP, Vision và Audio.",
      practicalHighlight: "Pipeline API suy luận mô hình chỉ với 3 dòng code Python.",
      coreTopics: ["NLP", "Transformers", "PyTorch"],
      githubUrl: "https://github.com/huggingface/transformers"
    },
    {
      id: "hub-2",
      organization: "Anthropic Claude",
      badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      stars: "15k+",
      repoName: "anthropics/anthropic-cookbook",
      categoryTag: "Claude API & Patterns",
      description: "Kho giáo trình và hướng dẫn thực hành chính thức khai thác Claude 3.5 Sonnet, Tool Calling, Vision và Extended Thinking.",
      practicalHighlight: "Mẫu kiến trúc Computer Use và Contextual Retrieval chuẩn production.",
      coreTopics: ["Claude", "Prompting", "Agents"],
      githubUrl: "https://github.com/anthropics/anthropic-cookbook"
    },
    {
      id: "hub-3",
      organization: "Google Gemini",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      stars: "22k+",
      repoName: "google-gemini/cookbook",
      categoryTag: "Multimodal & Gemini 2.0",
      description: "Bộ sưu tập code mẫu chính thức hướng dẫn tích hợp Google Gemini API, xử lý video/audio dài và Multimodal Live.",
      practicalHighlight: "Kỹ thuật tận dụng 2 triệu tokens Context Window và Structured Outputs.",
      coreTopics: ["Gemini", "Multimodal", "Python"],
      githubUrl: "https://github.com/google-gemini/cookbook"
    },
    {
      id: "hub-4",
      organization: "AI Infrastructure",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      stars: "45k+",
      repoName: "vllm-project/vllm",
      categoryTag: "High-Throughput LLM Serving",
      description: "Inference Engine dẫn đầu thế giới sử dụng thuật toán PagedAttention giúp tối ưu bộ nhớ GPU và phục vụ hàng nghìn requests/giây.",
      practicalHighlight: "Hạ tầng phục vụ suy luận chuẩn OpenAI-compatible API.",
      coreTopics: ["vLLM", "CUDA", "Inference"],
      githubUrl: "https://github.com/vllm-project/vllm"
    },
    {
      id: "hub-5",
      organization: "Agentic & RAG",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      stars: "18k+",
      repoName: "langchain-ai/langgraph",
      categoryTag: "Multi-Agent Orchestration",
      description: "Thư viện điều phối tác nhân AI dạng đồ thị tuần hoàn có kiểm soát trạng thái, hỗ trợ Human-in-the-loop và Time-travel debugging.",
      practicalHighlight: "Triển khai hệ thống Multi-Agent phân vai tự chủ có độ tin cậy cao.",
      coreTopics: ["Agents", "Graph", "Stateful"],
      githubUrl: "https://github.com/langchain-ai/langgraph"
    },
    {
      id: "hub-6",
      organization: "Vector DB & Search",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      stars: "24k+",
      repoName: "qdrant/qdrant",
      categoryTag: "Vector Similarity Search",
      description: "Cơ sở dữ liệu vector mã nguồn mở viết bằng Rust, hỗ trợ HNSW Index, Dense & Sparse Vectors và Payload filtering.",
      practicalHighlight: "Hệ thống Hybrid Search kết hợp BM25 và Vector Search dưới 5ms.",
      coreTopics: ["Qdrant", "Rust", "VectorDB"],
      githubUrl: "https://github.com/qdrant/qdrant"
    }
  ]
};
