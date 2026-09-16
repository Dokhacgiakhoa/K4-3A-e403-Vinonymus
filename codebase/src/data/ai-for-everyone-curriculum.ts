/**
 * AI for Everyone 2025 - Chuyên Đề Giáo Án Nhập Môn Level 0 (Dành Riêng Cho Người Mới Bắt Đầu & Non-Tech)
 * Dựa trên tác phẩm: "Trí Tuệ Nhân Tạo Cho Mọi Người - AI for Everyone (Prof Happy + AI, 2025)"
 * Cấu trúc: 5 Modules Toàn Diện (M01 - M05) bao gồm 15 Chương cốt lõi và 1 Phụ lục thực chiến
 */

import { CurriculumModuleItem } from './sfia-community-data';

export const AI_FOR_EVERYONE_MODULES: CurriculumModuleItem[] = [
  // =========================================================================
  // CHUYÊN ĐỀ 0.1: NHẬP MÔN BẢN CHẤT AI & LỊCH SỬ TIẾN HÓA (CHƯƠNG 1 - 3)
  // =========================================================================
  {
    id: "MOD-01",
    moduleNumber: 1,
    levelCode: "L0",
    title: "Chuyên Đề 0.1 • Bản Chất AI, Giải Mã Nỗi Sợ & Lịch Sử Tiến Hóa Từ Thần Thoại Đến GPT",
    tag: "Khái Niệm Cốt Lõi & Lịch Sử",
    levelTag: "Level 0 • AI for Everyone",
    bloomTaxonomy: "Remember & Understand",
    targetAudience: "Người Mới Bắt Đầu, Học Sinh, Sinh Viên, Khối Kinh Doanh & Non-Tech",
    startingFor: "NONTECH" as const,
    description: "Khám phá bản chất thật của Trí tuệ nhân tạo: AI là gì, có đáng sợ như phim viễn tưởng không? Điểm lại hành trình lịch sử từ bức tượng đồng Talos thời Hy Lạp, bài kiểm tra Turing, Deep Blue, AlphaGo đến kỷ nguyên bùng nổ của Generative AI.",
    crossFunctionalRoles: [
      {
        role: "PM_BA",
        roleName: "Product & Business",
        skillsRequired: ["Định vị bài toán AI hẹp vs AGI", "Đánh giá kỳ vọng công nghệ (Hype Cycle)", "Xây dựng tư duy AI-First"],
        projectDeliverable: "Bản báo cáo phân biệt AI Khả thi vs AI Viễn tưởng cho dự án thực tế"
      },
      {
        role: "UNIVERSAL",
        roleName: "Người Học Tự Do",
        skillsRequired: ["Nhận diện AI trong đời sống", "Hiểu cơ chế máy học cơ bản", "Xóa bỏ rào cản tâm lý sợ công nghệ"],
        projectDeliverable: "Sơ đồ tư duy (Mindmap) lịch sử phát triển và phân loại các nhánh AI"
      }
    ],
    assignment: {
      id: "LAB-001",
      asmNumber: 1,
      title: "Assignment 0.1: Khảo Sát & Nhận Diện 5 Ứng Dụng AI Đang Hoạt Động Xung Quanh Bạn",
      durationMinutes: 30,
      summary: "Quan sát và liệt kê 5 tính năng AI bạn đang sử dụng mỗi ngày (trợ lý ảo, thuật toán gợi ý video, bộ lọc thư rác, dịch tự động), phân tích xem chúng thuộc loại AI Hẹp (Narrow AI) hay AI Tổng Quát (AGI).",
      deliverables: [
        "Bảng tổng hợp 5 ứng dụng AI trong đời sống hàng ngày",
        "Phân tích ngắn: Tại sao AI hiện tại chưa thể có ý thức thống trị thế giới như phim ảnh?"
      ]
    },
    topics: [
      {
        title: "1. AI Là Gì? AI Có Thực Sự Đáng Sợ Hay Thống Trị Con Người?",
        description: "Trí tuệ nhân tạo (AI - Artificial Intelligence) đơn giản là khả năng của máy tính mô phỏng trí tuệ con người để giải quyết vấn đề cụ thể. Phim ảnh viễn tưởng (Terminator, Matrix) thường mô tả AI có ý thức và thù địch, nhưng thực tế AI ngày nay hoàn toàn là 'AI Hẹp' (Narrow AI) — cỗ máy giải toán cực nhanh theo các quy luật thống kê xác suất, không có cảm xúc, không có ý thức tự chủ và luôn nằm dưới sự kiểm soát của con người. Thay vì sợ hãi, chúng ta nên coi AI là người đồng minh đắc lực giúp nâng cao hiệu suất.",
        codeSnippet: {
          language: "python",
          title: "Minh Họa Tư Duy AI: Mô Phỏng Phân Loại Đơn Giản (Quy Luật vs Máy Học)",
          code: `# Tư duy lập trình truyền thống (Rule-based): Con người viết sẵn luật
def rule_based_filter(email_text):
    spam_keywords = ["trúng thưởng", "nhận quà ngay", "miễn phí 100%"]
    for word in spam_keywords:
        if word in email_text.lower():
            return "SPAM (Phát hiện theo từ khóa cứng)"
    return "INBOX (Email an toàn)"

# Tư duy AI (Machine Learning): Máy tự học trọng số xác suất từ dữ liệu
print(rule_based_filter("Chúc mừng bạn đã trúng thưởng chuyến du lịch!"))
# AI hiện đại phân tích ngữ cảnh sâu hơn thay vì chỉ nhìn từ khóa đơn lẻ!`
        }
      },
      {
        title: "2. Lịch Sử Phát Triển AI: Từ Thần Thoại Hy Lạp Đến Cuộc Cách Mạng GPT",
        description: "Hành trình AI không xuất hiện sau một đêm: (1) Thời cổ đại: Ước mơ về cỗ máy biết nghĩ trong thần thoại Talos bảo vệ đảo Crete; (2) Thế kỷ 17: René Descartes đặt nền móng triết học về mô phỏng tư duy; (3) Năm 1837: Charles Babbage & Ada Lovelace thiết kế cỗ máy phân tích và thuật toán đầu tiên; (4) Năm 1950: Alan Turing đề xuất Turing Test; (5) Năm 1956: Thuật ngữ 'Artificial Intelligence' chính thức ra đời tại hội nghị Dartmouth; (6) 1997: Deep Blue thắng Kasparov; (7) 2016: AlphaGo thắng cờ vây; (8) 2023 - nay: Bùng nổ GPT-4, Gemini, DALL-E.",
        codeSnippet: {
          language: "markdown",
          title: "Bản Đồ Cột Mốc Thời Gian (AI Milestones Timeline)",
          code: `[1837] Cỗ máy cơ khí (Ada Lovelace) ──► [1950] Turing Test (Alan Turing)
──► [1956] Khai sinh thuật ngữ AI (Dartmouth)
──► [1997] IBM Deep Blue vô địch Cờ vua
──► [2016] Google DeepMind AlphaGo vô địch Cờ vây
──► [2023+] Kỷ nguyên Generative AI (ChatGPT, DALL-E, Claude, DeepSeek)`
        }
      },
      {
        title: "3. AI Hoạt Động Như Thế Nào? Máy Học (ML) vs Học Sâu (Deep Learning)",
        description: "AI không phải phép màu hay ma thuật — cốt lõi của nó là Toán học và Dữ liệu. Học máy (Machine Learning) là nhánh máy tính tự rút ra quy luật từ dữ liệu mẫu mà không cần lập trình thủ công từng dòng if-else. Học sâu (Deep Learning) tiến thêm một bước khi xây dựng Mạng Nơ-ron Nhân Tạo (Neural Networks) nhiều tầng mô phỏng cách truyền tín hiệu synap trong não người, giúp máy xử lý xuất sắc các dữ liệu phi cấu trúc như hình ảnh, giọng nói và ngôn ngữ tự nhiên.",
        codeSnippet: {
          language: "python",
          title: "Minh Họa: Cách Một Mạng Nơ-ron Dự Đoán Đầu Ra",
          code: `# Ví dụ trực quan: Dự đoán giá bán căn nhà dựa trên diện tích
# y = w * x + b (w: trọng số máy học được, b: độ lệch sai số)
def predict_house_price(area_sqm, weight=50.0, bias=100.0):
    """
    area_sqm: Diện tích (m2)
    weight: Giá trị trung bình mỗi m2 (triệu VNĐ)
    bias: Chi phí cơ sở hạ tầng cố định
    """
    predicted_price = (area_sqm * weight) + bias
    return f"Giá dự kiến: {predicted_price:,.0f} Triệu VNĐ"

print(predict_house_price(75)) # Căn hộ 75m2 -> 3,850 Triệu VNĐ`
        }
      }
    ]
  },

  // =========================================================================
  // CHUYÊN ĐỀ 0.2: TOÀN CẢNH ỨNG DỤNG AI ĐỜI SỐNG & KINH DOANH (CHƯƠNG 4 - 8)
  // =========================================================================
  {
    id: "MOD-02",
    moduleNumber: 2,
    levelCode: "L0",
    title: "Chuyên Đề 0.2 • Toàn Cảnh Ứng Dụng AI Trong Đời Sống, Y Tế, Giáo Dục, Kinh Doanh & Robot",
    tag: "Ứng Dụng Đa Ngành",
    levelTag: "Level 0 • AI for Everyone",
    bloomTaxonomy: "Understand & Apply",
    targetAudience: "Người Đi Làm, Quản Lý, Marketer, Bác Sĩ, Giáo Viên, Sinh Viên Mọi Ngành",
    startingFor: "NONTECH" as const,
    description: "Khám phá bức tranh ứng dụng thực tiễn của AI trên toàn bộ các lĩnh vực trọng yếu: Trợ lý ảo gia đình, thuật toán gợi ý mạng xã hội (TikTok, Facebook), bác sĩ số hóa chẩn đoán ảnh MRI/X-quang, giáo dục thích ứng, tài chính định lượng và 5 cấp độ tự lái của ô tô thông minh.",
    crossFunctionalRoles: [
      {
        role: "PM_BA",
        roleName: "Product / Business Analyst",
        skillsRequired: ["Phân tích nghiệp vụ tự động hóa CSKH", "Tính toán thời gian hoàn vốn ROI", "Tích hợp AI vào chuỗi giá trị"],
        projectDeliverable: "Bản đề xuất giải pháp ứng dụng Chatbot AI cho phòng Dịch vụ Khách hàng"
      },
      {
        role: "DATA_ENG",
        roleName: "Operations & Logistics",
        skillsRequired: ["Quy trình kho vận thông minh", "Phân tích luồng di chuyển robot AGV", "Tối ưu hóa tuyến đường"],
        projectDeliverable: "Bản phân tích mô hình robot lấy hàng tự động kiểu Amazon Kiva"
      }
    ],
    assignment: {
      id: "LAB-002",
      asmNumber: 2,
      title: "Assignment 0.2: Thiết Kế Kịch Bản Trợ Lý AI Giải Quyết 1 Nỗi Đau (Painpoint) Công Việc",
      durationMinutes: 45,
      summary: "Chọn một nghiệp vụ thường ngày trong ngành nghề của bạn (ví dụ: soạn thảo email trả lời khách, tóm tắt báo cáo tài chính, lên kế hoạch bài giảng) và phác thảo giải pháp ứng dụng AI để rút ngắn 70% thời gian thực hiện.",
      deliverables: [
        "Bản mô tả bài toán và nỗi đau hiện tại",
        "Kịch bản luồng tương tác giữa người dùng và AI Trợ lý",
        "Bảng đối chiếu thời gian trước và sau khi áp dụng AI"
      ]
    },
    topics: [
      {
        title: "1. AI Trong Điện Thoại, Máy Tính & Nhà Thông Minh (Siri, Alexa, TikTok)",
        description: "AI đã len lỏi vào từng hơi thở cuộc sống qua: (1) Trợ lý giọng nói (Siri, Google Assistant) xử lý lệnh và điều khiển nhà thông minh; (2) Thuật toán gợi ý cá nhân hóa: TikTok và YouTube phân tích hàng trăm tín hiệu (thời gian xem, lượt thích, tốc độ cuộn) để đề xuất video vừa vặn sở thích; (3) Cảnh báo và chống tin giả (Fake News): Hệ thống Computer Vision phát hiện hình ảnh Deepfake và bài đăng vi phạm chính sách.",
        codeSnippet: {
          language: "markdown",
          title: "Cơ Chế Khuyến Nghị (Recommendation Engine): Bạn Thích Gì, AI Học Đó",
          code: `[Người Dùng Xem 3 Video Nấu Ăn]
  ──► Thuật toán ghi nhận: Sở thích = "Ẩm thực & Món ngon"
  ──► Trích xuất đặc trưng (Feature Vector): Thời gian dừng xem > 80%
  ──► Đề xuất tiếp theo: Video công thức làm bánh ngọt (Xác suất Click 94%)`
        }
      },
      {
        title: "2. AI Trong Y Tế & Giáo Dục: Bác Sĩ Số Hóa & Thầy Cô Kỹ Thuật Số",
        description: "Trong y tế, mô hình Google Health phân tích ảnh chụp nhũ ảnh (Mammography) phát hiện dấu hiệu ung thư vú sớm với độ chuẩn xác tương đương hoặc cao hơn bác sĩ chuyên khoa; trong đại dịch COVID-19, AI rút ngắn thời gian phân tích cấu trúc protein virus SARS-CoV-2 từ nhiều năm xuống vài tháng. Trong giáo dục, AI mang lại mô hình 'Học tập thích ứng' (Adaptive Learning) — tự động hạ độ khó khi học viên gặp vướng mắc và tăng tốc bài tập nâng cao khi học viên đã làm chủ kiến thức.",
        codeSnippet: {
          language: "markdown",
          title: "Mô Hình Học Tập Thích Ứng (Adaptive Learning Flow)",
          code: `[Học Viên Làm Bài Quiz]
  ├── Đúng 100% ──► Tự động tăng độ khó & Mở khóa kiến thức nâng cao
  └── Sai 2 câu ──► Kích hoạt Chatbot AI giải thích chi tiết & Giao bài củng cố`
        }
      },
      {
        title: "3. AI Trong Tài Chính, Xe Tự Hành & Robot Vận Tải (5 Cấp Độ Tự Lái)",
        description: "Trong tài chính, các quỹ đầu tư định lượng (Quants) phân tích hàng triệu tin tức để bắt tín hiệu giao dịch trong mili-giây, trong khi hệ thống chống gian lận thẻ tín dụng chặn đứng giao dịch bất thường theo thời gian thực. Trong giao thông, tiêu chuẩn SAE chia xe tự lái thành 5 cấp độ: Từ Cấp 1 (Hỗ trợ giữ làn) đến Cấp 5 (Xe hoàn toàn không cần vô lăng, chân ga). Tại các kho hàng Amazon, hàng vạn robot tự hành vận chuyển kiện hàng giúp tăng năng suất gấp 3 lần.",
        codeSnippet: {
          language: "markdown",
          title: "Bảng 5 Cấp Độ Xe Tự Hành Chuẩn Quốc Tế (SAE J3016)",
          code: `• Cấp 1: Hỗ trợ tài xế (Cruise Control cơ bản)
• Cấp 2: Tự động một phần (Tự giữ làn + Thắng khẩn cấp)
• Cấp 3: Tự lái có điều kiện (Xe tự lái trên cao tốc, tài xế sẵn sàng can thiệp)
• Cấp 4: Tự động hóa cao (Xe tự vận hành trong khu vực đô thị quy định sẵn)
• Cấp 5: Tự động hóa tuyệt đối (Không cần vô lăng, xe tự quyết định mọi tình huống)`
        }
      }
    ]
  },

  // =========================================================================
  // CHUYÊN ĐỀ 0.3: GIẢI MÃ "ĐỘNG CƠ" BÊN DƯỚI CỦA AI (CHƯƠNG 9 - 11)
  // =========================================================================
  {
    id: "MOD-03",
    moduleNumber: 3,
    levelCode: "L0",
    title: "Chuyên Đề 0.3 • Giải Mã Động Cơ AI: Vòng Đời Dữ Liệu, 3 Trụ Cột Học Máy & Đột Phá Transformer",
    tag: "Nguyên Lý & Thuật Toán",
    levelTag: "Level 0 • AI for Everyone",
    bloomTaxonomy: "Understand & Analyze",
    targetAudience: "Mọi Học Viên Muốn Hiểu Bản Chất Kỹ Thuật Phía Sau AI Mà Không Cần Giỏi Toán Cao Cấp",
    startingFor: "NONTECH" as const,
    description: "Giải mã bí mật bên dưới cỗ máy AI: Tại sao Dữ liệu được coi là 'dầu mỏ / nhiên liệu' thế kỷ 21? Phân biệt rõ ràng 3 trường phái: Học có giám sát (Supervised), Học không giám sát (Unsupervised) và Học tăng cường (Reinforcement Learning). Khám phá kiến trúc Transformer — bước nhảy vọt đứng sau GPT, BERT và trào lưu Generative AI.",
    crossFunctionalRoles: [
      {
        role: "BACKEND_DB",
        roleName: "Data & Systems",
        skillsRequired: ["Quy trình Data Cleaning", "Phát hiện Missing Data", "Đánh giá chất lượng tập Train/Test"],
        projectDeliverable: "Pipeline 4 bước tiền xử lý dữ liệu chuẩn hóa cho huấn luyện mô hình"
      },
      {
        role: "FRONTEND",
        roleName: "Product & UI",
        skillsRequired: ["Hiểu cơ chế Streaming Token", "Giao diện hội thoại Generative UI", "Xử lý độ trễ phản hồi"],
        projectDeliverable: "Bản mô phỏng cách LLM sinh từ tiếp theo (Next Token Prediction)"
      }
    ],
    assignment: {
      id: "LAB-003",
      asmNumber: 3,
      title: "Assignment 0.3: Trải Nghiệm & So Sánh 3 Dòng Công Cụ Generative AI (Văn Bản, Hình Ảnh, Code)",
      durationMinutes: 45,
      summary: "Sử dụng ChatGPT (hoặc Claude/Gemini) để viết 1 đoạn văn, dùng DALL-E (hoặc Midjourney/Bing Image Creator) vẽ tranh minh họa và yêu cầu AI giải thích cách mô hình dự đoán từ tiếp theo qua cơ chế xác suất.",
      deliverables: [
        "Prompt đầu vào và kết quả đầu ra của văn bản & hình ảnh",
        "Giải thích ngắn gọn: Tại sao mô hình có thể bị hiện tượng 'Ảo giác' (Hallucination)?"
      ]
    },
    topics: [
      {
        title: "1. Dữ Liệu – 'Nhiên Liệu' Của AI: Rác Vào Thì Rác Ra (Garbage In, Garbage Out)",
        description: "Mô hình AI dù tinh vi đến đâu cũng vô dụng nếu không có dữ liệu huấn luyện. Quy trình 4 bước chuẩn mực: (1) Thu thập dữ liệu (Web, cảm biến, hồ sơ); (2) Làm sạch dữ liệu (Xóa bỏ nhiễu, chuẩn hóa định dạng, loại bỏ bản ghi trùng); (3) Huấn luyện mô hình (Tìm quy luật tương quan); (4) Kiểm tra và đánh giá trên tập dữ liệu chưa từng thấy. Khẩu hiệu vàng của ngành AI: 'Dữ liệu chất lượng cao quan trọng hơn thuật toán phức tạp'.",
        codeSnippet: {
          language: "python",
          title: "Vòng Đời Xử Lý Dữ Liệu Đơn Giản Trong Python",
          code: `# Dữ liệu thô ban đầu dính lỗi font và trùng lặp
raw_data = ["  Hà Nội ", "SÀI GÒN", "hà nội", "Đà Nẵng", None, " Cần Thơ "]

# Quy trình làm sạch dữ liệu (Data Cleaning)
clean_data = []
for item in raw_data:
    if item is not None:
        standardized = item.strip().title() # Chuẩn hóa viết hoa chữ cái đầu
        if standardized not in clean_data:
            clean_data.append(standardized)

print(f"Dữ liệu sau khi làm sạch: {clean_data}")
# Kết quả: ['Hà Nội', 'Sài Gòn', 'Đà Nẵng', 'Cần Thơ']`
        }
      },
      {
        title: "2. Ba Trường Phái Học Máy: Học Có Giám Sát, Không Giám Sát & Học Tăng Cường",
        description: "Học máy chia làm 3 trụ cột lớn: (1) Học có giám sát (Supervised Learning): Cung cấp đề bài kèm đáp án (Dữ liệu có nhãn) — ví dụ: ảnh chụp kèm nhãn 'Chó' hoặc 'Mèo'; (2) Học không giám sát (Unsupervised Learning): Chỉ cung cấp dữ liệu thô, máy tự gom nhóm những đối tượng tương đồng — ví dụ: phân cụm nhóm khách hàng mua sắm; (3) Học tăng cường (Reinforcement Learning - RL): Máy học qua cơ chế Thưởng / Phạt — đi đúng được điểm cộng, đi sai bị trừ điểm, giúp AI vô địch Cờ vua và lái xe tự động.",
        codeSnippet: {
          language: "markdown",
          title: "So Sánh Trực Quan 3 Phương Pháp Học Máy",
          code: `┌───────────────────────┬──────────────────────────┬─────────────────────────────┐
│ Phương Pháp           │ Dữ Liệu Đầu Vào          │ Ứng Dụng Điển Hình          │
├───────────────────────┼──────────────────────────┼─────────────────────────────┤
│ 1. Có Giám Sát        │ Đã dán nhãn (X + Nhãn Y) │ Phân loại thư rác, Định giá │
│ 2. Không Giám Sát     │ Dữ liệu thô chưa dán nhãn│ Phân cụm khách hàng, Gian lận│
│ 3. Học Tăng Cường     │ Môi trường thử nghiệm    │ AI chơi Cờ vua, Xe tự lái   │
└───────────────────────┴──────────────────────────┴─────────────────────────────┘`
        }
      },
      {
        title: "3. Đột Phá Kiến Trúc Transformer: Bí Mật Đằng Sau GPT, BERT & Generative AI",
        description: "Trước năm 2017, máy tính xử lý ngôn ngữ rất chậm theo từng từ nối tiếp. Năm 2017, các nhà nghiên cứu Google công bố kiến trúc Transformer với cơ chế Tự Chú Ý (Self-Attention) mang tính cách mạng: Máy tính có thể đọc toàn bộ câu cùng lúc và hiểu mối liên hệ ngữ cảnh giữa các từ cách xa nhau. Từ đó khai sinh: (1) BERT: Chuyên gia hiểu ngữ cảnh để cải tiến Google Search; (2) GPT: Mô hình sinh văn bản dự đoán từ tiếp theo; (3) DALL-E & Midjourney: AI khuếch tán tạo hình ảnh từ văn bản.",
        codeSnippet: {
          language: "markdown",
          title: "Cách GPT Tạo Ra Câu Trả Lời: Dự Đoán Token Tiếp Theo",
          code: `Đầu vào: "Mặt trời mọc ở hướng..."
Xác suất phân bổ từ tiếp theo:
  ├── "Đông" : 96.8%  ◄── AI chọn từ có xác suất cao nhất
  ├── "Tây"  : 1.2%
  └── "Bắc"  : 0.1%`
        }
      }
    ]
  },

  // =========================================================================
  // CHUYÊN ĐỀ 0.4: ĐẠO ĐỨC, THIÊN VỊ & KỶ NGUYÊN NGƯỜI + AI (CHƯƠNG 12 - 15)
  // =========================================================================
  {
    id: "MOD-04",
    moduleNumber: 4,
    levelCode: "L0",
    title: "Chuyên Đề 0.4 • Đạo Đức AI, Nguy Cơ Mất Việc, Thiên Vị Dữ Liệu (Bias) & Kỷ Nguyên Người + AI",
    tag: "Đạo Đức & Tương Lai",
    levelTag: "Level 0 • AI for Everyone",
    bloomTaxonomy: "Analyze & Evaluate",
    targetAudience: "Nhà Quản Lý Doanh Nghiệp, Chuyên Viên Nhân Sự, Luật Sư, Nhà Giáo Dục & Toàn Thể Học Viên",
    startingFor: "NONTECH" as const,
    description: "Đối diện trực diện với những câu hỏi hóc búa nhất của thời đại: AI có lấy mất việc làm của bạn không? AI có cảm xúc và đồng cảm thật sự không? Nguy cơ thiên vị dữ liệu (AI Bias), xâm phạm quyền riêng tư số và định hướng phát triển: Con người cộng tác cùng AI thay vì sợ hãi bị thay thế.",
    crossFunctionalRoles: [
      {
        role: "QA_SECURITY",
        roleName: "Compliance & Safety",
        skillsRequired: ["Kiểm toán thiên vị thuật toán (Bias Audit)", "Bảo vệ dữ liệu cá nhân GDPR", "Đánh giá an toàn AI"],
        projectDeliverable: "Bộ quy tắc Đạo đức AI & Hướng dẫn sử dụng công cụ AI an toàn trong nội bộ"
      },
      {
        role: "PM_BA",
        roleName: "Talent & Strategy",
        skillsRequired: ["Tái đào tạo kỹ năng (Upskilling)", "Tối ưu hóa quy trình làm việc lai (Human-in-the-loop)"],
        projectDeliverable: "Bản kế hoạch dịch chuyển kỹ năng nhân sự khi áp dụng AI"
      }
    ],
    assignment: {
      id: "LAB-004",
      asmNumber: 4,
      title: "Assignment 0.4: Phân Tích Một Tình Huống Thiên Vị Thuật Toán (AI Bias Case Study)",
      durationMinutes: 40,
      summary: "Đọc nghiên cứu tình huống về một thuật toán tuyển dụng tự động loại bỏ hồ sơ ứng viên nữ do dữ liệu quá khứ chủ yếu là nam giới. Đề xuất 3 giải pháp kỹ thuật và quy trình để đảm bảo tính công bằng (Fairness).",
      deliverables: [
        "Phân tích nguyên nhân gốc rễ dẫn đến thiên vị trong tập dữ liệu",
        "3 giải pháp can thiệp (Cân bằng dữ liệu, Ẩn danh hóa thông tin cá nhân, Giám sát con người)"
      ]
    },
    topics: [
      {
        title: "1. AI Có Lấy Mất Việc Làm Không? Chuyển Dịch Nghề Nghiệp & Thích Nghi",
        description: "Lịch sử chứng minh máy móc không triệt tiêu việc làm mà thay đổi bản chất của công việc. Những công việc lặp đi lặp lại, sao chép văn bản, nhập liệu đơn giản sẽ dần được tự động hóa. Đổi lại, hàng loạt cơ hội nghề nghiệp mới bùng nổ: Kỹ sư AI, Kỹ sư câu lệnh (Prompt Engineer), Chuyên gia phân tích dữ liệu, Cố vấn đạo đức AI. Châm ngôn của thời đại số: 'AI không thay thế con người, nhưng người biết dùng AI sẽ thay thế người không biết dùng AI'.",
        codeSnippet: {
          language: "markdown",
          title: "Bản Đồ Chuyển Dịch Kỹ Năng Thời Đại AI",
          code: `[Kỹ Năng Dễ Bị Tự Động Hóa]        ──► [Kỹ Năng Có Giá Trị Cao Hơn]
• Nhập liệu thủ công                  • Tư duy phản biện & Đặt câu hỏi đúng
• Dịch thuật từ ngữ cơ bản            • Khả năng kiểm chứng độ tin cậy
• Viết báo cáo thống kê đơn điệu      • Kỹ năng ra quyết định chiến lược & Thấu cảm`
        }
      },
      {
        title: "2. AI Có Cảm Xúc Không? Ranh Giới Ý Thức Giữa Máy Móc Và Con Người",
        description: "Khi trò chuyện với ChatGPT, đôi khi chúng ta cảm giác như đang nói chuyện với một người bạn biết lắng nghe. Nhưng về bản chất kỹ thuật, AI không hề có cảm xúc, không có niềm vui, nỗi buồn hay sự thấu cảm. AI chỉ nhận diện mẫu giọng nói, phân tích từ ngữ biểu cảm và phản hồi lại câu từ phù hợp nhất dựa trên xác suất toán học. AI có thể hỗ trợ chăm sóc người già hay tư vấn sơ khởi, nhưng sự gắn kết tâm hồn chân thành mãi mãi là đặc quyền của con người.",
        codeSnippet: {
          language: "markdown",
          title: "Sự Khác Biệt Cốt Lõi: Mô Phỏng vs Cảm Nhận Thực Tế",
          code: `• Con người: Trải nghiệm nỗi đau ──► Sinh ra cảm xúc ──► Chia sẻ thấu cảm
• Mô hình AI: Nhận chuỗi từ "tôi buồn" ──► Tra cứu phân bổ từ an ủi ──► Sinh văn bản động viên`
        }
      },
      {
        title: "3. Quyền Riêng Tư, Thiên Vị Thuật Toán & Tương Lai Cộng Tác Người + AI",
        description: "Mô hình AI học từ dữ liệu do con người tạo ra, do đó nếu dữ liệu quá khứ chứa định kiến thì AI sẽ nhân bản sự thiên vị đó (ví dụ: AI nhận diện khuôn mặt người da màu kém chính xác do tập ảnh mẫu thiếu đa dạng). Tương lai của AI không phải là cuộc chiến đối đầu mà là mô hình 'Human-in-the-loop' (Người + Máy cộng tác): Con người định hướng đạo đức, sáng tạo ý tưởng và ra quyết định cuối cùng; AI đảm nhận việc tính toán thần tốc và tự động hóa tác vụ.",
        codeSnippet: {
          language: "markdown",
          title: "Nguyên Tắc Cộng Tác Vàng (Human + AI Collaboration)",
          code: `[Con Người] : Đặt đầu bài chiến lược + Thiết lập ranh giới đạo đức + Thẩm định
     ▲
     │ (Giao tiếp qua Prompt & API)
     ▼
   [ AI ]   : Xử lý dữ liệu lớn + Đề xuất phương án + Tự động hóa tác vụ nặng`
        }
      }
    ]
  },

  // =========================================================================
  // CHUYÊN ĐỀ 0.5: TOOLKIT & LỘ TRÌNH 5 BƯỚC CHO NGƯỜI MỚI (PHỤ LỤC SÁCH)
  // =========================================================================
  {
    id: "MOD-05",
    moduleNumber: 5,
    levelCode: "L0",
    title: "Chuyên Đề 0.5 • Từ Điển Thuật Ngữ Vàng, Bộ Công Cụ Thực Hành & Lộ Trình 5 Bước Tự Học",
    tag: "Toolkit & Roadmap",
    levelTag: "Level 0 • AI for Everyone",
    bloomTaxonomy: "Apply & Create",
    targetAudience: "Học Viên Muốn Chuyển Đổi Thực Hành Ngay Lập Tức Lên Level 1 SFIA",
    startingFor: "NONTECH" as const,
    description: "Bộ hành trang thực chiến đầy đủ nhất từ Phụ lục sách: Bảng tra cứu 12 thuật ngữ vàng không thể không biết, danh mục các công cụ AI miễn phí hàng đầu thế giới (ChatGPT, Midjourney, DeepL, Google Colab) và Lộ trình 5 bước vững chắc đưa bạn từ L0 trở thành Kiến Trúc Sư AI.",
    crossFunctionalRoles: [
      {
        role: "UNIVERSAL",
        roleName: "Tất Cả Học Viên",
        skillsRequired: ["Sử dụng thành thạo công cụ AI văn phòng", "Thực hành Google Colab cơ bản", "Định hình lộ trình học cá nhân"],
        projectDeliverable: "Bản kế hoạch hành động 30 ngày tự học AI với mục tiêu đo lường được"
      }
    ],
    assignment: {
      id: "LAB-005",
      asmNumber: 5,
      title: "Assignment 0.5: Thiết Lập Tài Khoản & Chạy Thử Nghiệm Google Colab Python AI Đầu Tiên",
      durationMinutes: 30,
      summary: "Tạo tài khoản Google Colab (môi trường máy chủ đám mây miễn phí có GPU của Google), chạy thử nghiệm đoạn mã gọi API hoặc tính toán ma trận đơn giản để sẵn sàng bước vào Level 1.",
      deliverables: [
        "Link hoặc ảnh chụp màn hình sổ tay Google Colab đã chạy thành công",
        "Danh sách 3 mục tiêu bạn muốn giải quyết khi học tiếp lên Level 1 SFIA"
      ]
    },
    topics: [
      {
        title: "1. Bảng Tra Cứu Nhanh 10+ Thuật Ngữ AI Cốt Lõi (AI Pocket Glossary)",
        description: "Nắm vững các thuật ngữ nền tảng: AI (Trí tuệ nhân tạo), ML (Học máy), Deep Learning (Học sâu), Neural Network (Mạng nơ-ron), NLP (Xử lý ngôn ngữ tự nhiên), Computer Vision (Thị giác máy tính), Generative AI (AI tạo sinh), Hallucination (Hiện tượng ảo giác), Prompt (Câu lệnh đầu vào), Bias (Thiên vị thuật ngữ).",
        codeSnippet: {
          language: "markdown",
          title: "Sổ Tay Thuật Ngữ Nhỏ (AI Quick Dictionary)",
          code: `• Generative AI : AI có khả năng sáng tạo nội dung mới (chữ, hình, âm thanh).
• Context Window: Giới hạn bộ nhớ tạm thời mà mô hình có thể đọc trong 1 lần.
• Token         : Đơn vị từ ngữ nhỏ nhất mà mô hình AI đọc và hiểu.
• Hallucination : Khi AI tự tin bịa ra thông tin sai lệch không có thật.
• Prompt        : Lời hướng dẫn hoặc câu hỏi bạn giao cho AI xử lý.`
        }
      },
      {
        title: "2. Danh Mục Các Công Cụ AI Miễn Phí & Uy Tín Dành Cho Người Mới",
        description: "Khám phá hệ sinh thái công cụ: (1) Trợ lý văn bản & lập trình: ChatGPT, Claude, Microsoft Copilot; (2) Thiết kế đồ họa: DALL-E, Midjourney, Canva Magic; (3) Dịch thuật & Viết lách: DeepL Translator, Grammarly; (4) Nền tảng học tập & thực hành code đám mây: Google Colab, Hugging Face Hub (kho lưu trữ hàng trăm nghìn mô hình AI nguồn mở).",
        codeSnippet: {
          language: "markdown",
          title: "Top 4 Công Cụ Bắt Đầu Không Cần Cài Đặt Phức Tạp",
          code: `1. Google Colab (colab.research.google.com): Viết code Python có GPU miễn phí ngay trên trình duyệt.
2. Hugging Face (huggingface.co): Trải nghiệm các mô hình AI mã nguồn mở hàng đầu thế giới.
3. ChatGPT / Claude: Trợ lý tư duy và đối thoại kỹ thuật hàng ngày.
4. DeepL (deepl.com): Dịch tài liệu công nghệ chính xác vượt trội.`
        }
      },
      {
        title: "3. Lộ Trình 5 Bước Vững Chắc: Từ L0 Đến Kiến Trúc Sư AI (Chuyển Tiếp Level 1)",
        description: "Lộ trình 5 bước chuẩn mực do Prof Happy đề xuất: Bước 1: Hiểu vững khái niệm căn bản (đã hoàn thành tại Level 0); Bước 2: Thực hành thuần thục các công cụ AI sẵn có; Bước 3: Học lập trình Python cho AI (Bắt đầu tại Level 1 SFIA); Bước 4: Theo dõi xu hướng & tham gia cộng đồng mã nguồn mở; Bước 5: Tự tay xây dựng sản phẩm AI thực chiến (RAG Bot, Multi-Agent). Hãy tự tin bước tiếp vào Level 1!",
        codeSnippet: {
          language: "markdown",
          title: "5 Bước Tiến Hóa Lên Kiến Trúc Sư AI Thực Chiến",
          code: `[Bước 1: Hiểu Khái Niệm] ──► Hoàn thành Level 0 (AI for Everyone)
  ▼
[Bước 2: Dùng Công Cụ]   ──► Khai thác ChatGPT, Midjourney, Prompt cơ bản
  ▼
[Bước 3: Lập Trình AI]   ──► Bắt đầu Level 1 (Python, Token BPE, Strict Grounding)
  ▼
[Bước 4: Nâng Cấp Hệ Thống]──► Lên Level 2 - 3 (FastAPI, Qdrant Vector DB, Enterprise RAG)
  ▼
[Bước 5: Đỉnh Cao Kiến Trúc]──► Level 4 (Multi-Agent LangGraph, Fine-Tuning LoRA)`
        }
      }
    ]
  },

  // =========================================================================
  // CHUYÊN ĐỀ 0.6: ĐẠO ĐỨC NGƯỜI DÙNG AI TRONG NỀN GIÁO DỤC 5.0
  // Nghiên cứu khoa học: JTE (Tạp chí Khoa học Giáo dục Kỹ thuật - ĐH SPKT TP.HCM 2025)
  // Tác giả: ThS. Bùi Minh Thuận
  // =========================================================================
  {
    id: "MOD-06",
    moduleNumber: 6,
    levelCode: "L0",
    title: "Chuyên Đề 0.6 • Đạo Đức Người Dùng AI Trong Nền Giáo Dục 5.0: Triết Lý Lấy Con Người Làm Trung Tâm",
    tag: "Đạo Đức Giáo Dục 5.0",
    levelTag: "Level 0 • AI for Everyone",
    bloomTaxonomy: "Analyze & Evaluate",
    targetAudience: "Người Dạy, Người Học, Nhà Quản Lý Giáo Dục, Phụ Huynh & Chuyên Viên Công Nghệ",
    startingFor: "NONTECH" as const,
    description: "Chuyển dịch từ Giáo dục 4.0 (lấy công nghệ làm trung tâm) sang Giáo dục 5.0 (lấy con người làm trung tâm - Human-Centered). Phân tích 4 rủi ro đạo đức lớn của AI: Quyền riêng tư (Privacy), Giám sát (Surveillance), Sự thiên vị (Bias) và Sự tự trị (Autonomy). Tìm hiểu 3 cấp độ trao quyền quyết định cho AI: Hỗ trợ (Assisted), Tăng cường (Augmented) và Tự chủ (Autonomous).",
    crossFunctionalRoles: [
      {
        role: "PM_BA",
        roleName: "Nhà Quản Lý & Giáo Viên",
        skillsRequired: ["Định hình triết lý Giáo dục 5.0", "Xây dựng quy tắc ứng xử AI trong lớp học", "Kiểm soát ranh giới giám sát số"],
        projectDeliverable: "Bản quy chế chuẩn mực sử dụng AI có trách nhiệm (AI Code of Conduct) cho trường học/tổ chức"
      },
      {
        role: "UNIVERSAL",
        roleName: "Người Học & Phụ Huynh",
        skillsRequired: ["Bảo vệ quyền riêng tư học đường", "Tránh phụ thuộc mất tính tự trị", "Nhận diện rủi ro mạo danh giọng nói/deepfake"],
        projectDeliverable: "Checklist 6 bước bảo vệ dữ liệu cá nhân của học viên trước hệ thống AI giám sát"
      }
    ],
    assignment: {
      id: "LAB-006",
      asmNumber: 6,
      title: "Assignment 0.6: Phân Tích Kịch Bản Trao Quyền Ra Quyết Định Cho AI Trong Đánh Giá Năng Lực",
      durationMinutes: 45,
      summary: "Đọc tình huống một trường học sử dụng AI tự động chấm điểm và xếp loại học sinh. Phân tích xem hệ thống này đang ở cấp độ nào (Assisted, Augmented hay Autonomous), chỉ ra các rủi ro về thiên vị dữ liệu và thiết lập cơ chế can thiệp của con người (Human-in-the-loop).",
      deliverables: [
        "Bảng so sánh 3 cấp độ trao quyền: Hỗ trợ vs Tăng cường vs Tự chủ trong tình huống",
        "Sơ đồ quy trình phê duyệt: Giáo viên giữ quyền phán quyết cuối cùng đối với kết quả do AI gợi ý"
      ]
    },
    topics: [
      {
        title: "1. Bước Chuyển Dịch Sang Giáo Dục 5.0: Lấy Con Người Làm Trung Tâm (Human-Centered)",
        description: "Khái niệm Xã hội 5.0 / Giáo dục 5.0 bắt nguồn từ Nhật Bản năm 2016. Nếu Giáo dục 4.0 lấy công nghệ làm trung tâm (Technology-Centered), coi AI như công cụ tối ưu hóa năng suất thì Giáo dục 5.0 chuyển mình lấy con người làm trung tâm (Human-Centered): Công nghệ phục vụ cho hạnh phúc, sự phát triển toàn diện và giá trị nhân văn của người học. Sự cá nhân hóa trong giáo dục 5.0 phải đi đôi với sự tôn trọng phẩm giá và tinh thần trách nhiệm.",
        codeSnippet: {
          language: "markdown",
          title: "So Sánh Triết Lý: Giáo Dục 4.0 vs Giáo Dục 5.0",
          code: `┌────────────────────────────┬────────────────────────────────────────────────────────┐
│ Nền Giáo Dục               │ Triết Lý Trọng Tâm & Phương Thức Tiếp Cận               │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Giáo dục 4.0 (Technology)  │ • Công nghệ làm trung tâm, số hóa bài giảng, tự động hóa│
│                            │ • Tập trung vào hạ tầng và năng suất kỹ thuật           │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Giáo dục 5.0 (Human-First) │ • Con người làm trung tâm (Human-Centered)              │
│                            │ • Tích hợp công nghệ hiện đại với tính nhân văn đạo đức│
│                            │ • Phát triển tư duy phản biện, sáng tạo & sự thấu cảm  │
└────────────────────────────┴────────────────────────────────────────────────────────┘`
        }
      },
      {
        title: "2. Mô Hình 4 Rủi Ro Đạo Đức & Xã Hội Của AI (Sandel & Akgun-Greenhow)",
        description: "Các nhà nghiên cứu đạo đức tại Harvard (Michael Sandel) và Michigan State (Akgun & Greenhow) đã chỉ ra 4 rủi ro cốt lõi khi nhúng AI vào giáo dục: (1) Quyền riêng tư (Privacy): Dữ liệu cá nhân, giọng nói bị thu thập mập mờ, nguy cơ tống tiền mạo danh; (2) Sự giám sát (Surveillance): Camera AI theo dõi từng cử chỉ ánh mắt khiến người học cảm thấy bị kiểm soát và mất động lực tự thân; (3) Thiên vị & Phân biệt đối xử (Bias & Discrimination): Thuật toán học từ dữ liệu quá khứ sai lệch dẫn đến bất công giới tính/chủng tộc; (4) Sự tự trị (Autonomy): Người dùng ủy quyền mù quáng cho máy móc, đánh mất khả năng phán đoán độc lập của con người.",
        codeSnippet: {
          language: "markdown",
          title: "Bản Đồ 4 Trụ Cột Rủi Ro Đạo Đức Của AI Trong Giáo Dục",
          code: `                  ┌────────────────────────────────────────┐
                  │ 4 RỦI RO ĐẠO ĐỨC AI TRONG GIÁO DỤC 5.0  │
                  └───────────────────┬────────────────────┘
                                      │
         ┌─────────────────┬──────────┴──────────┬─────────────────┐
         ▼                 ▼                     ▼                 ▼
   [QUYỀN RIÊNG TƯ]  [SỰ GIÁM SÁT]         [SỰ THIÊN VỊ]     [SỰ TỰ TRỊ]
   Lộ dữ liệu cá     Kiểm soát hành        Chênh lệch hệ     Ủy quyền mù quáng,
   nhân, deepfake    vi, giảm động lực     thống, bất công   đánh mất năng lực
   mạo danh giọng nói học tập tự do        giới tính/chủng tộc phán đoán con người`
        }
      },
      {
        title: "3. Ba Cấp Độ Trao Quyền Cho AI: Hỗ Trợ, Tăng Cường & Tự Chủ",
        description: "Mức độ can thiệp của AI vào quá trình ra quyết định được chia thành 3 bậc: (1) Hỗ trợ (Assisted AI): Chỉ thực hiện tác vụ hành chính giản đơn, không tác động quyết định (như lên lịch thi, chuyển văn bản thành giọng nói); (2) Tăng cường (Augmented AI): Cung cấp số liệu phân tích, chỉ ra điểm mạnh/yếu để con người tham khảo nhưng quyền quyết định cuối cùng vẫn thuộc về giáo viên/nhà quản lý — đây là cấp độ an toàn và khuyến nghị nhất hiện nay; (3) Tự chủ (Autonomous AI): AI tự ra quyết định độc lập không cần con người giám sát — cấp độ này tiềm ẩn rủi ro cực lớn và chưa được phép áp dụng trong giáo dục.",
        codeSnippet: {
          language: "markdown",
          title: "Thang Đo 3 Cấp Độ Quyết Định: Augmented AI Là Điểm Cân Bằng",
          code: `[1. Hỗ Trợ (Assisted)]   ──► Làm chân chạy hành chính, nhắc lịch, format văn bản
  ▼
[2. Tăng Cường (Augmented)]──► Gợi ý lộ trình, phát hiện điểm yếu ◄── [KHUYẾN NGHỊ CHO GIÁO DỤC 5.0]
                              (Con người là người ra phán quyết cuối cùng!)
  ▼
[3. Tự Chủ (Autonomous)] ──► AI tự cho đỗ/trượt, tự đuổi học ◄── [NGHIÊM CẤM TRONG NHÀ TRƯỜNG]`
        }
      }
    ]
  },

  // =========================================================================
  // CHUYÊN ĐỀ 0.7: CHÂN DUNG CÔNG DÂN SỐ & PHƯƠNG PHÁP THỰC HÀNH AI CÓ TRÁCH NHIỆM
  // Nghiên cứu khoa học: JTE 2025, Chiến lược AI Quốc gia Việt Nam & UNESCO RAM
  // =========================================================================
  {
    id: "MOD-07",
    moduleNumber: 7,
    levelCode: "L0",
    title: "Chuyên Đề 0.7 • Chân Dung Công Dân Số, Nguyên Tắc THINK & Khung Đạo Đức UNESCO / Việt Nam",
    tag: "Công Dân Số & Hành Động",
    levelTag: "Level 0 • AI for Everyone",
    bloomTaxonomy: "Apply & Create",
    targetAudience: "Học Viên Muốn Trở Thành Công Dân Số Chuẩn Mực, Nghiên Cứu Sinh & Nhà Thực Hành AI",
    startingFor: "NONTECH" as const,
    description: "Trang bị bộ 8 phẩm chất và 6 nhiệm vụ của một công dân số chuẩn mực theo mô hình quốc tế (Endang Wulandari & Hadi Partovi). Ứng dụng quy tắc giao tiếp đạo đức số THINK. Cập nhật Chiến lược quốc gia về AI của Việt Nam (Bộ KH&CN) và Khung đánh giá mức độ sẵn sàng đạo đức AI (RAM - Readiness Assessment Methodology) của UNESCO.",
    crossFunctionalRoles: [
      {
        role: "QA_SECURITY",
        roleName: "Chuyên Viên An Ninh Số & Đạo Đức",
        skillsRequired: ["Áp dụng khung UNESCO RAM", "Quy tắc kiểm tra tính toàn vẹn học thuật", "Phát hiện đạo văn và deepfake"],
        projectDeliverable: "Bản quy chuẩn kiểm tra tính chính trực học thuật (Academic Integrity Policy) trong thời đại AI"
      },
      {
        role: "UNIVERSAL",
        roleName: "Mọi Công Dân Số",
        skillsRequired: ["Thực hành nguyên tắc THINK trước khi chia sẻ", "Xác thực nguồn tin Fact-check", "Tôn trọng sở hữu trí tuệ"],
        projectDeliverable: "Cam kết hành vi văn hóa mạng và quy tắc sử dụng AI trung thực trong học tập"
      }
    ],
    assignment: {
      id: "LAB-007",
      asmNumber: 7,
      title: "Assignment 0.7: Thực Hành Đánh Giá Tính Toàn Vẹn Học Thuật & Bộ Nguyên Tắc THINK",
      durationMinutes: 40,
      summary: "Áp dụng khung nguyên tắc THINK (True - Helpful - Inspiring - Necessary - Kind) để đánh giá 3 bài viết được tạo tự động bởi AI trên mạng xã hội. Soạn thảo hướng dẫn trích dẫn nguồn minh bạch khi sử dụng nội dung do AI hỗ trợ.",
      deliverables: [
        "Bảng chấm điểm 3 bài viết AI theo 5 tiêu chí của nguyên tắc THINK",
        "Mẫu quy chuẩn trích dẫn nguồn AI (Citation guideline) chuẩn mực cho bài tập/báo cáo"
      ]
    },
    topics: [
      {
        title: "1. Chân Dung 8 Phẩm Chất Cốt Lõi Của Công Dân Số (Endang Wulandari, 2021)",
        description: "Để hòa nhập xã hội và giáo dục 5.0, một công dân số cần hội tụ 8 giá trị vàng: (1) Kiến thức công nghệ: Hiểu và biết dùng công cụ; (2) Tinh thần trách nhiệm: Tuân thủ quy tắc và chuẩn mực số; (3) Sự thành thật: Xác thực tin tức, không chia sẻ tin giả; (4) Tư duy phản biện: Đặt câu hỏi nghi vấn dữ liệu AI cung cấp; (5) Giải quyết vấn đề: Vận dụng công nghệ giải quyết khó khăn đời sống; (6) Sự sáng tạo: Đạt tới nấc thang cao nhất của tháp Bloom; (7) Sự bình đẳng: Tôn trọng quyền của người khác trên không gian mạng; (8) Kiến thức địa phương: Bảo tồn bản sắc và đạo đức văn hóa bản địa.",
        codeSnippet: {
          language: "markdown",
          title: "Bảng 8 Giá Trị Vàng Của Công Dân Số Thời Đại 5.0",
          code: `1. Kiến thức công nghệ  ──► Khả năng sử dụng và cập nhật công cụ AI mới
2. Tinh thần trách nhiệm──► Chịu trách nhiệm về hành vi và lời nói trực tuyến
3. Sự thành thật         ──► Xác nhận tính xác thực, không lan truyền tin giả
4. Tư duy phản biện     ──► Thẩm định dữ kiện từ AI, không tin tưởng mù quáng
5. Giải quyết vấn đề    ──► Sử dụng công nghệ để vượt qua thử thách
6. Sự sáng tạo          ──► Trí tuệ bậc cao tháp Bloom: Phân tích -> Đánh giá -> Sáng tạo
7. Sự bình đẳng         ──► Mọi người đều có vị trí và quyền như nhau trên môi trường số
8. Kiến thức địa phương ──► Kết hợp đạo đức văn hóa nơi sinh sống vào không gian số`
        }
      },
      {
        title: "2. Nguyên Tắc THINK & 6 Nhiệm Vụ Đạo Đức Khi Ứng Dụng AI (Hadi Partovi, 2024)",
        description: "Khi tương tác trên không gian mạng và sử dụng AI, công dân số thực hành nguyên tắc 'THINK - Suy nghĩ' trước khi phát ngôn hoặc đăng tải: T (True - Có đúng sự thật không?), H (Helpful - Có giúp ích không?), I (Inspiring - Có truyền cảm hứng không?), N (Necessary - Có cần thiết không?), K (Kind - Có tử tế và tôn trọng không?). Đồng thời tuân thủ 6 nhiệm vụ: Kết nối AI với mục tiêu giáo dục, Tuân thủ chính sách bảo mật, Thúc đẩy hiểu biết số, Giữ vững tính toàn vẹn học thuật (chống đạo văn), Con người luôn can thiệp quá trình ra quyết định, và Định kỳ đánh giá tác động của AI.",
        codeSnippet: {
          language: "markdown",
          title: "Nguyên Tắc THINK: Bộ Lọc Đạo Đức Trước Khi Gửi Dữ Liệu Lên Mạng",
          code: `T - Is it TRUE?        (Thông tin này đã được kiểm chứng nguồn chưa?)
H - Is it HELPFUL?     (Nội dung này có mang lại giá trị cho cộng đồng không?)
I - Is it INSPIRING?   (Có tính xây dựng và khích lệ người khác không?)
N - Is it NECESSARY?   (Có thực sự cần thiết phải chia sẻ hay chỉ là spam?)
K - Is it KIND?        (Có tôn trọng danh dự và quyền riêng tư của người khác không?)`
        }
      },
      {
        title: "3. Chiến Lược AI Quốc Gia Việt Nam & Khung Đánh Giá Đạo Đức UNESCO (RAM)",
        description: "Tại Việt Nam, Bộ KH&CN chủ trì triển khai Chiến lược quốc gia về nghiên cứu, phát triển và ứng dụng AI. Thứ trưởng Bộ KH&CN khẳng định: 'Đạo đức và trách nhiệm trong AI nằm ở tất cả các khâu, từ xây dựng thuật toán, thu thập dữ liệu đến công cụ huấn luyện'. Việt Nam đang tiên phong phối hợp với UNESCO thử nghiệm công cụ RAM (Readiness Assessment Methodology) để đo lường mức độ sẵn sàng về thể chế, hạ tầng và nguồn nhân lực đạo đức. Các trường đại học (Fulbright, ĐHQG Hà Nội, Sư phạm) đã đưa đạo đức AI vào chương trình đào tạo chính quy.",
        codeSnippet: {
          language: "markdown",
          title: "3 Khuyến Nghị Hành Động Cho Người Dạy & Người Học Tại Việt Nam",
          code: `• Với Người Dạy: Làm gương về đạo đức số, tích hợp đạo đức AI vào môn học, dạy học sinh 
                 nhận diện thiên vị và bảo vệ dữ liệu cá nhân.
• Với Người Học: Nâng cao tư duy phản biện, kiểm chứng thông tin từ AI, có ý thức tự bảo mật 
                 dữ liệu cá nhân, sử dụng AI với tinh thần trung thực học thuật.
• Với Tổ Chức : Áp dụng phương pháp đánh giá mức độ sẵn sàng RAM theo khuyến nghị UNESCO.`
        }
      }
    ]
  }
];

