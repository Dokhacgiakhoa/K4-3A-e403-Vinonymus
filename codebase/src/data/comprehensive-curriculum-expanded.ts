/**
 * Comprehensive Expanded AI Curriculum Catalog (67 Modules & 150+ Practical Labs)
 * Framework: SFIA v8 (Level 0 -> Level 4) & Bloom's Taxonomy
 * Scope: Enterprise AI Engineering, Production MLOps, Autonomous Multi-Agents & AI Governance
 */

import { CurriculumModuleItem } from './sfia-community-data';

export const COMPREHENSIVE_EXPANDED_MODULES: CurriculumModuleItem[] = [
  // =========================================================================
  // TẦNG 0: AI FOUNDATIONS (BỔ SUNG THÊM 5 MODULES -> TỔNG 10 CHUYÊN ĐỀ L0)
  // =========================================================================
  {
    id: "MOD-08",
    moduleNumber: 8,
    levelCode: "L0",
    title: "Chuyên Đề 0.8 • Nghệ Thuật Prompt Engineering: Zero-Shot, Few-Shot & Chain-of-Thought",
    tag: "Prompt Engineering Thực Chiến",
    levelTag: "Level 0 • Foundation",
    bloomTaxonomy: "Apply",
    targetAudience: "Mọi đối tượng, Dân văn phòng, Marketer, Quản lý",
    startingFor: "NONTECH",
    description: "Làm chủ kỹ nghệ ra lệnh cho AI để tăng năng suất x5 lần: Cấu trúc prompt 4 thành phần (Role, Context, Task, Constraint), kỹ thuật suy luận từng bước (Chain-of-Thought) và kiểm soát định dạng đầu ra.",
    assignment: {
      id: "LAB-008",
      asmNumber: 8,
      title: "Assignment 0.8: Xây Dựng Bộ Prompt Master Cho 5 Quy Trình Nghiệp Vụ Doanh Nghiệp",
      durationMinutes: 45,
      summary: "Tạo lập và kiểm thử bộ 5 prompt chuẩn mực giúp tự động hóa khâu soạn thảo email, phân tích báo cáo doanh thu và tạo dàn ý thuyết trình không lỗi ảo giác.",
      deliverables: ["File JSON chứa 5 master prompts", "Bản so sánh kết quả Zero-shot vs Few-shot"]
    },
    topics: [
      { title: "1. Cấu Trúc Khung Prompt 4 Thành Phần Chuẩn Kỹ Nghệ", description: "Nguyên tắc thiết lập Role, Context, Task và Constraints để triệt tiêu 80% ảo giác thông thường." },
      { title: "2. Kỹ Thuật Chain-of-Thought (CoT) & Kích Hoạt Suy Luận Logic", description: "Bí quyết ra lệnh 'Hãy suy nghĩ từng bước' và cách chia nhỏ bài toán phức tạp cho LLM." },
      { title: "3. Tinh Chỉnh Tham Số Sinh: Temperature, Top-p & System Instructions", description: "Tác động của độ ngẫu nhiên xác suất lên văn bản hành chính so với văn bản sáng tạo." }
    ]
  },
  {
    id: "MOD-09",
    moduleNumber: 9,
    levelCode: "L0",
    title: "Chuyên Đề 0.9 • Bộ Công Cụ GenAI Hàng Ngày: ChatGPT, Claude 3.7 & Gemini 2.0 Flash",
    tag: "Công Cụ GenAI Hiện Đại",
    levelTag: "Level 0 • Foundation",
    bloomTaxonomy: "Apply",
    targetAudience: "Nhân viên văn phòng, Khởi nghiệp, Sinh viên",
    startingFor: "NONTECH",
    description: "So sánh thực chiến và khai thác tối đa ưu thế của các mô hình hàng đầu thế giới: Claude 3.7 (Lập luận sâu & Code), ChatGPT (Đa năng & GPTs), Gemini (Context Window 2 triệu token & Tích hợp Google Workspace).",
    assignment: {
      id: "LAB-009",
      asmNumber: 9,
      title: "Assignment 0.9: Thử Nghiệm Xử Lý File Báo Cáo 500 Trang Bằng Gemini 2.0 Long-Context",
      durationMinutes: 40,
      summary: "Tải tài liệu PDF dài vào Gemini 2.0 Flash để trích xuất chỉ số tài chính và đối chiếu tính chính xác với tìm kiếm thủ công.",
      deliverables: ["Bảng tổng hợp đối chiếu độ chính xác", "Prompt trích xuất dữ liệu chuẩn bảng"]
    },
    topics: [
      { title: "1. Bản Đồ Năng Lực LLM 2026: OpenAI vs Anthropic vs Google", description: "Khi nào nên dùng Claude, khi nào dùng ChatGPT và khi nào cần Gemini." },
      { title: "2. Khai Thác Sức Mạnh Long-Context: Đọc Sách, Hợp Đồng & Video", description: "Kỹ thuật đưa tài liệu 1 triệu token vào context và cách đặt câu hỏi tránh sót thông tin." },
      { title: "3. Tự Tạo Trợ Lý Riêng (Custom GPTs & Claude Projects)", description: "Nạp tài liệu tri thức nội bộ và cấu hình hướng dẫn chuyên biệt cho trợ lý cá nhân." }
    ]
  },
  {
    id: "MOD-010",
    moduleNumber: 10,
    levelCode: "L0",
    title: "Chuyên Đề 0.10 • Sáng Tạo Đa Phương Tiện: Midjourney v6, Stable Diffusion & ComfyUI",
    tag: "Visual & Multimedia AI",
    levelTag: "Level 0 • Foundation",
    bloomTaxonomy: "Create",
    targetAudience: "Designer, Content Creator, Marketer",
    startingFor: "NONTECH",
    description: "Tạo lập hình ảnh, banner quảng cáo, storyboard và video ngắn chất lượng studio bằng các công cụ sinh ảnh AI tiên tiến: Prompt sinh ảnh, ControlNet, LoRA hình ảnh và quy trình ComfyUI cơ bản.",
    assignment: {
      id: "LAB-010",
      asmNumber: 10,
      title: "Assignment 0.10: Thiết Kế Bộ Nhận Diện Chiến Dịch Ra Mắt Sản Phẩm Mới Bằng AI",
      durationMinutes: 60,
      summary: "Sử dụng Midjourney hoặc Stable Diffusion để tạo 3 ảnh banner, 1 logo concept và 1 nhân vật đại diện nhất quán về phong cách và màu sắc.",
      deliverables: ["Bộ 5 ảnh chất lượng cao 4K", "Tài liệu ghi lại prompt và seed đã dùng"]
    },
    topics: [
      { title: "1. Cấu Trúc Prompt Sinh Ảnh Nghệ Thuật: Ánh Sáng, Góc Máy & Ống Kính", description: "Bí quyết mô tả phong cách nghệ thuật, khẩu độ camera và ánh sáng điện ảnh." },
      { title: "2. Duy Trì Tính Nhất Quán Nhân Vật (Character Consistency)", description: "Kỹ thuật dùng Reference Image và Seed để giữ nguyên gương mặt nhân vật qua nhiều góc chụp." },
      { title: "3. Khái Niệm Về Quy Trình Node-Based ComfyUI", description: "Hiểu cách nối các node checkpoint, sampler, VAE và upscaler để sinh ảnh chất lượng cao." }
    ]
  },
  {
    id: "MOD-011",
    moduleNumber: 11,
    levelCode: "L0",
    title: "Chuyên Đề 0.11 • Claude Code & AI Coding Assistants (Cursor, Copilot) Cho Người Mới",
    tag: "AI Coding Assistant",
    levelTag: "Level 0 • Foundation",
    bloomTaxonomy: "Apply",
    targetAudience: "Non-tech muốn học code nhanh, Junior Developer",
    startingFor: "NONTECH",
    description: "Ứng dụng các trợ lý lập trình AI thế hệ mới: Sử dụng Claude Code trong terminal, Cursor IDE với tính năng Agent tự sửa code và GitHub Copilot để học lập trình nhanh gấp 10 lần.",
    assignment: {
      id: "LAB-011",
      asmNumber: 11,
      title: "Assignment 0.11: Dùng Claude Code / Cursor Xây Dựng Một Web App Mini Trong 30 Phút",
      durationMinutes: 45,
      summary: "Ra lệnh cho AI Agent dựng một ứng dụng đếm giờ Pomodoro bằng HTML/JS mà không cần tự tay viết từng dòng cú pháp.",
      deliverables: ["Mã nguồn ứng dụng Pomodoro hoàn chỉnh", "File README hướng dẫn chạy"]
    },
    topics: [
      { title: "1. Tư Duy Lập Trình Bằng Ngôn Ngữ Tự Nhiên (Vibe Coding)", description: "Cách diễn giải ý tưởng logic thành prompt kỹ thuật chính xác cho AI Agent." },
      { title: "2. Làm Chủ Cursor IDE: Phím Tắt, Composer & @Codebase Index", description: "Kỹ thuật đặt câu hỏi cho toàn bộ kho mã nguồn và yêu cầu AI tự sửa bug đa file." },
      { title: "3. Đọc Hiểu & Thẩm Định Code Do AI Sinh Ra", description: "Nguyên tắc bảo vệ an toàn, kiểm tra lỗ hổng bảo mật cơ bản trước khi chạy code của AI." }
    ]
  },
  {
    id: "MOD-012",
    moduleNumber: 12,
    levelCode: "L0",
    title: "Chuyên Đề 0.12 • Tự Động Hóa Công Việc Văn Phòng: Tích Hợp AI Vào Excel, Word & Gmail",
    tag: "Office Automation AI",
    levelTag: "Level 0 • Foundation",
    bloomTaxonomy: "Apply",
    targetAudience: "Dân văn phòng, Kế toán, Nhân sự, Quản lý",
    startingFor: "NONTECH",
    description: "Biến các công việc lặp đi lặp lại thành tự động: Tự động trích xuất bảng từ hóa đơn PDF vào Excel, dùng AI viết công thức phức tạp, tự động phân loại và tóm tắt email khách hàng.",
    assignment: {
      id: "LAB-012",
      asmNumber: 12,
      title: "Assignment 0.12: Tự Động Hóa Xử Lý Bảng Khảo Sát Khách Hàng 1,000 Dòng",
      durationMinutes: 45,
      summary: "Dùng hàm AI trong Google Sheets / Excel để phân loại cảm xúc (Tích cực / Tiêu cực) và trích xuất từ khóa chính từ tập dữ liệu ý kiến người dùng.",
      deliverables: ["Bảng tính đã gắn nhãn tự động", "Bản tóm tắt báo cáo tổng quan"]
    },
    topics: [
      { title: "1. Ứng Dụng AI Sinh Công Thức Excel & Google Sheets Phức Tạp", description: "Viết công thức VLOOKUP, INDEX/MATCH, Regex và Apps Script tự động bằng prompt." },
      { title: "2. Tự Động Hóa Trích Xuất Dữ Liệu Bán Cấu Trúc", description: "Chuyển đổi bảng biểu từ ảnh chụp và file scan PDF vào bảng tính trong nháy mắt." },
      { title: "3. Luồng Tự Động Soạn Email Phản Hồi Chăm Sóc Khách Hàng", description: "Thiết lập template trả lời cá nhân hóa theo từng nhóm khách hàng mục tiêu." }
    ]
  },

  // =========================================================================
  // TẦNG 1: SFIA LEVEL 1 (FOLLOW - THÊM 9 CHUYÊN ĐỀ KỸ THUẬT CƠ BẢN -> TỔNG 12)
  // =========================================================================
  {
    id: "MOD-104",
    moduleNumber: 104,
    levelCode: "L1",
    title: "Module 104 • Lập Trình Hướng Đối Tượng (OOP) Chuẩn Clean Code Trong Python",
    tag: "Python OOP & Clean Code",
    levelTag: "SFIA L1 • Follow",
    bloomTaxonomy: "Apply",
    targetAudience: "Software Dev, AI Engineer",
    startingFor: "TECHBASE",
    description: "Xây dựng tư duy kiến trúc hướng đối tượng cho các module AI: Class, Encapsulation, Inheritance, Dataclasses, Magic Methods (__repr__, __call__) và áp dụng các nguyên lý Clean Code nguyên bản.",
    assignment: {
      id: "LAB-104",
      asmNumber: 104,
      title: "Assignment 104: Xây Dựng Hệ Thống Đối Tượng LLMProvider Quản Lý Multi-Client",
      durationMinutes: 60,
      summary: "Tạo Abstract Base Class BaseLLMProvider và 2 lớp kế thừa OpenAIProvider, GeminiProvider tuân thủ nghiêm ngặt nguyên lý SOLID.",
      deliverables: ["File llm_providers.py hoàn chỉnh", "Bộ test case kiểm tra tính đa hình"]
    },
    topics: [
      { title: "1. Lớp Trừu Tượng (Abstract Base Classes) & Interface Trong Python", description: "Định nghĩa hợp đồng giao tiếp chuẩn cho các dịch vụ AI." },
      { title: "2. Python Dataclasses & Pydantic Cơ Bản", description: "Tối ưu hóa cấu trúc dữ liệu nhẹ và tự động hóa sinh phương thức." },
      { title: "3. Đóng Gói Xử Lý Ngoại Lệ (Custom Exceptions) Chuẩn Doanh Nghiệp", description: "Bắt và chuẩn hóa các lỗi RateLimit, Authentication từ API ngoài." }
    ]
  },
  {
    id: "MOD-105",
    moduleNumber: 105,
    levelCode: "L1",
    title: "Module 105 • Lập Trình Bất Đồng Bộ Asyncio & Threading Trong Xử Lý Streaming AI",
    tag: "Asyncio & Concurrency",
    levelTag: "SFIA L1 • Follow",
    bloomTaxonomy: "Apply",
    targetAudience: "Backend Developer, AI Application Dev",
    startingFor: "TECHBASE",
    description: "Bẻ khóa nút thắt cổ chai I/O khi tương tác với LLM: async/await, Event Loop, asyncio.gather, Task Pools, xử lý hàng đợi và kỹ thuật tiêu thụ stream token tốc độ cao.",
    assignment: {
      id: "LAB-105",
      asmNumber: 105,
      title: "Assignment 105: Xây Dựng Công Cụ Cào Dữ Liệu & Gọi 50 Request LLM Đồng Thời",
      durationMinutes: 50,
      summary: "Sử dụng httpx và asyncio để gửi đồng thời 50 câu hỏi phân tích dữ liệu, kiểm soát concurrency bằng asyncio.Semaphore.",
      deliverables: ["Script async_batch_processor.py", "Báo cáo tốc độ xử lý: Sync vs Async"]
    },
    topics: [
      { title: "1. Bản Chất Event Loop & Non-blocking I/O Trong Python", description: "Tại sao lập trình bất đồng bộ là bắt buộc đối với ứng dụng AI có độ trễ cao." },
      { title: "2. Async Generators & Xử Lý Server-Sent Events (SSE)", description: "Cách đọc và truyền tải luồng token từng chữ một từ OpenAI / Gemini về client." },
      { title: "3. Giới Hạn Tốc Độ (Rate Limiting) Với Semaphore & Token Bucket", description: "Ngăn chặn lỗi HTTP 429 Too Many Requests khi xử lý khối lượng lớn dữ liệu." }
    ]
  },
  {
    id: "MOD-106",
    moduleNumber: 106,
    levelCode: "L1",
    title: "Module 106 • Đại Số Tuyến Tính & Tính Toán Tensor Thực Chiến Cho AI",
    tag: "Math & Tensor Computing",
    levelTag: "SFIA L1 • Follow",
    bloomTaxonomy: "Understand",
    targetAudience: "Data Engineer, AI Engineer, Math Enthusiasts",
    startingFor: "AIBASE",
    description: "Giải mã ngôn ngữ toán học ẩn sau mô hình ngôn ngữ lớn: Vector, Ma trận, Phép nhân Dot Product, Cosine Similarity, Chiều không gian (Dimensions) và tính toán song song với NumPy.",
    assignment: {
      id: "LAB-106",
      asmNumber: 106,
      title: "Assignment 106: Tự Cài Đặt Hàm Cosine Similarity Bằng Phép Toán Ma Trận NumPy Thuần",
      durationMinutes: 45,
      summary: "Viết hàm tính khoảng cách giữa 1 vector truy vấn và ma trận 10,000 embeddings không dùng thư viện ngoài scikit-learn.",
      deliverables: ["File numpy_vector_math.py", "Benchmark thời gian thực thi"]
    },
    topics: [
      { title: "1. Biểu Diễn Văn Bản Dưới Dạng Vector Đa Chiều", description: "Không gian 1536 chiều của OpenAI text-embedding-3-small hoạt động như thế nào." },
      { title: "2. Phép Nhân Ma Trận & Tối Ưu Hóa Vectorization", description: "Loại bỏ vòng lặp for trong Python để tăng tốc độ tính toán x100 lần bằng SIMD." },
      { title: "3. Đo Lường Khoảng Cách Trong Không Gian: Cosine vs Euclidean vs Dot Product", description: "Chọn đúng metric tương thích với từng loại mô hình embedding." }
    ]
  },
  {
    id: "MOD-107",
    moduleNumber: 107,
    levelCode: "L1",
    title: "Module 107 • Linux Shell Scripting, Quản Trị Server & Docker Container Cơ Bản",
    tag: "Linux & Docker for AI",
    levelTag: "SFIA L1 • Follow",
    bloomTaxonomy: "Apply",
    targetAudience: "DevOps, Software Dev, MLOps",
    startingFor: "TECHBASE",
    description: "Làm chủ môi trường máy chủ Linux (Ubuntu) và đóng gói ứng dụng AI bằng Docker: Thao tác file, giám sát tài nguyên (top, htop, nvidia-smi), viết Dockerfile đa tầng và quản lý biến môi trường .env.",
    assignment: {
      id: "LAB-107",
      asmNumber: 107,
      title: "Assignment 107: Đóng Gói Ứng Dụng FastAPI AI Thành Docker Image Siêu Nhẹ (<150MB)",
      durationMinutes: 50,
      summary: "Viết multi-stage Dockerfile dựa trên nền python:3.11-slim, cấu hình non-root user và tối ưu cache layers.",
      deliverables: ["File Dockerfile & docker-compose.yml", "Lệnh kiểm tra docker run thành công"]
    },
    topics: [
      { title: "1. Các Lệnh Linux Cần Thiết Nhất Cho Kỹ Sư AI", description: "grep, sed, awk, curl, tmux, quản lý quyền chmod/chown và cron jobs." },
      { title: "2. Viết Dockerfile Chuẩn Production Cho Ứng Dụng AI", description: "Bí quyết giảm kích thước image từ 1GB xuống dưới 200MB và tăng tốc độ build." },
      { title: "3. Docker Compose Điều Phối Microservices", description: "Kết nối đồng thời container WebAPI, Vector DB Qdrant và Redis Cache." }
    ]
  },
  {
    id: "MOD-108",
    moduleNumber: 108,
    levelCode: "L1",
    title: "Module 108 • Thiết Kế & Kiểm Thử RESTful API Với FastAPI & Postman",
    tag: "REST API & FastAPI Basics",
    levelTag: "SFIA L1 • Follow",
    bloomTaxonomy: "Apply",
    targetAudience: "Backend Dev, AI Application",
    startingFor: "TECHBASE",
    description: "Xây dựng cổng giao tiếp API chuẩn quốc tế cho mô hình AI: Định nghĩa Request/Response DTO, cơ chế dependency injection, xử lý mã trạng thái HTTP (200, 400, 422, 500) và tài liệu Swagger tự động.",
    assignment: {
      id: "LAB-108",
      asmNumber: 108,
      title: "Assignment 108: Xây Dựng Bộ API Phân Tích Cảm Xúc Văn Bản Kèm Tài Liệu OpenAPI",
      durationMinutes: 45,
      summary: "Khởi tạo 3 endpoints: /health, /api/v1/analyze, /api/v1/batch-analyze có validate dữ liệu đầu vào nghiêm ngặt.",
      deliverables: ["File main.py và models.py", "File Postman Collection (.json) kiểm thử tự động"]
    },
    topics: [
      { title: "1. Cấu Trúc Một Dự Án FastAPI Chuẩn Clean Architecture", description: "Tách biệt router, service, schemas và core config." },
      { title: "2. Dependency Injection Trong FastAPI", description: "Quản lý kết nối Database, API Key và cấu hình dùng chung giữa các request." },
      { title: "3. Viết Test Tự Động Cho API Bằng TestClient", description: "Đảm bảo API không bị vỡ khi nâng cấp thư viện hoặc sửa logic nghiệp vụ." }
    ]
  },
  {
    id: "MOD-109",
    moduleNumber: 109,
    levelCode: "L1",
    title: "Module 109 • Kỹ Thuật Viết Unit Test, Pytest & CI/CD Pipeline Trên GitHub Actions",
    tag: "Testing & CI/CD for AI",
    levelTag: "SFIA L1 • Follow",
    bloomTaxonomy: "Apply",
    targetAudience: "QA Engineer, Software Dev",
    startingFor: "TECHBASE",
    description: "Đảm bảo độ ổn định cao nhất cho hệ thống AI: Triển khai Test-Driven Development (TDD), mock LLM API để tiết kiệm chi phí test và cấu hình quy trình GitHub Actions tự động kiểm tra code trước khi merge.",
    assignment: {
      id: "LAB-109",
      asmNumber: 109,
      title: "Assignment 109: Thiết Lập GitHub Actions Tự Động Chạy 20 Unit Tests Khi Có Pull Request",
      durationMinutes: 55,
      summary: "Viết file workflow .github/workflows/test.yml chạy pytest, flake8 linter và báo cáo độ phủ mã (Coverage > 80%).",
      deliverables: ["File cấu hình GitHub Actions yaml", "Bộ file test_*.py có mock external API"]
    },
    topics: [
      { title: "1. Nguyên Lý TDD: Red - Green - Refactor Trong Dự Án AI", description: "Viết test case trước khi viết logic để phát hiện lỗi sớm." },
      { title: "2. Kỹ Thuật Mocking Cuộc Gọi API Bên Ngoài Bằng unittest.mock", description: "Test luồng logic mà không tiêu tốn 1 xu chi phí token OpenAI." },
      { title: "3. Xây Dựng CI/CD Pipeline Tự Động Hóa Với GitHub Actions", description: "Ngăn chặn mã nguồn lỗi không vượt qua được bài test được deploy lên production." }
    ]
  },
  {
    id: "MOD-110",
    moduleNumber: 110,
    levelCode: "L1",
    title: "Module 110 • Kỹ Thuật Bảo Mật Ứng Dụng AI: Ngăn Chặn Jailbreak & Prompt Leaks",
    tag: "AI Security & Defense",
    levelTag: "SFIA L1 • Follow",
    bloomTaxonomy: "Apply",
    targetAudience: "Security Engineer, AI Engineer, QA",
    startingFor: "TECHBASE",
    description: "Bảo vệ hệ thống AI trước các cuộc tấn công mạng đặc thù: Direct & Indirect Prompt Injection, Jailbreak, rò rỉ System Prompt, trích xuất dữ liệu nhạy cảm và kỹ thuật khử trùng chuỗi (Input Sanitization).",
    assignment: {
      id: "LAB-110",
      asmNumber: 110,
      title: "Assignment 110: Xây Dựng Lớp Phòng Thủ Bắt 10 Kịch Bản Tấn Công Prompt Injection",
      durationMinutes: 50,
      summary: "Viết middleware kiểm tra chuỗi đầu vào bằng regex và mô hình phân loại nhỏ để từ chối các câu lệnh độc hại.",
      deliverables: ["File security_middleware.py", "Bộ 15 test-cases tấn công và phòng thủ"]
    },
    topics: [
      { title: "1. Các Hình Thức Tấn Công Phổ Biến Vào LLM (OWASP Top 10 for LLMs)", description: "Phân tích mã độc ẩn trong file PDF tải lên và các prompt đánh lừa nhập vai." },
      { title: "2. Kỹ Thuật Bảo Vệ System Prompt Chống Bị Đánh Cắp", description: "Nguyên tắc cấu trúc phân định quyền ưu tiên giữa System Instruction và User Input." },
      { title: "3. Triển Khai Bộ Lọc An Toàn Cho Đầu Vào & Đầu Ra", description: "Che giấu số thẻ ngân hàng, email, mật khẩu (PII Masking) trước khi gửi tới API bên thứ ba." }
    ]
  },

  // =========================================================================
  // TẦNG 2: SFIA LEVEL 2 (ASSIST - THÊM 12 CHUYÊN ĐỀ DỮ LIỆU & WEBAPI -> TỔNG 15)
  // =========================================================================
  {
    id: "MOD-204",
    moduleNumber: 204,
    levelCode: "L2",
    title: "Module 204 • Kiến Trúc Vector Database Toàn Diện: Qdrant vs Chroma vs Milvus",
    tag: "Vector DB Deep Dive",
    levelTag: "SFIA L2 • Assist",
    bloomTaxonomy: "Understand & Apply",
    targetAudience: "Data Engineer, Backend Developer",
    startingFor: "AIBASE",
    description: "So sánh chuyên sâu các hệ quản trị cơ sở dữ liệu vector hàng đầu: Kiến trúc lưu trữ trên đĩa vs bộ nhớ RAM, cơ chế phân tán, payload filtering và chọn đúng công cụ cho từng bài toán.",
    assignment: {
      id: "LAB-204",
      asmNumber: 204,
      title: "Assignment 204: Đánh Giá Tốc Độ Truy Vấn Giữa Qdrant và Chroma Trên 50,000 Vectors",
      durationMinutes: 60,
      summary: "Nạp tập dữ liệu embedding 50,000 dòng vào cả hai hệ thống, đo lường độ trễ (latency p95/p99) khi lọc theo metadata.",
      deliverables: ["Script benchmark_vectordb.py", "Báo cáo so sánh RAM và Latency"]
    },
    topics: [
      { title: "1. Bản Chất Lưu Trữ Vector: Dense vs Sparse Vectors", description: "Cách các vector triệu chiều được đánh chỉ mục và nén trong ổ cứng." },
      { title: "2. Lọc Theo Siêu Dữ Liệu (Payload Filtering) Trong Qdrant", description: "Kết hợp lọc theo điều kiện Boolean (ID khách hàng, ngày tháng) cùng lúc với tìm kiếm ngữ nghĩa." },
      { title: "3. Chiến Lược Scale-out & Backup Cơ Sở Dữ Liệu Vector", description: "Tạo snapshot dữ liệu định kỳ và triển khai cụm phân tán chịu lỗi." }
    ]
  },
  {
    id: "MOD-205",
    moduleNumber: 205,
    levelCode: "L2",
    title: "Module 205 • Mở Rộng PostgreSQL 16 Với PGVector & HNSW Indexing",
    tag: "PostgreSQL PGVector",
    levelTag: "SFIA L2 • Assist",
    bloomTaxonomy: "Apply",
    targetAudience: "Database Administrator, Backend Dev",
    startingFor: "TECHBASE",
    description: "Tận dụng cơ sở dữ liệu quan hệ có sẵn để làm Vector DB: Cài đặt extension pgvector trên PostgreSQL 16, tạo index HNSW & IVFFlat, viết câu lệnh SQL kết hợp bảng dữ liệu nghiệp vụ và vector.",
    assignment: {
      id: "LAB-205",
      asmNumber: 205,
      title: "Assignment 205: Tạo Bảng Sản Phẩm E-commerce Với Cột Embedding Tìm Kiếm Bằng SQL Thuần",
      durationMinutes: 50,
      summary: "Viết migration SQL tạo cột vector(1536), tạo index HNSW với tham số m=16, ef_construction=64 và truy vấn sản phẩm tương đồng.",
      deliverables: ["File migration_pgvector.sql", "File truy vấn mẫu tìm kiếm tương đồng"]
    },
    topics: [
      { title: "1. Tại Sao PGVector Đang Trở Thành Lựa Chọn Số 1 Cho Doanh Nghiệp", description: "Không cần dựng thêm hệ thống mới, đảm bảo tính toàn vẹn dữ liệu ACID và backup quen thuộc." },
      { title: "2. Tối Ưu Hóa Index HNSW Trong PostgreSQL 16", description: "Cân bằng giữa tốc độ đánh chỉ mục lúc nạp dữ liệu và tốc độ truy vấn thời gian thực." },
      { title: "3. Truy Vấn Kết Hợp (Hybrid Query) Giữa SQL WHERE & Khoảng Cách Vector", description: "Lọc sản phẩm còn hàng, giá dưới 1 triệu trước khi sắp xếp theo độ tương đồng ngữ nghĩa." }
    ]
  },
  {
    id: "MOD-206",
    moduleNumber: 206,
    levelCode: "L2",
    title: "Module 206 • Xây Dựng Ứng Dụng AI Với LangChain Expression Language (LCEL)",
    tag: "LangChain LCEL",
    levelTag: "SFIA L2 • Assist",
    bloomTaxonomy: "Apply",
    targetAudience: "Software Dev, AI Application",
    startingFor: "TECHBASE",
    description: "Làm chủ cú pháp đường ống dẫn dữ liệu hiện đại của LangChain: Toán tử pipe (|), RunnableParallel, RunnablePassthrough, xử lý fallback khi lỗi và tối ưu hóa streaming tự động.",
    assignment: {
      id: "LAB-206",
      asmNumber: 206,
      title: "Assignment 206: Xây Dựng Pipeline RAG Hoàn Chỉnh Bằng LCEL Dưới 20 Dòng Code",
      durationMinutes: 45,
      summary: "Kết hợp Retriever, ChatPromptTemplate, ChatOpenAI và StrOutputParser thành một chuỗi thực thi duy nhất.",
      deliverables: ["File lcel_rag_pipeline.py", "Script chạy thử nghiệm câu hỏi đáp"]
    },
    topics: [
      { title: "1. Tư Duy Hướng Luồng Dữ Liệu (Declarative Chain Composition)", description: "Tại sao LCEL thay thế toàn bộ các chain cũ của LangChain trước đây." },
      { title: "2. Xử Lý Bất Đồng Bộ & Batch Processing Tự Động Trong Runnable", description: "Tự động kích hoạt song song nhiều tác vụ với .batch() và .astream()." },
      { title: "3. Kỹ Thuật Fallback & Dự Phòng Lỗi API (Error Handling)", description: "Tự động chuyển sang mô hình Gemini hoặc Claude khi OpenAI gặp sự cố 503." }
    ]
  },
  {
    id: "MOD-208",
    moduleNumber: 208,
    levelCode: "L2",
    title: "Module 208 • Kỹ Thuật Structured Output Cưỡng Chế JSON Schema (Instructor / Guidance)",
    tag: "Structured Output Mastery",
    levelTag: "SFIA L2 • Assist",
    bloomTaxonomy: "Apply",
    targetAudience: "Backend Dev, AI Engineer",
    startingFor: "TECHBASE",
    description: "Triệt tiêu hoàn toàn lỗi vỡ định dạng khi kết nối AI với cơ sở dữ liệu: Dùng thư viện Instructor, Pydantic v2 validation, cơ chế retry tự động khi LLM sinh sai schema và OpenAI response_format.",
    assignment: {
      id: "LAB-208",
      asmNumber: 208,
      title: "Assignment 208: Trích Xuất Thông Tin Hồ Sơ Bệnh Án Thành Đối Tượng Pydantic Nghiêm Ngặt",
      durationMinutes: 50,
      summary: "Định nghĩa model MedicalRecord với các trường ngày tháng, danh sách thuốc kèm liều lượng, tự động retry nếu mô hình bỏ sót trường bắt buộc.",
      deliverables: ["File medical_parser.py", "Bộ dữ liệu mẫu kiểm thử 5 ca lâm sàng"]
    },
    topics: [
      { title: "1. Cơ Chế Hoạt Động Của JSON Mode & Function Calling Trả Về Schema", description: "Cách mô hình ngôn ngữ bị cưỡng chế token đầu ra theo ngữ pháp BNF (Grammar-guided decoding)." },
      { title: "2. Sử Dụng Thư Viện Instructor Nâng Cao", description: "Tự động đưa thông điệp lỗi của Pydantic ngược lại cho LLM để mô hình tự sửa sai (Self-healing code)." },
      { title: "3. Kiểm Soát Kiểu Dữ Liệu Phức Tạp: Enum, Nested Lists & Regex Fields", description: "Đảm bảo số điện thoại, mã số thuế luôn đúng định dạng trước khi lưu vào database." }
    ]
  },
  {
    id: "MOD-209",
    moduleNumber: 209,
    levelCode: "L2",
    title: "Module 209 • Redis Caching Chiến Lược: Semantic Cache & Rate Limiting Cho LLM",
    tag: "Redis Semantic Cache",
    levelTag: "SFIA L2 • Assist",
    bloomTaxonomy: "Apply",
    targetAudience: "Backend Dev, Performance Engineer",
    startingFor: "TECHBASE",
    description: "Giảm 70% chi phí API và hạ độ trễ từ 3s xuống 20ms: Xây dựng bộ nhớ đệm ngữ nghĩa (Semantic Cache) bằng Redis, nhận diện các câu hỏi có cùng ý nghĩa để trả về kết quả đã cache mà không cần gọi lại LLM.",
    assignment: {
      id: "LAB-209",
      asmNumber: 209,
      title: "Assignment 209: Thiết Lập Hệ Thống Semantic Cache Bằng Redis Giảm 80% Chi Phí Hỏi Đáp",
      durationMinutes: 50,
      summary: "Cấu hình Redis Vector Similarity Search để bắt các câu hỏi đồng nghĩa như 'Cách đổi mật khẩu' và 'Làm sao để reset pass'.",
      deliverables: ["File redis_semantic_cache.py", "Báo cáo so sánh chi phí và độ trễ response"]
    },
    topics: [
      { title: "1. Khái Niệm Semantic Cache Khác Gì Cache Truyền Thống", description: "So sánh tra cứu chính xác bằng Key-Value với tra cứu khoảng cách ngữ nghĩa trong cache." },
      { title: "2. Cấu Hình Ngưỡng Tương Đồng (Threshold Tuning)", description: "Cách chọn ngưỡng khoảng cách (ví dụ Cosine > 0.92) để không trả lời nhầm câu hỏi khác ý." },
      { title: "3. Triển Khai Bộ Đếm Giới Hạn Tốc Độ (Rate Limiting) Bằng Redis Token Bucket", description: "Bảo vệ hệ thống trước hành vi spam request của người dùng xấu." }
    ]
  },

  // =========================================================================
  // TẦNG 3: SFIA LEVEL 3 (APPLY - THÊM 12 CHUYÊN ĐỀ RAG & FINE-TUNING -> TỔNG 15)
  // =========================================================================
  {
    id: "MOD-304",
    moduleNumber: 304,
    levelCode: "L3",
    title: "Module 304 • Cohere Reranking & Cross-Encoder Models Triệt Tiêu Ảo Giác RAG",
    tag: "Reranking & Cross-Encoder",
    levelTag: "SFIA L3 • Apply",
    bloomTaxonomy: "Apply & Evaluate",
    targetAudience: "Enterprise RAG Engineer, AI Scientist",
    startingFor: "TECHBASE",
    description: "Nâng cao độ chính xác truy hồi RAG từ 60% lên trên 90%: Ứng dụng mô hình Cross-Encoder để chấm điểm lại mức độ phù hợp giữa câu hỏi và đoạn văn bản, lọc bỏ nhiễu trước khi đưa vào ngữ cảnh LLM.",
    assignment: {
      id: "LAB-304",
      asmNumber: 304,
      title: "Assignment 304: Tích Hợp Lớp Reranker Vào Hệ Thống Tìm Kiếm Pháp Lý Doanh Nghiệp",
      durationMinutes: 60,
      summary: "Lấy Top-20 kết quả từ Vector Search, chạy qua Cohere Rerank API để chọn ra Top-3 đoạn văn bản chính xác nhất.",
      deliverables: ["File rerank_pipeline.py", "Bảng so sánh độ chuẩn xác trước và sau khi Rerank"]
    },
    topics: [
      { title: "1. Giới Hạn Của Bi-Encoder (Dense Embeddings) Trong Tìm Kiếm Ngữ Nghĩa", description: "Tại sao Bi-Encoder mất mát chi tiết tương tác ngữ nghĩa giữa câu hỏi và tài liệu." },
      { title: "2. Nguyên Lý Hoạt Động Của Cross-Encoder Reranker", description: "Cho câu hỏi và văn bản tương tác trực tiếp qua các tầng Attention để chấm điểm độ tương quan tuyệt đối." },
      { title: "3. Tối Ưu Chi Phí & Độ Trễ Khi Rerank: Local BGE-Reranker vs Cloud Cohere", description: "Khi nào nên chạy mô hình nhỏ on-premise và khi nào nên gọi API dịch vụ ngoài." }
    ]
  },
  {
    id: "MOD-305",
    moduleNumber: 305,
    levelCode: "L3",
    title: "Module 305 • Kiến Trúc Self-RAG & Corrective RAG (CRAG) Tự Kiểm Soát Chất Lượng",
    tag: "Self-RAG & Corrective RAG",
    levelTag: "SFIA L3 • Apply",
    bloomTaxonomy: "Analyze & Evaluate",
    targetAudience: "Senior AI Engineer, System Architect",
    startingFor: "TECHBASE",
    description: "Xây dựng hệ thống RAG thông minh có khả năng tự đánh giá và sửa sai: Nếu tài liệu truy xuất không đủ liên quan, hệ thống tự động tìm kiếm trên web; nếu câu trả lời bị ảo giác, hệ thống tự sinh lại.",
    assignment: {
      id: "LAB-305",
      asmNumber: 305,
      title: "Assignment 305: Triển Khai Luồng Corrective RAG (CRAG) Bằng Đồ Thị Trạng Thái",
      durationMinutes: 75,
      summary: "Xây dựng bộ chấm điểm tài liệu (Document Relevance Grader). Nếu điểm < 0.7, chuyển hướng truy vấn sang Tavily Web Search.",
      deliverables: ["File crag_workflow.py", "Log mô phỏng các ca tự sửa sai thành công"]
    },
    topics: [
      { title: "1. Vấn Đề Của RAG Truyền Thống (Naive RAG)", description: "Khi tài liệu truy xuất chứa thông tin sai lệch hoặc không liên quan dẫn đến ảo giác không thể tránh khỏi." },
      { title: "2. Kỹ Thuật Đánh Giá Tài Liệu Tự Động (Retrieval Evaluator)", description: "Sử dụng LLM nhỏ tốc độ cao làm nhiệm vụ chấm điểm chất lượng ngữ cảnh được nạp." },
      { title: "3. Luồng Sửa Lỗi Tự Động: Web Search Fallback & Query Rewriting", description: "Kỹ thuật viết lại câu hỏi rõ nghĩa hơn trước khi thực hiện tìm kiếm lại." }
    ]
  },
  {
    id: "MOD-307",
    moduleNumber: 307,
    levelCode: "L3",
    title: "Module 307 • Tinh Chỉnh Mô Hình Mã Nguồn Mở Tốc Độ Cao Với Unsloth & Llama-3",
    tag: "Unsloth Fast Fine-Tuning",
    levelTag: "SFIA L3 • Apply",
    bloomTaxonomy: "Apply & Create",
    targetAudience: "MLOps, AI Engineer",
    startingFor: "AIBASE",
    description: "Huấn luyện tinh chỉnh mô hình ngôn ngữ lớn nhanh hơn gấp 5 lần và tiết kiệm 80% VRAM: Tận dụng nhân tính toán tùy biến của Unsloth để fine-tune Llama-3 8B trên GPU Google Colab T4 miễn phí.",
    assignment: {
      id: "LAB-307",
      asmNumber: 307,
      title: "Assignment 307: Fine-Tune Mô Hình Llama-3 8B Chuyên Phân Tích Văn Bản Pháp Luật",
      durationMinutes: 90,
      summary: "Chuẩn bị dataset 1,000 cặp câu hỏi-đáp pháp lý, cấu hình LoRA rank r=16, alpha=16 và xuất mô hình sang định dạng GGUF.",
      deliverables: ["File fine_tuning_unsloth.py", "Biểu đồ giảm hàm mất mát (Training Loss Curve)"]
    },
    topics: [
      { title: "1. Đột Phá Kỹ Thuật Của Thư Viện Unsloth Trong Tối Ưu GPU", description: "Viết lại Triton kernels để loại bỏ tính toán thừa và giảm phân mảnh bộ nhớ VRAM." },
      { title: "2. Cấu Trúc Dữ Liệu Huấn Luyện Chuẩn Định Dạng ChatML / ShareGPT", description: "Chuẩn bị tập dữ liệu hội thoại nhiều lượt có cấu trúc role: system, user, assistant." },
      { title: "3. Xuất Và Lượng Tử Hóa Mô Hình Sang Định Dạng GGUF / Ollama", description: "Chuyển đổi trọng số sau khi huấn luyện để chạy mượt mà trên laptop cá nhân." }
    ]
  },
  {
    id: "MOD-309",
    moduleNumber: 309,
    levelCode: "L3",
    title: "Module 309 • Tổng Hợp & Làm Sạch Dataset Huấn Luyện AI (Synthetic Data Generation)",
    tag: "Synthetic Data & Curation",
    levelTag: "SFIA L3 • Apply",
    bloomTaxonomy: "Analyze & Create",
    targetAudience: "Data Scientist, AI Engineer",
    startingFor: "AIBASE",
    description: "Giải quyết bài toán thiếu hụt dữ liệu doanh nghiệp: Dùng mô hình mạnh (Claude 3.7 / GPT-4o) để tự sinh dữ liệu huấn luyện nhân tạo (Synthetic Data), loại bỏ dữ liệu trùng lặp bằng MinHash và lọc chất lượng.",
    assignment: {
      id: "LAB-309",
      asmNumber: 309,
      title: "Assignment 309: Tự Động Sinh 5,000 Cặp Dữ Liệu Hỏi Đáp Y Tế Đạt Chuẩn Y Khoa",
      durationMinutes: 70,
      summary: "Xây dựng pipeline sinh dữ liệu theo phương pháp Evol-Instruct (tăng độ phức tạp của câu hỏi), lọc bỏ dữ liệu kém chất lượng.",
      deliverables: ["File synthetic_data_generator.py", "Dataset mẫu 500 dòng sạch dạng jsonl"]
    },
    topics: [
      { title: "1. Kỹ Thuật Evol-Instruct: Tiến Hóa Câu Hỏi Từ Dễ Đến Khó", description: "Thêm ràng buộc, bối cảnh phức tạp và lập luận logic vào câu hỏi gốc." },
      { title: "2. Khử Trùng Lặp Dữ Liệu Bằng MinHash & LSH (Locality-Sensitive Hashing)", description: "Xóa bỏ các văn bản tương tự nhau đến 90% để tránh overfitting khi huấn luyện." },
      { title: "3. Bộ Lọc Chất Lượng Dữ Liệu Tự Động (Data Quality Filtering)", description: "Dùng LLM chấm điểm độ hữu ích, ngữ pháp và tính an toàn của dữ liệu đã sinh." }
    ]
  },
  {
    id: "MOD-310",
    moduleNumber: 310,
    levelCode: "L3",
    title: "Module 310 • Đánh Giá Chất Lượng LLM Tự Động Bằng Kỹ Thuật LLM-as-a-Judge",
    tag: "LLM-as-a-Judge Evaluation",
    levelTag: "SFIA L3 • Apply",
    bloomTaxonomy: "Evaluate",
    targetAudience: "QA Lead, AI Product Manager, AI Engineer",
    startingFor: "TECHBASE",
    description: "Chuẩn hóa quy trình đo lường năng lực mô hình thay cho đánh giá thủ công: Sử dụng mô hình trọng tài (Judge LLM) kèm barem chấm điểm chi tiết, khắc phục hiện tượng thiên kiến vị trí (Position Bias) và độ dài.",
    assignment: {
      id: "LAB-310",
      asmNumber: 310,
      title: "Assignment 310: Xây Dựng Khung Chấm Điểm A/B Testing Tự Động Giữa 2 Mô Hình AI",
      durationMinutes: 60,
      summary: "So sánh câu trả lời của GPT-4o-mini và Llama-3-8B trên 100 câu hỏi, dùng Claude 3.7 làm trọng tài chấm theo thang điểm 1-5 kèm giải thích.",
      deliverables: ["File llm_judge_evaluator.py", "Báo cáo thống kê Win/Tie/Loss tỷ lệ"]
    },
    topics: [
      { title: "1. Phương Pháp Luận Chấm Điểm LLM-as-a-Judge Chuẩn Quốc Tế", description: "Barem tiêu chí đánh giá: Tính chính xác, Mức độ đầy đủ, Giọng điệu và An toàn." },
      { title: "2. Khắc Phục Các Thiên Kiến Của Mô Hình Trọng Tài", description: "Hoán đổi vị trí câu trả lời (A vs B) để loại bỏ thiên kiến ưu tiên câu trả lời xuất hiện trước." },
      { title: "3. Đo Lường Mức Độ Đồng Thuận Giữa Trọng Tài AI Và Chuyên Gia Con Người", description: "Tính toán hệ số tương quan Cohen's Kappa để hiệu chỉnh barem chấm điểm." }
    ]
  },

  // =========================================================================
  // TẦNG 4: SFIA LEVEL 4 (ENABLE - THÊM 12 CHUYÊN ĐỀ MULTI-AGENT & INFRA -> TỔNG 15)
  // =========================================================================
  {
    id: "MOD-404",
    moduleNumber: 404,
    levelCode: "L4",
    title: "Module 404 • Multi-Agent Swarm Orchestration: So Sánh LangGraph vs CrewAI vs AutoGen",
    tag: "Multi-Agent Frameworks",
    levelTag: "SFIA L4 • Enable",
    bloomTaxonomy: "Evaluate & Create",
    targetAudience: "AI Architect, Principal Engineer",
    startingFor: "TECHBASE",
    description: "Đánh giá và triển khai các kiến trúc đa tác nhân tiên tiến nhất: Mô hình bầy đàn (Swarm), kiến trúc phân cấp (Hierarchical Teams) và chọn đúng framework phù hợp với yêu cầu doanh nghiệp.",
    assignment: {
      id: "LAB-404",
      asmNumber: 404,
      title: "Assignment 404: Xây Dựng Tòa Soạn Báo Đa Tác Nhân Tự Động Viết & Phê Duyệt Bài Viết",
      durationMinutes: 90,
      summary: "Tạo 3 agents: Researcher (Thu thập tài liệu), Writer (Soạn bài), Editor (Biên tập & Phê duyệt) phối hợp tự động ra quyết định xuất bản.",
      deliverables: ["Mã nguồn hoàn chỉnh hệ thống đa tác nhân", "Sơ đồ kiến trúc luồng trao đổi giữa các agents"]
    },
    topics: [
      { title: "1. So Sánh Kiến Trúc: State Graph (LangGraph) vs Role-Playing (CrewAI)", description: "Khi nào cần kiểm soát luồng chặt chẽ và khi nào nên để các agent tự do đàm phán." },
      { title: "2. Cơ Chế Giao Tiếp Giữa Các Agent (Inter-Agent Communication Protocols)", description: "Truyền tải thông điệp, chia sẻ bộ nhớ chung và xử lý xung đột quyết định giữa các agent." },
      { title: "3. Kiểm Soát Chi Phí & Vòng Lặp Vô Tận Trong Hệ Thống Multi-Agent", description: "Thiết lập giới hạn số lượt trao đổi (Max Recursion Limit) và cơ chế ngắt mạch an toàn." }
    ]
  },
  {
    id: "MOD-405",
    moduleNumber: 405,
    levelCode: "L4",
    title: "Module 405 • Cơ Chế Human-in-the-Loop & Quy Trình Phê Duyệt Tác Vụ Rủi Ro Cao",
    tag: "Human-in-the-Loop AI",
    levelTag: "SFIA L4 • Enable",
    bloomTaxonomy: "Evaluate & Apply",
    targetAudience: "AI Product Director, Compliance Lead",
    startingFor: "TECHBASE",
    description: "Thiết lập ranh giới an toàn cho hệ thống tự hành: Tạm dừng trạng thái đồ thị (Interrupt Graph Execution), gửi yêu cầu phê duyệt cho chuyên viên con người qua Webhook/Slack và tiếp tục thực thi sau khi được duyệt.",
    assignment: {
      id: "LAB-405",
      asmNumber: 405,
      title: "Assignment 405: Triển Khai Luồng Thanh Toán Tự Động Kèm Bước Phê Duyệt Của Kế Toán",
      durationMinutes: 75,
      summary: "Agent tự động soạn lệnh chuyển khoản nhưng bắt buộc tạm dừng tại bước duyệt nếu giá trị thanh toán vượt quá 10,000,000 VNĐ.",
      deliverables: ["File langgraph_human_in_the_loop.py", "Test case mô phỏng người dùng bấm Phê duyệt / Từ chối"]
    },
    topics: [
      { title: "1. Tại Sao Human-in-the-Loop Là Điều Kiện Bắt Buộc Của AI Doanh Nghiệp", description: "Tuân thủ trách nhiệm pháp lý và giảm thiểu rủi ro hành động sai sót không thể đảo ngược." },
      { title: "2. Kỹ Thuật Checkpointing & Time-Travel Debugging Trong LangGraph", description: "Quay ngược lại trạng thái quá khứ để sửa đổi quyết định của AI và cho chạy lại nhánh mới." },
      { title: "3. Tích Hợp UI Phê Duyệt Đa Kênh: Slack, Telegram & Web Dashboard", description: "Gửi thông báo kèm nút bấm Duyệt / Hủy trực tiếp tới điện thoại của người quản lý." }
    ]
  },
  {
    id: "MOD-406",
    moduleNumber: 406,
    levelCode: "L4",
    title: "Module 406 • Phục Vụ Suy Luận AI Quy Mô Lớn Với NVIDIA Triton Inference Server",
    tag: "NVIDIA Triton Server",
    levelTag: "SFIA L4 • Enable",
    bloomTaxonomy: "Apply & Evaluate",
    targetAudience: "MLOps Engineer, Infrastructure Architect",
    startingFor: "AIBASE",
    description: "Triển khai hệ thống phục vụ mô hình AI chuẩn công nghiệp: Hỗ trợ đa framework (PyTorch, ONNX, TensorRT), dynamic batching, concurrent model execution trên nhiều GPU NVIDIA đồng thời.",
    assignment: {
      id: "LAB-406",
      asmNumber: 406,
      title: "Assignment 406: Triển Khai Cụm Triton Server Phục Vụ Mô Hình Embedding BGE-M3",
      durationMinutes: 90,
      summary: "Cấu hình model repository, config.pbtxt với max_batch_size=64 và gửi request qua giao thức gRPC tốc độ cao.",
      deliverables: ["Thư mục cấu hình model repository", "Script client gửi truy vấn gRPC đa luồng"]
    },
    topics: [
      { title: "1. Kiến Trúc Của NVIDIA Triton Inference Server", description: "Tối ưu hóa chia sẻ tài nguyên GPU và điều phối hàng đợi yêu cầu cấp độ phần cứng." },
      { title: "2. Tối Ưu Hóa Giao Thức Truyền Tải: gRPC vs HTTP REST", description: "Giảm độ trễ tuần tự hóa dữ liệu từ 20ms xuống dưới 2ms cho ứng dụng thời gian thực." },
      { title: "3. Giám Sát Hiệu Năng GPU Qua Prometheus & Grafana Metrics", description: "Theo dõi tỷ lệ sử dụng GPU, nhiệt độ, thông lượng request và độ trễ hàng đợi." }
    ]
  },
  {
    id: "MOD-408",
    moduleNumber: 408,
    levelCode: "L4",
    title: "Module 408 • Thiết Lập Tường Lửa Ngăn Chặn Rủi Ro AI: Guardrails AI & NeMo Guardrails",
    tag: "AI Guardrails & Safety",
    levelTag: "SFIA L4 • Enable",
    bloomTaxonomy: "Create & Evaluate",
    targetAudience: "Security Architect, Enterprise AI Lead",
    startingFor: "TECHBASE",
    description: "Xây dựng hệ thống tường lửa lập trình được cho AI: Chống lạc đề (Topic Moderation), kiểm tra tính xác thực (Fact Checking) và đảm bảo bot chăm sóc khách hàng không bao giờ nói xấu sản phẩm của công ty.",
    assignment: {
      id: "LAB-408",
      asmNumber: 408,
      title: "Assignment 408: Cấu Hình NeMo Guardrails Ngăn Chặn 100% Câu Hỏi Về Đối Thủ Cạnh Tranh",
      durationMinutes: 70,
      summary: "Viết kịch bản Colang định nghĩa luồng đối thoại chuẩn, tự động từ chối lịch sự khi khách hàng hỏi so sánh với đối thủ.",
      deliverables: ["File cấu hình rails.co và config.yml", "Bộ test case kiểm tra độ bền vững của tường lửa"]
    },
    topics: [
      { title: "1. Khái Niệm Programmable Guardrails Trong Kỷ Nguyên GenAI", description: "Kiểm soát hành vi của mô hình bằng các quy tắc logic cứng kết hợp đánh giá ngữ nghĩa mềm." },
      { title: "2. Cú Pháp Kịch Bản Colang Trong NeMo Guardrails", description: "Định nghĩa ý định người dùng (User Intents) và kịch bản phản hồi bắt buộc của hệ thống." },
      { title: "3. Kiểm Soát Đầu Ra Thời Gian Thực (Output Interception)", description: "Quét và chỉnh sửa câu trả lời của mô hình trước khi hiển thị lên màn hình người dùng." }
    ]
  },
  {
    id: "MOD-415",
    moduleNumber: 415,
    levelCode: "L4",
    title: "Module 415 • Capstone Graduation Lab: Xây Dựng Nền Tảng AI Doanh Nghiệp Toàn Trình (End-to-End)",
    tag: "Capstone Project",
    levelTag: "SFIA L4 • Enable",
    bloomTaxonomy: "Create",
    targetAudience: "Tốt Nghiệp Kỹ Sư AI Thực Chiến, AI Architect",
    startingFor: "TECHBASE",
    description: "Đồ án tốt nghiệp thực chiến chuẩn SFIA Level 4: Tự thiết kế và triển khai một hệ sinh thái AI doanh nghiệp hoàn chỉnh kết hợp WebAPI C#/.NET, Vector DB Qdrant, Enterprise RAG, Multi-Agent LangGraph và vLLM Serving.",
    assignment: {
      id: "LAB-415",
      asmNumber: 415,
      title: "Capstone Project 415: Hệ Thống AI Độc Bản Giải Quyết Bài Toán Doanh Nghiệp Thực Tế",
      durationMinutes: 180,
      summary: "Hoàn thiện toàn bộ mã nguồn, cấu hình Docker Compose, kịch bản kiểm thử tự động và tài liệu kiến trúc hệ thống chuẩn C4 Model.",
      deliverables: [
        "Repository GitHub chứa mã nguồn hoàn chỉnh có unit test",
        "Tài liệu kiến trúc C4 Model (Context, Container, Component)",
        "Video demo sản phẩm vận hành thực tế kèm báo cáo đo lường ROI"
      ]
    },
    topics: [
      { title: "1. Tổng Hợp Toàn Bộ Khung Kiến Thức Kỹ Thuật SFIA L1 Đến L4", description: "Kết nối các mắt xích: Từ Tokenizer đến Multi-Agent và Distributed Serving." },
      { title: "2. Tiêu Chí Nghiệm Thu & Bảo Chứng Năng Lực Quốc Tế SFIA", description: "Các tiêu chuẩn thẩm định của hội đồng chuyên gia để cấp chứng nhận kỹ sư AI thực chiến." },
      { title: "3. Lộ Trình Phát Triển Sự Nghiệp: Từ Junior Lên Principal AI Engineer", description: "Chiến lược xây dựng portfolio, văn hóa mã nguồn mở và đóng góp cho cộng đồng." }
    ]
  }
];
