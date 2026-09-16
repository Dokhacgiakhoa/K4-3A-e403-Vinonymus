import type { 
  BackgroundType, 
  AdaptiveQuestion, 
  AdaptiveAnswer, 
  PersonalizedRoadmap, 
  RoadmapMilestone,
  UserProfileInput
} from '@/types/roadmap';

/**
 * Sinh bộ câu hỏi cá nhân hóa thích ứng dựa trên Background, Goal và Profile CV
 */
export function generateAdaptiveQuestions(
  background: BackgroundType, 
  goalId: string, 
  weeklyHours: number,
  userProfile?: UserProfileInput
): AdaptiveQuestion[] {
  if (background === 'software_dev') {
    return [
      {
        id: 'tech_stack',
        question: 'Bạn đã có kinh nghiệm vững nhất và muốn dùng Tech Stack nào làm trọng tâm?',
        contextNote: 'AI Mentor sẽ điều chỉnh toàn bộ code mẫu và bài tập Lab theo hệ sinh thái bạn chọn.',
        options: [
          {
            id: 'python_fastapi',
            label: 'Python (FastAPI, PyTorch, LangGraph)',
            description: 'Chuẩn ngành AI thế giới, tối ưu cho RAG, Fine-tuning và Agentic workflow.',
            tag: 'Khuyên Dùng Cho AI'
          },
          {
            id: 'ts_nextjs',
            label: 'TypeScript / JavaScript (Next.js 15, Vercel AI SDK)',
            description: 'Tối ưu cho Fullstack AI Engineer, xây dựng giao diện AI Chat & SaaS hoàn chỉnh.',
            tag: 'Tối Ưu Fullstack'
          },
          {
            id: 'csharp_dotnet',
            label: 'C# .NET 10 (Semantic Kernel, Clean Architecture)',
            description: 'Phù hợp cho hệ thống Doanh nghiệp lớn (Enterprise Core), Microservices & VietQR.',
            tag: 'Chuẩn Doanh Nghiệp'
          },
          {
            id: 'go_rust',
            label: 'Go / Rust (High-Concurrency Backend)',
            description: 'Tối ưu cho hệ thống Gateway, Token Metering & High-Throughput streaming.',
            tag: 'Hiệu Năng Cực Cao'
          }
        ],
        customPlaceholder: 'Hoặc nhập framework / ngôn ngữ khác bạn muốn sử dụng...'
      },
      {
        id: 'ai_architecture',
        question: 'Kiến trúc giải pháp AI nào bạn muốn làm chủ sâu sắc nhất?',
        contextNote: 'Xác định trọng tâm kiến trúc của đồ án tốt nghiệp Capstone.',
        options: [
          {
            id: 'hybrid_rag',
            label: 'Enterprise Hybrid RAG (Dense + Sparse Search RRF)',
            description: 'Xử lý tài liệu doanh nghiệp hàng triệu trang với Qdrant và pgvector.',
            tag: 'Top 1 Nhu Cầu Tuyển Dụng'
          },
          {
            id: 'multi_agent',
            label: 'Autonomous Multi-Agent System (LangGraph & Tool Calling)',
            description: 'Hệ thống nhiều tác nhân tự phân công nhiệm vụ, tự sửa lỗi và điều phối quy trình.',
            tag: 'Xu Hướng Công Nghệ 2026'
          },
          {
            id: 'voice_conversational',
            label: 'Realtime Voice & Multimodal Conversational Agent',
            description: 'Agent đàm thoại giọng nói hai chiều siêu tốc (LiveKit, WebRTC, TTS/STT).',
            tag: 'Trải Nghiệm Tương Tác'
          },
          {
            id: 'fine_tuning_lora',
            label: 'Fine-Tuning LoRA / QLoRA & Local Model Deployment (vLLM)',
            description: 'Tự train và host mô hình DeepSeek/Llama riêng trên hạ tầng GPU Cloud.',
            tag: 'Chuyên Sâu Hạ Tầng'
          }
        ],
        customPlaceholder: 'Hoặc mô tả bài toán / tính năng AI cụ thể bạn muốn xây dựng...'
      },
      {
        id: 'infra_preference',
        question: 'Bạn định hướng triển khai hạ tầng mô hình theo phương án nào?',
        contextNote: 'Cân bằng giữa chi phí API, độ trễ và tính bảo mật dữ liệu NDA.',
        options: [
          {
            id: 'commercial_api',
            label: 'Cloud Commercial APIs (OpenAI, Claude 3.7 Sonnet, Gemini 2.0)',
            description: 'Triển khai nhanh, chất lượng suy luận cao nhất, không cần quản lý GPU.',
            tag: 'Bắt Đầu Nhanh'
          },
          {
            id: 'self_hosted_gpu',
            label: 'Self-Hosted Open Source (vLLM, Ollama, DeepSeek-R1 / Llama 3.3)',
            description: 'Bảo mật 100% dữ liệu nội bộ, tối ưu chi phí vận hành lâu dài trên RunPod/Lambda.',
            tag: 'Tối Ưu Bảo Mật NDA'
          },
          {
            id: 'hybrid_model',
            label: 'Mô Hình Hỗn Hợp (Hybrid Routing)',
            description: 'Tác vụ đơn giản dùng Small Local Model, tác vụ phức tạp route sang LLM cao cấp.',
            tag: 'Kiến Trúc Tối Ưu Chi Phí'
          }
        ]
      }
    ];
  }

  if (background === 'non_tech') {
    return [
      {
        id: 'daily_workflow',
        question: 'Đâu là loại dữ liệu và nghiệp vụ bạn xử lý nhiều nhất trong công việc?',
        contextNote: 'Lộ trình sẽ tập trung giải quyết đúng bài toán đau đầu nhất của bạn.',
        options: [
          {
            id: 'excel_data',
            label: 'Bảng tính Excel, Google Sheets & Báo Cáo Số Liệu',
            description: 'Tự động hóa đối soát số liệu, vẽ biểu đồ và phân tích xu hướng kinh doanh.',
            tag: 'Dành Cho BA / Kế Toán'
          },
          {
            id: 'pdf_contracts',
            label: 'Tài Liệu PDF, Hợp Đồng & Văn Bản Quy Trình Pháp Lý',
            description: 'Trích xuất điều khoản, so sánh hợp đồng và tra cứu quy định nội bộ tức thì.',
            tag: 'Dành Cho Legal / HR / PM'
          },
          {
            id: 'crm_cs_messages',
            label: 'Tin Nhắn Khách Hàng, Email & Kịch Bản Bán Hàng (CRM)',
            description: 'Tự động phản hồi thông minh, phân loại cảm xúc khách hàng và soạn email chuẩn mực.',
            tag: 'Dành Cho Sales / Marketing'
          },
          {
            id: 'prd_product_specs',
            label: 'Xây Dựng Ý Tưởng Sản Phẩm, Viết PRD & Quản Lý Dự Án AI',
            description: 'Định nghĩa tính năng AI cho ứng dụng di động / web, đo lường ROI và rủi ro.',
            tag: 'Dành Cho Product Manager'
          }
        ],
        customPlaceholder: 'Mô tả ngắn công việc hàng ngày bạn muốn AI làm thay...'
      },
      {
        id: 'learning_approach',
        question: 'Mức độ can thiệp kỹ thuật bạn mong muốn trong lộ trình này?',
        contextNote: 'Giúp AI Mentor phân bổ tỷ lệ giữa thực hành no-code và lập trình cơ bản.',
        options: [
          {
            id: 'no_code_first',
            label: 'Ưu tiên 100% No-Code & Kéo Thả (Make, N8N, Dify, Coze)',
            description: 'Xây dựng quy trình tự động hóa hoàn chỉnh mà không cần viết dù chỉ 1 dòng code.',
            tag: 'Nhanh & Thực Chiến'
          },
          {
            id: 'code_curious',
            label: 'Sẵn sàng học Python cơ bản để hiểu sâu và tự sửa script',
            description: 'Nắm cú pháp Python cốt lõi để tự tin giao tiếp và làm việc với đội ngũ Developer.',
            tag: 'Mở Rộng Kỹ Năng'
          },
          {
            id: 'prompt_engineering_mastery',
            label: 'Tập trung chuyên sâu vào Advanced Prompting & Tư duy AI Product',
            description: 'Làm chủ kỹ thuật CoT, Few-shot, Meta-Prompting và đánh giá rủi ro ảo giác.',
            tag: 'Tư Duy Chiến Lược'
          }
        ]
      },
      {
        id: 'biggest_blocker',
        question: 'Rào cản lớn nhất của bạn hiện tại khi tiếp cận công nghệ AI là gì?',
        contextNote: 'AI Mentor sẽ thiết kế các bài học để gỡ bỏ triệt để rào cản này.',
        options: [
          {
            id: 'hallucination_fear',
            label: 'Lo ngại AI bịa đặt dữ liệu (Hallucination) ảnh hưởng uy tín công việc',
            description: 'Học cách thiết lập hàng rào kiểm duyệt Guardrails và kỹ thuật Grounding chính xác.',
            tag: 'Độ Tin Cậy Dữ Liệu'
          },
          {
            id: 'overwhelmed_tech_jargon',
            label: 'Bị ngợp bởi quá nhiều thuật ngữ kỹ thuật phức tạp',
            description: 'Chương trình sẽ dùng phép loại suy trực quan, hình ảnh hóa 100% kiến thức.',
            tag: 'Dễ Tiếp Thu'
          },
          {
            id: 'dont_know_where_start',
            label: 'Biết AI rất mạnh nhưng chưa rõ nên áp dụng cụ thể vào đâu',
            description: 'Cung cấp ma trận 20+ ca ứng dụng thực chiến trong doanh nghiệp để áp dụng ngay.',
            tag: 'Định Hướng Thực Tiễn'
          }
        ]
      }
    ];
  }

  if (background === 'data_analyst') {
    return [
      {
        id: 'data_specialty',
        question: 'Thế mạnh kỹ thuật dữ liệu bạn muốn tận dụng nhất để bứt phá sang AI?',
        contextNote: 'Kết hợp nền tảng phân tích sẵn có để rút ngắn 50% thời gian học.',
        options: [
          {
            id: 'sql_warehousing',
            label: 'SQL Nâng Cao, Database Schema & Data Modeling',
            description: 'Chuyển hóa sang Text-to-SQL Agents và tối ưu hóa truy vấn trên pgvector.',
            tag: 'Lợi Thế Cực Lớn'
          },
          {
            id: 'python_pipeline',
            label: 'Python Data Science (Pandas, Scikit-learn, Feature Engineering)',
            description: 'Chuyển hóa sang xây dựng Data Pipeline cho LLM (Chunking, Tokenization, Embedding).',
            tag: 'Tiếp Cận Thuận Lợi'
          },
          {
            id: 'etl_data_infra',
            label: 'ETL Pipelines, Data Lakes & Orchestration (Airflow, dbt)',
            description: 'Xây dựng hạ tầng dữ liệu đồng bộ thời gian thực cho hệ thống RAG quy mô lớn.',
            tag: 'Chuẩn AI Platform'
          }
        ],
        customPlaceholder: 'Nhập công cụ dữ liệu khác bạn đang sử dụng...'
      },
      {
        id: 'ai_focus_domain',
        question: 'Bạn muốn chuyên sâu vào mảng kỹ thuật AI nào nhất trong 8 tuần tới?',
        contextNote: 'Định hình sản phẩm Capstone và hồ sơ năng lực SFIA của bạn.',
        options: [
          {
            id: 'text_to_sql_analytics',
            label: 'Hệ Thống Text-to-SQL & AI Business Intelligence Agent',
            description: 'Cho phép sếp và khách hàng tra cứu cơ sở dữ liệu bằng tiếng Việt tự nhiên.',
            tag: 'Sản Phẩm Rất Đắt Giá'
          },
          {
            id: 'vector_search_eval',
            label: 'Vector Search Optimization & Đánh Giá RAG Triad (Ragas)',
            description: 'Đo lường độ chính xác Faithfulness, Answer Relevance và Context Recall.',
            tag: 'Chất Lượng Chuyên Sâu'
          },
          {
            id: 'fine_tuning_domain',
            label: 'Fine-Tuning Mô Hình Riêng (LoRA/QLoRA) Trên Dữ Liệu Ngành',
            description: 'Tự huấn luyện mô hình với bộ dữ liệu đặc thù y tế, tài chính hoặc luật.',
            tag: 'Kỹ Năng Đỉnh Cao'
          }
        ]
      }
    ];
  }

  // Mặc định: Sinh viên hoặc Người mới bắt đầu
  return [
    {
      id: 'current_readiness',
      question: 'Mức độ kinh nghiệm lập trình và toán học hiện tại của bạn?',
      contextNote: 'AI Mentor sẽ xếp lớp và gợi ý bài giảng khởi động vừa vặn nhất.',
      options: [
        {
          id: 'beginner_zero',
          label: 'Bắt đầu từ L0 (Chưa từng viết code)',
          description: 'Lộ trình sẽ dẫn dắt từng bước từ tư duy máy tính, cài đặt môi trường đến code mẫu.',
          tag: 'Từng Bước Vững Chắc'
        },
        {
          id: 'basic_programming',
          label: 'Đã biết lập trình cơ bản (Biến, Hàm, Mảng, OOP trong C/Java/Python)',
          description: 'Lướt nhanh cú pháp cơ bản, đi thẳng vào thư viện Numpy, Pandas và PyTorch AI.',
          tag: 'Tăng Tốc Gấp Đôi'
        },
        {
          id: 'math_inclined',
          label: 'Đã có nền tảng Toán (Đại số tuyến tính, Giải tích, Xác suất)',
          description: 'Đào sâu vào bản chất toán học của Attention Mechanism, Loss Function và Gradient Descent.',
          tag: 'Nắm Sâu Bản Chất'
        }
      ]
    },
    {
      id: 'career_destination',
      question: 'Vị trí công việc mục tiêu bạn hướng tới sau khi hoàn thành lộ trình?',
      contextNote: 'Hệ thống sẽ định hướng các đồ án thực hành bám sát bài test tuyển dụng thực tế.',
      options: [
        {
          id: 'junior_ai_engineer',
          label: 'Junior AI Engineer / Generative AI Developer',
          description: 'Thành thạo xây dựng RAG, Agent, gọi API và tích hợp mô hình vào ứng dụng web.',
          tag: 'Nhu Cầu Cao Nhất'
        },
        {
          id: 'ai_data_specialist',
          label: 'AI Data Specialist / MLOps Associate',
          description: 'Chuyên về chuẩn bị dữ liệu, fine-tuning mô hình và triển khai Docker/vLLM.',
          tag: 'Thu Nhập Hấp Dẫn'
        },
        {
          id: 'freelancer_ai_creator',
          label: 'Freelancer Xây Dựng Giải Pháp AI Cho Doanh Nghiệp',
          description: 'Nhận dự án tư vấn, triển khai chatbot CSKH, tự động hóa tài liệu cho khách hàng.',
          tag: 'Tự Do Tài Chính'
        }
      ]
    },
    {
      id: 'study_style',
      question: 'Phong cách học tập nào giúp bạn tiếp thu kiến thức nhanh nhất?',
      contextNote: 'Tối ưu hóa hình thức truyền tải của từng bài giảng trong lộ trình.',
      options: [
        {
          id: 'project_driven',
          label: 'Thực Chiến Làm Dự Án Trước, Đào Sâu Lý Thuyết Sau (Top-Down)',
          description: 'Thấy kết quả chạy được ngay từ ngày đầu tiên để tạo động lực mạnh mẽ.',
          tag: 'Rất Hứng Thú'
        },
        {
          id: 'academic_solid',
          label: 'Bài Bản Từng Bước: Lý Thuyết $\to$ Code Mẫu $\to$ Bài Tập (Bottom-Up)',
          description: 'Hiểu cặn kẽ từng thông số, vững vàng nền tảng để không bị hổng kiến thức.',
          tag: 'Vững Chắc Dài Hạn'
        }
      ]
    }
  ];
}

/**
 * Tổng hợp toàn bộ câu trả lời (Baseline + Adaptive) để kiến tạo Lộ trình 4 Sprints Độc Bản
 */
export function synthesizePersonalizedRoadmap(
  background: BackgroundType,
  goalId: string,
  weeklyHours: number,
  answers: Record<string, AdaptiveAnswer>,
  userProfile?: UserProfileInput
): PersonalizedRoadmap {
  const roadmapId = `rdm_${Date.now()}`;
  const totalWeeks = 8;
  const totalTargetHours = weeklyHours * totalWeeks;

  // Trích xuất các câu trả lời cá nhân hóa
  const techStackAnswer = answers['tech_stack']?.selectedOptionId;
  const aiArchAnswer = answers['ai_architecture']?.selectedOptionId;
  const workflowAnswer = answers['daily_workflow']?.selectedOptionId;
  const customNotes = Object.values(answers)
    .map(a => a.customText)
    .filter(Boolean)
    .join('; ');

  // Trích xuất thông tin hồ sơ CV / Bio nếu có
  const cvNote = userProfile?.cvFileName 
    ? `Hồ sơ CV đối chiếu: ${userProfile.cvFileName}${userProfile.cvFileSize ? ` (${userProfile.cvFileSize})` : ''}`
    : '';
  const bioNote = userProfile?.bioDescription 
    ? `Kinh nghiệm học viên chia sẻ: "${userProfile.bioDescription}"`
    : '';

  // 1. TỔNG HỢP LỜI KHUYÊN AI MENTOR 1-ON-1
  let advice = '';
  let sprint1: RoadmapMilestone;
  let sprint2: RoadmapMilestone;
  let sprint3: RoadmapMilestone;
  let sprint4: RoadmapMilestone;
  let personalizedTags: string[] = [];

  if (userProfile?.cvFileName) {
    personalizedTags.push('CV Verified');
  }
  if (userProfile?.bioDescription) {
    personalizedTags.push('Profile Tailored');
  }

  if (background === 'software_dev') {
    personalizedTags = ['Fullstack AI', 'Hybrid RAG', 'LangGraph Multi-Agent', 'vLLM Infra'];
    const chosenStack = techStackAnswer === 'ts_nextjs' 
      ? 'TypeScript & Next.js 15 App Router' 
      : techStackAnswer === 'csharp_dotnet' 
      ? 'C# .NET 10 Clean Architecture' 
      : 'Python 3.12 (FastAPI & PyTorch)';

    advice = `Chào Developer! Với kinh nghiệm lập trình sẵn có, mình đã loại bỏ 100% các bài học cơ bản về biến/hàm để bạn tiết kiệm thời gian. Lộ trình của bạn được may đo xoay quanh trọng tâm ${chosenStack}. Trong ${totalWeeks} tuần tới (quỹ ${weeklyHours}h/tuần), bạn sẽ đi thẳng vào giải phẫu kiến trúc Transformer, xây dựng Hybrid RAG kết hợp thuật toán RRF, và triển khai Multi-Agent LangGraph sẵn sàng cho Production. ${customNotes ? `Ghi chú nguyện vọng của bạn: "${customNotes}" đã được tích hợp vào đề bài Capstone.` : ''}`;

    sprint1 = {
      id: 'sp1',
      roadmap_id: roadmapId,
      sprint_number: 1,
      title: 'Sprint 1: Giải Phẫu Transformer, Embeddings & Môi Trường AI',
      description: 'Làm chủ cơ chế Self-Attention, Tokenization thực tế, cài đặt PyTorch và chạy script Embedding đầu tiên.',
      target_days: 14,
      selected_lesson_ids: ['MOD-01', 'MOD-02'],
      boss_fight_task: 'Code thuật toán Cosine Similarity & Self-Attention Matrix từ đầu mà không dùng thư viện ngoài.',
      status: 'available',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint2 = {
      id: 'sp2',
      roadmap_id: roadmapId,
      sprint_number: 2,
      title: 'Sprint 2: Kiến Trúc Enterprise Hybrid RAG & Vector DB (Qdrant)',
      description: 'Xây dựng pipeline RAG 2 tầng: Dense Vector Search kết hợp Sparse BM25 và thuật toán Reciprocal Rank Fusion.',
      target_days: 28,
      selected_lesson_ids: ['MOD-03', 'MOD-04', 'MOD-05'],
      boss_fight_task: 'Xây dựng Hybrid RAG tra cứu tài liệu đạt độ chính xác Context Precision > 85% trên tập benchmark 100 câu.',
      status: 'locked',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint3 = {
      id: 'sp3',
      roadmap_id: roadmapId,
      sprint_number: 3,
      title: 'Sprint 3: Autonomous Multi-Agent & LangGraph Workflow',
      description: 'Tổ chức mạng lưới nhiều tác nhân (Planner, Researcher, Coder, Critic) có khả năng tự gọi API và kiểm tra chéo.',
      target_days: 42,
      selected_lesson_ids: ['MOD-06', 'MOD-07', 'MOD-08'],
      boss_fight_task: 'Xây dựng Multi-Agent tự động đọc yêu cầu khách hàng, gọi công cụ tính toán và xuất báo cáo PDF chuẩn.',
      status: 'locked',
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint4 = {
      id: 'sp4',
      roadmap_id: roadmapId,
      sprint_number: 4,
      title: 'Sprint 4: Enterprise MLOps, Deploy Production & Verified Portfolio',
      description: 'Tối ưu hóa suy luận với vLLM/Docker, thiết lập Token Metering, Guardrails chống Prompt Injection và đóng gói Capstone.',
      target_days: 56,
      selected_lesson_ids: ['MOD-09', 'MOD-10', 'MOD-11', 'MOD-12'],
      boss_fight_task: 'Deploy ứng dụng AI lên Cloud công khai, vượt qua bộ kiểm thử bảo mật 50 tấn công injection.',
      status: 'locked',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else if (background === 'non_tech') {
    personalizedTags = ['AI Product', 'No-Code Automation', 'Advanced Prompting', 'AI PRD & ROI'];
    advice = `Chào bạn! Là người đến từ mảng Non-Tech / Product / Vận hành, bạn KHÔNG CẦN phải trở thành chuyên gia toán học hay lập trình viên viết code phức tạp. Lợi thế lớn nhất của bạn là sự am hiểu sâu sắc về bài toán nghiệp vụ thực tế! Lộ trình 8 tuần này tập trung 80% vào Tư duy AI Product, nghệ thuật Prompt Engineering cấp độ chuyên gia, và cách dùng công cụ tự động hóa giải phóng 10+ giờ làm việc mỗi tuần. ${customNotes ? `Ý tưởng cụ thể của bạn: "${customNotes}" sẽ là đề tài chính cho đồ án tốt nghiệp!` : ''}`;

    sprint1 = {
      id: 'sp1',
      roadmap_id: roadmapId,
      sprint_number: 1,
      title: 'Sprint 1: Bản Đồ Tư Duy AI & Nghệ Thuật Prompt Engineering Đỉnh Cao',
      description: 'Hiểu rõ cách LLM hoạt động, cơ chế suy luận CoT (Chain-of-Thought), Meta-Prompting và cách trị dứt điểm Hallucination.',
      target_days: 14,
      selected_lesson_ids: ['MOD-01', 'MOD-02'],
      boss_fight_task: 'Biên soạn bộ thư viện 10 Mega-Prompts chuẩn hóa toàn bộ quy trình viết báo cáo và phân tích nghiệp vụ.',
      status: 'available',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint2 = {
      id: 'sp2',
      roadmap_id: roadmapId,
      sprint_number: 2,
      title: 'Sprint 2: Tự Động Hóa Dữ Liệu Văn Phòng & Trợ Lý Tài Liệu Riêng',
      description: 'Ứng dụng AI xử lý bảng tính Excel, trích xuất dữ liệu hợp đồng PDF và xây dựng Knowledge Base không cần code.',
      target_days: 28,
      selected_lesson_ids: ['MOD-03', 'MOD-04'],
      boss_fight_task: 'Thiết lập trợ lý AI đọc hiểu toàn bộ kho văn bản quy chế công ty và trả lời có trích dẫn số trang chính xác.',
      status: 'locked',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint3 = {
      id: 'sp3',
      roadmap_id: roadmapId,
      sprint_number: 3,
      title: 'Sprint 3: Xây Dựng AI Workflow Đa Tác Nhân (No-Code Agent)',
      description: 'Lắp ghép quy trình làm việc tự động giữa Gmail, Sheets và AI bằng công cụ trực quan (N8N / Dify / Make).',
      target_days: 42,
      selected_lesson_ids: ['MOD-06', 'MOD-07'],
      boss_fight_task: 'Tạo quy trình CSKH tự động: nhận email khách -> phân loại cảm xúc -> soạn dự thảo câu trả lời -> gửi sếp duyệt.',
      status: 'locked',
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint4 = {
      id: 'sp4',
      roadmap_id: roadmapId,
      sprint_number: 4,
      title: 'Sprint 4: Thiết Kế AI Product PRD, Đánh Giá ROI & Pitch Deck',
      description: 'Hoàn thiện hồ sơ đặc tả sản phẩm AI, tính toán bài toán chi phí token vs hiệu quả nhân sự, tự tin thuyết trình.',
      target_days: 56,
      selected_lesson_ids: ['MOD-11', 'MOD-12'],
      boss_fight_task: 'Hoàn thiện bản Product Requirement Document (PRD) hoàn chỉnh cho một tính năng AI trong doanh nghiệp.',
      status: 'locked',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else if (background === 'data_analyst') {
    personalizedTags = ['AI Data Pipeline', 'Vector Indexing', 'Text-to-SQL', 'RAG Evaluation'];
    advice = `Chào Data Specialist! Thế mạnh về SQL, cấu trúc dữ liệu và tư duy định lượng là bệ phóng tuyệt vời nhất để bạn trở thành AI Data Architect. Lộ trình của bạn sẽ biến thế mạnh dữ liệu thành năng lực AI cốt lõi: chuyển hóa Text-to-SQL cho doanh nghiệp, tối ưu hóa Vector Search trên pgvector và làm chủ bộ chỉ số đánh giá RAGAS. ${customNotes ? `Nguyện vọng riêng của bạn: "${customNotes}" sẽ được chú trọng tối đa.` : ''}`;

    sprint1 = {
      id: 'sp1',
      roadmap_id: roadmapId,
      sprint_number: 1,
      title: 'Sprint 1: Embedding Models, Vector Space & Semantic Indexing',
      description: 'Nắm vững toán học không gian vector, so sánh các mô hình Embedding tiếng Việt và tối ưu hóa chunking dữ liệu.',
      target_days: 14,
      selected_lesson_ids: ['MOD-01', 'MOD-02', 'MOD-03'],
      boss_fight_task: 'Thiết kế chiến lược Semantic Chunking thông minh cho bộ dữ liệu bảng biểu tài chính phức tạp.',
      status: 'available',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint2 = {
      id: 'sp2',
      roadmap_id: roadmapId,
      sprint_number: 2,
      title: 'Sprint 2: Text-to-SQL Agent & Trợ Lý Phân Tích Dữ Liệu Tự Động',
      description: 'Xây dựng AI Agent có khả năng đọc Schema CSDL, tự sinh câu lệnh SQL chuẩn xác và đối chiếu bảo mật.',
      target_days: 28,
      selected_lesson_ids: ['MOD-04', 'MOD-05'],
      boss_fight_task: 'Dựng bot Telegram cho phép hỏi số liệu kinh doanh bằng tiếng Việt và tự động trả về biểu đồ phân tích.',
      status: 'locked',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint3 = {
      id: 'sp3',
      roadmap_id: roadmapId,
      sprint_number: 3,
      title: 'Sprint 3: Hạ Tầng Vector DB Quy Mô Lớn (Qdrant & pgvector)',
      description: 'Cấu hình chỉ mục HNSW, tối ưu hóa bộ nhớ RAM, phân vùng dữ liệu và cài đặt bảo mật Row-Level Security.',
      target_days: 42,
      selected_lesson_ids: ['MOD-06', 'MOD-07', 'MOD-08'],
      boss_fight_task: 'Tối ưu độ trễ truy vấn Vector Search xuống dưới 50ms trên tập dữ liệu 500.000 vectors.',
      status: 'locked',
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint4 = {
      id: 'sp4',
      roadmap_id: roadmapId,
      sprint_number: 4,
      title: 'Sprint 4: RAG Evaluation Triad (Ragas) & Fine-Tuning LoRA',
      description: 'Thiết lập hệ thống đo lường chất lượng tự động, phát hiện lỗ hổng retrieval và tinh chỉnh mô hình ngôn ngữ.',
      target_days: 56,
      selected_lesson_ids: ['MOD-09', 'MOD-10', 'MOD-12'],
      boss_fight_task: 'Xuất bản báo cáo đánh giá benchmark toàn diện cho hệ thống AI của doanh nghiệp kèm phân tích chi phí.',
      status: 'locked',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else {
    // Sinh viên / Bắt đầu từ L0
    personalizedTags = ['Chuẩn SFIA 8', 'Từ L0', 'Top-Down Thực Chiến', 'Định Hướng Tuyển Dụng'];
    advice = `Chào bạn! Hành trình tự học AI từ L0 là một quyết định tuyệt vời. Đừng lo lắng về việc chưa biết lập trình — hệ thống AI Thực Chiến được thiết kế theo chuẩn quốc tế SFIA 8 từ L1 đến L4, áp dụng phương pháp Top-Down thực hành trước để bạn thấy kết quả ngay trong tuần đầu tiên. Với ${weeklyHours}h/tuần, kiên trì theo đuổi lộ trình 4 chặng này sẽ giúp bạn sở hữu một Portfolio ấn tượng để ứng tuyển Kỹ sư AI! ${customNotes ? `Ghi chú của bạn: "${customNotes}" sẽ được AI Mentor đồng hành sát sao.` : ''}`;

    sprint1 = {
      id: 'sp1',
      roadmap_id: roadmapId,
      sprint_number: 1,
      title: 'Sprint 1: Nhập Môn Tư Duy Kỹ Sư AI & Cú Pháp Python 3.12 (SFIA L1)',
      description: 'Làm quen với AI, cài đặt môi trường VS Code, nắm vững cú pháp Python cốt lõi và chạy thử nghiệm AI đầu tiên.',
      target_days: 14,
      selected_lesson_ids: ['MOD-01', 'MOD-02'],
      boss_fight_task: 'Xây dựng chương trình dòng lệnh đầu tiên kết nối API LLM và trò chuyện bằng tiếng Việt.',
      status: 'available',
      sort_order: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint2 = {
      id: 'sp2',
      roadmap_id: roadmapId,
      sprint_number: 2,
      title: 'Sprint 2: Làm Chủ Prompting, Embeddings & Dự Án RAG Cơ Bản (SFIA L2)',
      description: 'Hiểu cách tìm kiếm ngữ nghĩa, biến đổi văn bản thành vector và xây dựng hệ thống hỏi đáp tài liệu đơn giản.',
      target_days: 28,
      selected_lesson_ids: ['MOD-03', 'MOD-04', 'MOD-05'],
      boss_fight_task: 'Tạo website hỏi đáp bài học cá nhân cho sinh viên sử dụng dữ liệu giáo trình của trường.',
      status: 'locked',
      sort_order: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint3 = {
      id: 'sp3',
      roadmap_id: roadmapId,
      sprint_number: 3,
      title: 'Sprint 3: Phát Triển Web App AI Hoàn Chỉnh (SFIA L3)',
      description: 'Kết hợp giao diện Web (Next.js/Streamlit) với Backend AI, lưu lịch sử trò chuyện và quản lý token.',
      target_days: 42,
      selected_lesson_ids: ['MOD-06', 'MOD-07', 'MOD-08'],
      boss_fight_task: 'Vượt qua bài thi khảo thí mô phỏng Mock Test SFIA Level 2 với số điểm trên 70%.',
      status: 'locked',
      sort_order: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    sprint4 = {
      id: 'sp4',
      roadmap_id: roadmapId,
      sprint_number: 4,
      title: 'Sprint 4: Đóng Gói Đồ Án Tốt Nghiệp, Deploy Cloud & Làm Đẹp CV',
      description: 'Deploy ứng dụng lên mạng công khai, viết README chuẩn quốc tế trên GitHub và chuẩn bị phỏng vấn tuyển dụng.',
      target_days: 56,
      selected_lesson_ids: ['MOD-09', 'MOD-10', 'MOD-12'],
      boss_fight_task: 'Đăng tải kho mã nguồn GitHub hoàn chỉnh và nhận chứng chỉ xác thực số K.AI Labs SFIA.',
      status: 'locked',
      sort_order: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

    const profileSummary = [cvNote, bioNote].filter(Boolean).join('\n');
    if (profileSummary) {
      advice += `\n\n📌 ${profileSummary}`;
    }

    return {
      id: roadmapId,
      user_id: 'current_user',
      title: `Lộ Trình AI Cá Nhân Hóa — 4 Sprints Chuẩn SFIA (v8)`,
      target_goal: goalId,
      weekly_hours_budget: weeklyHours,
      total_target_hours: totalTargetHours,
      ai_mentor_advice: advice,
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      milestones: [sprint1, sprint2, sprint3, sprint4],
      personalized_tags: personalizedTags,
      focus_topics: [sprint1.title, sprint2.title, sprint3.title, sprint4.title],
      userProfile
    };
  }
