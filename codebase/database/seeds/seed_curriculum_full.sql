-- =========================================================================
-- SEED: SEED_CURRICULUM_FULL.SQL
-- DU LIEU TOAN BO 13 CHUYEN DE SFIA (L0 - L4) VA BAI HOC CHI TIET
-- =========================================================================

-- MODULE 1: Chuyên Đề 0.1 • Bản Chất AI, Giải Mã Nỗi Sợ & Lịch Sử Tiến Hóa Từ Thần Thoại Đến GPT
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000001', 1, 'Chuyên Đề 0.1 • Bản Chất AI, Giải Mã Nỗi Sợ & Lịch Sử Tiến Hóa Từ Thần Thoại Đến GPT', 'chuyen-de-0-1-ban-chat-ai-giai-ma-noi-so-lich-su-tien-hoa-tu-than-thoai-den-gpt', 'Khám phá bản chất thật của Trí tuệ nhân tạo: AI là gì, có đáng sợ như phim viễn tưởng không? Điểm lại hành trình lịch sử từ bức tượng đồng Talos thời Hy Lạp, bài kiểm tra Turing, Deep Blue, AlphaGo đến kỷ nguyên bùng nổ của Generative AI.', 'L0', 'Remember & Understand', 30, '20% AI - 80% Human', '# Tư duy lập trình truyền thống (Rule-based): Con người viết sẵn luật
def rule_based_filter(email_text):
    spam_keywords = ["trúng thưởng", "nhận quà ngay", "miễn phí 100%"]
    for word in spam_keywords:
        if word in email_text.lower():
            return "SPAM (Phát hiện theo từ khóa cứng)"
    return "INBOX (Email an toàn)"

# Tư duy AI (Machine Learning): Máy tự học trọng số xác suất từ dữ liệu
print(rule_based_filter("Chúc mừng bạn đã trúng thưởng chuyến du lịch!"))
# AI hiện đại phân tích ngữ cảnh sâu hơn thay vì chỉ nhìn từ khóa đơn lẻ!', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000001', 'a11a0000-0000-0000-0000-000000000001', 1, '1. AI Là Gì? AI Có Thực Sự Đáng Sợ Hay Thống Trị Con Người?', '1-ai-la-gi-ai-co-thuc-su-dang-so-hay-thong-tri-con-nguoi', 'Trí tuệ nhân tạo (AI - Artificial Intelligence) đơn giản là khả năng của máy tính mô phỏng trí tuệ con người để giải quyết vấn đề cụ thể. Phim ảnh viễn tưởng (Terminator, Matrix) thường mô tả AI có ý thức và thù địch, nhưng thực tế AI ngày nay hoàn toàn là ''AI Hẹp'' (Narrow AI) — cỗ máy giải toán cực nhanh theo các quy luật thống kê xác suất, không có cảm xúc, không có ý thức tự chủ và luôn nằm dưới sự kiểm soát của con người. Thay vì sợ hãi, chúng ta nên coi AI là người đồng minh đắc lực giúp nâng cao hiệu suất.', 45, '# Tư duy lập trình truyền thống (Rule-based): Con người viết sẵn luật
def rule_based_filter(email_text):
    spam_keywords = ["trúng thưởng", "nhận quà ngay", "miễn phí 100%"]
    for word in spam_keywords:
        if word in email_text.lower():
            return "SPAM (Phát hiện theo từ khóa cứng)"
    return "INBOX (Email an toàn)"

# Tư duy AI (Machine Learning): Máy tự học trọng số xác suất từ dữ liệu
print(rule_based_filter("Chúc mừng bạn đã trúng thưởng chuyến du lịch!"))
# AI hiện đại phân tích ngữ cảnh sâu hơn thay vì chỉ nhìn từ khóa đơn lẻ!', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000002', 'a11a0000-0000-0000-0000-000000000001', 2, '2. Lịch Sử Phát Triển AI: Từ Thần Thoại Hy Lạp Đến Cuộc Cách Mạng GPT', '2-lich-su-phat-trien-ai-tu-than-thoai-hy-lap-den-cuoc-cach-mang-gpt', 'Hành trình AI không xuất hiện sau một đêm: (1) Thời cổ đại: Ước mơ về cỗ máy biết nghĩ trong thần thoại Talos bảo vệ đảo Crete; (2) Thế kỷ 17: René Descartes đặt nền móng triết học về mô phỏng tư duy; (3) Năm 1837: Charles Babbage & Ada Lovelace thiết kế cỗ máy phân tích và thuật toán đầu tiên; (4) Năm 1950: Alan Turing đề xuất Turing Test; (5) Năm 1956: Thuật ngữ ''Artificial Intelligence'' chính thức ra đời tại hội nghị Dartmouth; (6) 1997: Deep Blue thắng Kasparov; (7) 2016: AlphaGo thắng cờ vây; (8) 2023 - nay: Bùng nổ GPT-4, Gemini, DALL-E.', 45, '[1837] Cỗ máy cơ khí (Ada Lovelace) ──► [1950] Turing Test (Alan Turing)
──► [1956] Khai sinh thuật ngữ AI (Dartmouth)
──► [1997] IBM Deep Blue vô địch Cờ vua
──► [2016] Google DeepMind AlphaGo vô địch Cờ vây
──► [2023+] Kỷ nguyên Generative AI (ChatGPT, DALL-E, Claude, DeepSeek)', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000003', 'a11a0000-0000-0000-0000-000000000001', 3, '3. AI Hoạt Động Như Thế Nào? Máy Học (ML) vs Học Sâu (Deep Learning)', '3-ai-hoat-dong-nhu-the-nao-may-hoc-ml-vs-hoc-sau-deep-learning', 'AI không phải phép màu hay ma thuật — cốt lõi của nó là Toán học và Dữ liệu. Học máy (Machine Learning) là nhánh máy tính tự rút ra quy luật từ dữ liệu mẫu mà không cần lập trình thủ công từng dòng if-else. Học sâu (Deep Learning) tiến thêm một bước khi xây dựng Mạng Nơ-ron Nhân Tạo (Neural Networks) nhiều tầng mô phỏng cách truyền tín hiệu synap trong não người, giúp máy xử lý xuất sắc các dữ liệu phi cấu trúc như hình ảnh, giọng nói và ngôn ngữ tự nhiên.', 45, '# Ví dụ trực quan: Dự đoán giá bán căn nhà dựa trên diện tích
# y = w * x + b (w: trọng số máy học được, b: độ lệch sai số)
def predict_house_price(area_sqm, weight=50.0, bias=100.0):
    """
    area_sqm: Diện tích (m2)
    weight: Giá trị trung bình mỗi m2 (triệu VNĐ)
    bias: Chi phí cơ sở hạ tầng cố định
    """
    predicted_price = (area_sqm * weight) + bias
    return f"Giá dự kiến: {predicted_price:,.0f} Triệu VNĐ"

print(predict_house_price(75)) # Căn hộ 75m2 -> 3,850 Triệu VNĐ', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 2: Chuyên Đề 0.2 • Toàn Cảnh Ứng Dụng AI Trong Đời Sống, Y Tế, Giáo Dục, Kinh Doanh & Robot
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000002', 2, 'Chuyên Đề 0.2 • Toàn Cảnh Ứng Dụng AI Trong Đời Sống, Y Tế, Giáo Dục, Kinh Doanh & Robot', 'chuyen-de-0-2-toan-canh-ung-dung-ai-trong-doi-song-y-te-giao-duc-kinh-doanh-robot', 'Khám phá bức tranh ứng dụng thực tiễn của AI trên toàn bộ các lĩnh vực trọng yếu: Trợ lý ảo gia đình, thuật toán gợi ý mạng xã hội (TikTok, Facebook), bác sĩ số hóa chẩn đoán ảnh MRI/X-quang, giáo dục thích ứng, tài chính định lượng và 5 cấp độ tự lái của ô tô thông minh.', 'L0', 'Understand & Apply', 30, '20% AI - 80% Human', '[Người Dùng Xem 3 Video Nấu Ăn]
  ──► Thuật toán ghi nhận: Sở thích = "Ẩm thực & Món ngon"
  ──► Trích xuất đặc trưng (Feature Vector): Thời gian dừng xem > 80%
  ──► Đề xuất tiếp theo: Video công thức làm bánh ngọt (Xác suất Click 94%)', 'markdown', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000004', 'a11a0000-0000-0000-0000-000000000002', 1, '1. AI Trong Điện Thoại, Máy Tính & Nhà Thông Minh (Siri, Alexa, TikTok)', '1-ai-trong-dien-thoai-may-tinh-nha-thong-minh-siri-alexa-tiktok', 'AI đã len lỏi vào từng hơi thở cuộc sống qua: (1) Trợ lý giọng nói (Siri, Google Assistant) xử lý lệnh và điều khiển nhà thông minh; (2) Thuật toán gợi ý cá nhân hóa: TikTok và YouTube phân tích hàng trăm tín hiệu (thời gian xem, lượt thích, tốc độ cuộn) để đề xuất video vừa vặn sở thích; (3) Cảnh báo và chống tin giả (Fake News): Hệ thống Computer Vision phát hiện hình ảnh Deepfake và bài đăng vi phạm chính sách.', 45, '[Người Dùng Xem 3 Video Nấu Ăn]
  ──► Thuật toán ghi nhận: Sở thích = "Ẩm thực & Món ngon"
  ──► Trích xuất đặc trưng (Feature Vector): Thời gian dừng xem > 80%
  ──► Đề xuất tiếp theo: Video công thức làm bánh ngọt (Xác suất Click 94%)', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000005', 'a11a0000-0000-0000-0000-000000000002', 2, '2. AI Trong Y Tế & Giáo Dục: Bác Sĩ Số Hóa & Thầy Cô Kỹ Thuật Số', '2-ai-trong-y-te-giao-duc-bac-si-so-hoa-thay-co-ky-thuat-so', 'Trong y tế, mô hình Google Health phân tích ảnh chụp nhũ ảnh (Mammography) phát hiện dấu hiệu ung thư vú sớm với độ chuẩn xác tương đương hoặc cao hơn bác sĩ chuyên khoa; trong đại dịch COVID-19, AI rút ngắn thời gian phân tích cấu trúc protein virus SARS-CoV-2 từ nhiều năm xuống vài tháng. Trong giáo dục, AI mang lại mô hình ''Học tập thích ứng'' (Adaptive Learning) — tự động hạ độ khó khi học viên gặp vướng mắc và tăng tốc bài tập nâng cao khi học viên đã làm chủ kiến thức.', 45, '[Học Viên Làm Bài Quiz]
  ├── Đúng 100% ──► Tự động tăng độ khó & Mở khóa kiến thức nâng cao
  └── Sai 2 câu ──► Kích hoạt Chatbot AI giải thích chi tiết & Giao bài củng cố', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000006', 'a11a0000-0000-0000-0000-000000000002', 3, '3. AI Trong Tài Chính, Xe Tự Hành & Robot Vận Tải (5 Cấp Độ Tự Lái)', '3-ai-trong-tai-chinh-xe-tu-hanh-robot-van-tai-5-cap-do-tu-lai', 'Trong tài chính, các quỹ đầu tư định lượng (Quants) phân tích hàng triệu tin tức để bắt tín hiệu giao dịch trong mili-giây, trong khi hệ thống chống gian lận thẻ tín dụng chặn đứng giao dịch bất thường theo thời gian thực. Trong giao thông, tiêu chuẩn SAE chia xe tự lái thành 5 cấp độ: Từ Cấp 1 (Hỗ trợ giữ làn) đến Cấp 5 (Xe hoàn toàn không cần vô lăng, chân ga). Tại các kho hàng Amazon, hàng vạn robot tự hành vận chuyển kiện hàng giúp tăng năng suất gấp 3 lần.', 45, '• Cấp 1: Hỗ trợ tài xế (Cruise Control cơ bản)
• Cấp 2: Tự động một phần (Tự giữ làn + Thắng khẩn cấp)
• Cấp 3: Tự lái có điều kiện (Xe tự lái trên cao tốc, tài xế sẵn sàng can thiệp)
• Cấp 4: Tự động hóa cao (Xe tự vận hành trong khu vực đô thị quy định sẵn)
• Cấp 5: Tự động hóa tuyệt đối (Không cần vô lăng, xe tự quyết định mọi tình huống)', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 3: Chuyên Đề 0.3 • Giải Mã Động Cơ AI: Vòng Đời Dữ Liệu, 3 Trụ Cột Học Máy & Đột Phá Transformer
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000003', 3, 'Chuyên Đề 0.3 • Giải Mã Động Cơ AI: Vòng Đời Dữ Liệu, 3 Trụ Cột Học Máy & Đột Phá Transformer', 'chuyen-de-0-3-giai-ma-dong-co-ai-vong-doi-du-lieu-3-tru-cot-hoc-may-dot-pha-transformer', 'Giải mã bí mật bên dưới cỗ máy AI: Tại sao Dữ liệu được coi là ''dầu mỏ / nhiên liệu'' thế kỷ 21? Phân biệt rõ ràng 3 trường phái: Học có giám sát (Supervised), Học không giám sát (Unsupervised) và Học tăng cường (Reinforcement Learning). Khám phá kiến trúc Transformer — bước nhảy vọt đứng sau GPT, BERT và trào lưu Generative AI.', 'L0', 'Understand & Analyze', 30, '20% AI - 80% Human', '# Dữ liệu thô ban đầu dính lỗi font và trùng lặp
raw_data = ["  Hà Nội ", "SÀI GÒN", "hà nội", "Đà Nẵng", None, " Cần Thơ "]

# Quy trình làm sạch dữ liệu (Data Cleaning)
clean_data = []
for item in raw_data:
    if item is not None:
        standardized = item.strip().title() # Chuẩn hóa viết hoa chữ cái đầu
        if standardized not in clean_data:
            clean_data.append(standardized)

print(f"Dữ liệu sau khi làm sạch: {clean_data}")
# Kết quả: [''Hà Nội'', ''Sài Gòn'', ''Đà Nẵng'', ''Cần Thơ'']', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000007', 'a11a0000-0000-0000-0000-000000000003', 1, '1. Dữ Liệu – ''Nhiên Liệu'' Của AI: Rác Vào Thì Rác Ra (Garbage In, Garbage Out)', '1-du-lieu-nhien-lieu-cua-ai-rac-vao-thi-rac-ra-garbage-in-garbage-out', 'Mô hình AI dù tinh vi đến đâu cũng vô dụng nếu không có dữ liệu huấn luyện. Quy trình 4 bước chuẩn mực: (1) Thu thập dữ liệu (Web, cảm biến, hồ sơ); (2) Làm sạch dữ liệu (Xóa bỏ nhiễu, chuẩn hóa định dạng, loại bỏ bản ghi trùng); (3) Huấn luyện mô hình (Tìm quy luật tương quan); (4) Kiểm tra và đánh giá trên tập dữ liệu chưa từng thấy. Khẩu hiệu vàng của ngành AI: ''Dữ liệu chất lượng cao quan trọng hơn thuật toán phức tạp''.', 45, '# Dữ liệu thô ban đầu dính lỗi font và trùng lặp
raw_data = ["  Hà Nội ", "SÀI GÒN", "hà nội", "Đà Nẵng", None, " Cần Thơ "]

# Quy trình làm sạch dữ liệu (Data Cleaning)
clean_data = []
for item in raw_data:
    if item is not None:
        standardized = item.strip().title() # Chuẩn hóa viết hoa chữ cái đầu
        if standardized not in clean_data:
            clean_data.append(standardized)

print(f"Dữ liệu sau khi làm sạch: {clean_data}")
# Kết quả: [''Hà Nội'', ''Sài Gòn'', ''Đà Nẵng'', ''Cần Thơ'']', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000008', 'a11a0000-0000-0000-0000-000000000003', 2, '2. Ba Trường Phái Học Máy: Học Có Giám Sát, Không Giám Sát & Học Tăng Cường', '2-ba-truong-phai-hoc-may-hoc-co-giam-sat-khong-giam-sat-hoc-tang-cuong', 'Học máy chia làm 3 trụ cột lớn: (1) Học có giám sát (Supervised Learning): Cung cấp đề bài kèm đáp án (Dữ liệu có nhãn) — ví dụ: ảnh chụp kèm nhãn ''Chó'' hoặc ''Mèo''; (2) Học không giám sát (Unsupervised Learning): Chỉ cung cấp dữ liệu thô, máy tự gom nhóm những đối tượng tương đồng — ví dụ: phân cụm nhóm khách hàng mua sắm; (3) Học tăng cường (Reinforcement Learning - RL): Máy học qua cơ chế Thưởng / Phạt — đi đúng được điểm cộng, đi sai bị trừ điểm, giúp AI vô địch Cờ vua và lái xe tự động.', 45, '┌───────────────────────┬──────────────────────────┬─────────────────────────────┐
│ Phương Pháp           │ Dữ Liệu Đầu Vào          │ Ứng Dụng Điển Hình          │
├───────────────────────┼──────────────────────────┼─────────────────────────────┤
│ 1. Có Giám Sát        │ Đã dán nhãn (X + Nhãn Y) │ Phân loại thư rác, Định giá │
│ 2. Không Giám Sát     │ Dữ liệu thô chưa dán nhãn│ Phân cụm khách hàng, Gian lận│
│ 3. Học Tăng Cường     │ Môi trường thử nghiệm    │ AI chơi Cờ vua, Xe tự lái   │
└───────────────────────┴──────────────────────────┴─────────────────────────────┘', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000009', 'a11a0000-0000-0000-0000-000000000003', 3, '3. Đột Phá Kiến Trúc Transformer: Bí Mật Đằng Sau GPT, BERT & Generative AI', '3-dot-pha-kien-truc-transformer-bi-mat-dang-sau-gpt-bert-generative-ai', 'Trước năm 2017, máy tính xử lý ngôn ngữ rất chậm theo từng từ nối tiếp. Năm 2017, các nhà nghiên cứu Google công bố kiến trúc Transformer với cơ chế Tự Chú Ý (Self-Attention) mang tính cách mạng: Máy tính có thể đọc toàn bộ câu cùng lúc và hiểu mối liên hệ ngữ cảnh giữa các từ cách xa nhau. Từ đó khai sinh: (1) BERT: Chuyên gia hiểu ngữ cảnh để cải tiến Google Search; (2) GPT: Mô hình sinh văn bản dự đoán từ tiếp theo; (3) DALL-E & Midjourney: AI khuếch tán tạo hình ảnh từ văn bản.', 45, 'Đầu vào: "Mặt trời mọc ở hướng..."
Xác suất phân bổ từ tiếp theo:
  ├── "Đông" : 96.8%  ◄── AI chọn từ có xác suất cao nhất
  ├── "Tây"  : 1.2%
  └── "Bắc"  : 0.1%', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 4: Chuyên Đề 0.4 • Đạo Đức AI, Nguy Cơ Mất Việc, Thiên Vị Dữ Liệu (Bias) & Kỷ Nguyên Người + AI
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000004', 4, 'Chuyên Đề 0.4 • Đạo Đức AI, Nguy Cơ Mất Việc, Thiên Vị Dữ Liệu (Bias) & Kỷ Nguyên Người + AI', 'chuyen-de-0-4-dao-duc-ai-nguy-co-mat-viec-thien-vi-du-lieu-bias-ky-nguyen-nguoi-ai', 'Đối diện trực diện với những câu hỏi hóc búa nhất của thời đại: AI có lấy mất việc làm của bạn không? AI có cảm xúc và đồng cảm thật sự không? Nguy cơ thiên vị dữ liệu (AI Bias), xâm phạm quyền riêng tư số và định hướng phát triển: Con người cộng tác cùng AI thay vì sợ hãi bị thay thế.', 'L0', 'Analyze & Evaluate', 30, '20% AI - 80% Human', '[Kỹ Năng Dễ Bị Tự Động Hóa]        ──► [Kỹ Năng Có Giá Trị Cao Hơn]
• Nhập liệu thủ công                  • Tư duy phản biện & Đặt câu hỏi đúng
• Dịch thuật từ ngữ cơ bản            • Khả năng kiểm chứng độ tin cậy
• Viết báo cáo thống kê đơn điệu      • Kỹ năng ra quyết định chiến lược & Thấu cảm', 'markdown', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000000a', 'a11a0000-0000-0000-0000-000000000004', 1, '1. AI Có Lấy Mất Việc Làm Không? Chuyển Dịch Nghề Nghiệp & Thích Nghi', '1-ai-co-lay-mat-viec-lam-khong-chuyen-dich-nghe-nghiep-thich-nghi', 'Lịch sử chứng minh máy móc không triệt tiêu việc làm mà thay đổi bản chất của công việc. Những công việc lặp đi lặp lại, sao chép văn bản, nhập liệu đơn giản sẽ dần được tự động hóa. Đổi lại, hàng loạt cơ hội nghề nghiệp mới bùng nổ: Kỹ sư AI, Kỹ sư câu lệnh (Prompt Engineer), Chuyên gia phân tích dữ liệu, Cố vấn đạo đức AI. Châm ngôn của thời đại số: ''AI không thay thế con người, nhưng người biết dùng AI sẽ thay thế người không biết dùng AI''.', 45, '[Kỹ Năng Dễ Bị Tự Động Hóa]        ──► [Kỹ Năng Có Giá Trị Cao Hơn]
• Nhập liệu thủ công                  • Tư duy phản biện & Đặt câu hỏi đúng
• Dịch thuật từ ngữ cơ bản            • Khả năng kiểm chứng độ tin cậy
• Viết báo cáo thống kê đơn điệu      • Kỹ năng ra quyết định chiến lược & Thấu cảm', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000000b', 'a11a0000-0000-0000-0000-000000000004', 2, '2. AI Có Cảm Xúc Không? Ranh Giới Ý Thức Giữa Máy Móc Và Con Người', '2-ai-co-cam-xuc-khong-ranh-gioi-y-thuc-giua-may-moc-va-con-nguoi', 'Khi trò chuyện với ChatGPT, đôi khi chúng ta cảm giác như đang nói chuyện với một người bạn biết lắng nghe. Nhưng về bản chất kỹ thuật, AI không hề có cảm xúc, không có niềm vui, nỗi buồn hay sự thấu cảm. AI chỉ nhận diện mẫu giọng nói, phân tích từ ngữ biểu cảm và phản hồi lại câu từ phù hợp nhất dựa trên xác suất toán học. AI có thể hỗ trợ chăm sóc người già hay tư vấn sơ khởi, nhưng sự gắn kết tâm hồn chân thành mãi mãi là đặc quyền của con người.', 45, '• Con người: Trải nghiệm nỗi đau ──► Sinh ra cảm xúc ──► Chia sẻ thấu cảm
• Mô hình AI: Nhận chuỗi từ "tôi buồn" ──► Tra cứu phân bổ từ an ủi ──► Sinh văn bản động viên', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000000c', 'a11a0000-0000-0000-0000-000000000004', 3, '3. Quyền Riêng Tư, Thiên Vị Thuật Toán & Tương Lai Cộng Tác Người + AI', '3-quyen-rieng-tu-thien-vi-thuat-toan-tuong-lai-cong-tac-nguoi-ai', 'Mô hình AI học từ dữ liệu do con người tạo ra, do đó nếu dữ liệu quá khứ chứa định kiến thì AI sẽ nhân bản sự thiên vị đó (ví dụ: AI nhận diện khuôn mặt người da màu kém chính xác do tập ảnh mẫu thiếu đa dạng). Tương lai của AI không phải là cuộc chiến đối đầu mà là mô hình ''Human-in-the-loop'' (Người + Máy cộng tác): Con người định hướng đạo đức, sáng tạo ý tưởng và ra quyết định cuối cùng; AI đảm nhận việc tính toán thần tốc và tự động hóa tác vụ.', 45, '[Con Người] : Đặt đầu bài chiến lược + Thiết lập ranh giới đạo đức + Thẩm định
     ▲
     │ (Giao tiếp qua Prompt & API)
     ▼
   [ AI ]   : Xử lý dữ liệu lớn + Đề xuất phương án + Tự động hóa tác vụ nặng', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 5: Chuyên Đề 0.5 • Từ Điển Thuật Ngữ Vàng, Bộ Công Cụ Thực Hành & Lộ Trình 5 Bước Tự Học
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000005', 5, 'Chuyên Đề 0.5 • Từ Điển Thuật Ngữ Vàng, Bộ Công Cụ Thực Hành & Lộ Trình 5 Bước Tự Học', 'chuyen-de-0-5-tu-dien-thuat-ngu-vang-bo-cong-cu-thuc-hanh-lo-trinh-5-buoc-tu-hoc', 'Bộ hành trang thực chiến đầy đủ nhất từ Phụ lục sách: Bảng tra cứu 12 thuật ngữ vàng không thể không biết, danh mục các công cụ AI miễn phí hàng đầu thế giới (ChatGPT, Midjourney, DeepL, Google Colab) và Lộ trình 5 bước vững chắc đưa bạn từ L0 trở thành Kiến Trúc Sư AI.', 'L0', 'Apply & Create', 30, '20% AI - 80% Human', '• Generative AI : AI có khả năng sáng tạo nội dung mới (chữ, hình, âm thanh).
• Context Window: Giới hạn bộ nhớ tạm thời mà mô hình có thể đọc trong 1 lần.
• Token         : Đơn vị từ ngữ nhỏ nhất mà mô hình AI đọc và hiểu.
• Hallucination : Khi AI tự tin bịa ra thông tin sai lệch không có thật.
• Prompt        : Lời hướng dẫn hoặc câu hỏi bạn giao cho AI xử lý.', 'markdown', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000000d', 'a11a0000-0000-0000-0000-000000000005', 1, '1. Bảng Tra Cứu Nhanh 10+ Thuật Ngữ AI Cốt Lõi (AI Pocket Glossary)', '1-bang-tra-cuu-nhanh-10-thuat-ngu-ai-cot-loi-ai-pocket-glossary', 'Nắm vững các thuật ngữ nền tảng: AI (Trí tuệ nhân tạo), ML (Học máy), Deep Learning (Học sâu), Neural Network (Mạng nơ-ron), NLP (Xử lý ngôn ngữ tự nhiên), Computer Vision (Thị giác máy tính), Generative AI (AI tạo sinh), Hallucination (Hiện tượng ảo giác), Prompt (Câu lệnh đầu vào), Bias (Thiên vị thuật ngữ).', 45, '• Generative AI : AI có khả năng sáng tạo nội dung mới (chữ, hình, âm thanh).
• Context Window: Giới hạn bộ nhớ tạm thời mà mô hình có thể đọc trong 1 lần.
• Token         : Đơn vị từ ngữ nhỏ nhất mà mô hình AI đọc và hiểu.
• Hallucination : Khi AI tự tin bịa ra thông tin sai lệch không có thật.
• Prompt        : Lời hướng dẫn hoặc câu hỏi bạn giao cho AI xử lý.', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000000e', 'a11a0000-0000-0000-0000-000000000005', 2, '2. Danh Mục Các Công Cụ AI Miễn Phí & Uy Tín Dành Cho Người Mới', '2-danh-muc-cac-cong-cu-ai-mien-phi-uy-tin-danh-cho-nguoi-moi', 'Khám phá hệ sinh thái công cụ: (1) Trợ lý văn bản & lập trình: ChatGPT, Claude, Microsoft Copilot; (2) Thiết kế đồ họa: DALL-E, Midjourney, Canva Magic; (3) Dịch thuật & Viết lách: DeepL Translator, Grammarly; (4) Nền tảng học tập & thực hành code đám mây: Google Colab, Hugging Face Hub (kho lưu trữ hàng trăm nghìn mô hình AI nguồn mở).', 45, '1. Google Colab (colab.research.google.com): Viết code Python có GPU miễn phí ngay trên trình duyệt.
2. Hugging Face (huggingface.co): Trải nghiệm các mô hình AI mã nguồn mở hàng đầu thế giới.
3. ChatGPT / Claude: Trợ lý tư duy và đối thoại kỹ thuật hàng ngày.
4. DeepL (deepl.com): Dịch tài liệu công nghệ chính xác vượt trội.', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000000f', 'a11a0000-0000-0000-0000-000000000005', 3, '3. Lộ Trình 5 Bước Vững Chắc: Từ L0 Đến Kiến Trúc Sư AI (Chuyển Tiếp Level 1)', '3-lo-trinh-5-buoc-vung-chac-tu-l0-den-kien-truc-su-ai-chuyen-tiep-level-1', 'Lộ trình 5 bước chuẩn mực do Prof Happy đề xuất: Bước 1: Hiểu vững khái niệm căn bản (đã hoàn thành tại Level 0); Bước 2: Thực hành thuần thục các công cụ AI sẵn có; Bước 3: Học lập trình Python cho AI (Bắt đầu tại Level 1 SFIA); Bước 4: Theo dõi xu hướng & tham gia cộng đồng mã nguồn mở; Bước 5: Tự tay xây dựng sản phẩm AI thực chiến (RAG Bot, Multi-Agent). Hãy tự tin bước tiếp vào Level 1!', 45, '[Bước 1: Hiểu Khái Niệm] ──► Hoàn thành Level 0 (AI for Everyone)
  ▼
[Bước 2: Dùng Công Cụ]   ──► Khai thác ChatGPT, Midjourney, Prompt cơ bản
  ▼
[Bước 3: Lập Trình AI]   ──► Bắt đầu Level 1 (Python, Token BPE, Strict Grounding)
  ▼
[Bước 4: Nâng Cấp Hệ Thống]──► Lên Level 2 - 3 (FastAPI, Qdrant Vector DB, Enterprise RAG)
  ▼
[Bước 5: Đỉnh Cao Kiến Trúc]──► Level 4 (Multi-Agent LangGraph, Fine-Tuning LoRA)', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 6: Chuyên Đề 0.6 • Đạo Đức Người Dùng AI Trong Nền Giáo Dục 5.0: Triết Lý Lấy Con Người Làm Trung Tâm
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000006', 6, 'Chuyên Đề 0.6 • Đạo Đức Người Dùng AI Trong Nền Giáo Dục 5.0: Triết Lý Lấy Con Người Làm Trung Tâm', 'chuyen-de-0-6-dao-duc-nguoi-dung-ai-trong-nen-giao-duc-5-0-triet-ly-lay-con-nguoi-lam-trung-tam', 'Chuyển dịch từ Giáo dục 4.0 (lấy công nghệ làm trung tâm) sang Giáo dục 5.0 (lấy con người làm trung tâm - Human-Centered). Phân tích 4 rủi ro đạo đức lớn của AI: Quyền riêng tư (Privacy), Giám sát (Surveillance), Sự thiên vị (Bias) và Sự tự trị (Autonomy). Tìm hiểu 3 cấp độ trao quyền quyết định cho AI: Hỗ trợ (Assisted), Tăng cường (Augmented) và Tự chủ (Autonomous).', 'L0', 'Analyze & Evaluate', 30, '20% AI - 80% Human', '┌────────────────────────────┬────────────────────────────────────────────────────────┐
│ Nền Giáo Dục               │ Triết Lý Trọng Tâm & Phương Thức Tiếp Cận               │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Giáo dục 4.0 (Technology)  │ • Công nghệ làm trung tâm, số hóa bài giảng, tự động hóa│
│                            │ • Tập trung vào hạ tầng và năng suất kỹ thuật           │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Giáo dục 5.0 (Human-First) │ • Con người làm trung tâm (Human-Centered)              │
│                            │ • Tích hợp công nghệ hiện đại với tính nhân văn đạo đức│
│                            │ • Phát triển tư duy phản biện, sáng tạo & sự thấu cảm  │
└────────────────────────────┴────────────────────────────────────────────────────────┘', 'markdown', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000010', 'a11a0000-0000-0000-0000-000000000006', 1, '1. Bước Chuyển Dịch Sang Giáo Dục 5.0: Lấy Con Người Làm Trung Tâm (Human-Centered)', '1-buoc-chuyen-dich-sang-giao-duc-5-0-lay-con-nguoi-lam-trung-tam-human-centered', 'Khái niệm Xã hội 5.0 / Giáo dục 5.0 bắt nguồn từ Nhật Bản năm 2016. Nếu Giáo dục 4.0 lấy công nghệ làm trung tâm (Technology-Centered), coi AI như công cụ tối ưu hóa năng suất thì Giáo dục 5.0 chuyển mình lấy con người làm trung tâm (Human-Centered): Công nghệ phục vụ cho hạnh phúc, sự phát triển toàn diện và giá trị nhân văn của người học. Sự cá nhân hóa trong giáo dục 5.0 phải đi đôi với sự tôn trọng phẩm giá và tinh thần trách nhiệm.', 45, '┌────────────────────────────┬────────────────────────────────────────────────────────┐
│ Nền Giáo Dục               │ Triết Lý Trọng Tâm & Phương Thức Tiếp Cận               │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Giáo dục 4.0 (Technology)  │ • Công nghệ làm trung tâm, số hóa bài giảng, tự động hóa│
│                            │ • Tập trung vào hạ tầng và năng suất kỹ thuật           │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Giáo dục 5.0 (Human-First) │ • Con người làm trung tâm (Human-Centered)              │
│                            │ • Tích hợp công nghệ hiện đại với tính nhân văn đạo đức│
│                            │ • Phát triển tư duy phản biện, sáng tạo & sự thấu cảm  │
└────────────────────────────┴────────────────────────────────────────────────────────┘', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000011', 'a11a0000-0000-0000-0000-000000000006', 2, '2. Mô Hình 4 Rủi Ro Đạo Đức & Xã Hội Của AI (Sandel & Akgun-Greenhow)', '2-mo-hinh-4-rui-ro-dao-duc-xa-hoi-cua-ai-sandel-akgun-greenhow', 'Các nhà nghiên cứu đạo đức tại Harvard (Michael Sandel) và Michigan State (Akgun & Greenhow) đã chỉ ra 4 rủi ro cốt lõi khi nhúng AI vào giáo dục: (1) Quyền riêng tư (Privacy): Dữ liệu cá nhân, giọng nói bị thu thập mập mờ, nguy cơ tống tiền mạo danh; (2) Sự giám sát (Surveillance): Camera AI theo dõi từng cử chỉ ánh mắt khiến người học cảm thấy bị kiểm soát và mất động lực tự thân; (3) Thiên vị & Phân biệt đối xử (Bias & Discrimination): Thuật toán học từ dữ liệu quá khứ sai lệch dẫn đến bất công giới tính/chủng tộc; (4) Sự tự trị (Autonomy): Người dùng ủy quyền mù quáng cho máy móc, đánh mất khả năng phán đoán độc lập của con người.', 45, '                  ┌────────────────────────────────────────┐
                  │ 4 RỦI RO ĐẠO ĐỨC AI TRONG GIÁO DỤC 5.0  │
                  └───────────────────┬────────────────────┘
                                      │
         ┌─────────────────┬──────────┴──────────┬─────────────────┐
         ▼                 ▼                     ▼                 ▼
   [QUYỀN RIÊNG TƯ]  [SỰ GIÁM SÁT]         [SỰ THIÊN VỊ]     [SỰ TỰ TRỊ]
   Lộ dữ liệu cá     Kiểm soát hành        Chênh lệch hệ     Ủy quyền mù quáng,
   nhân, deepfake    vi, giảm động lực     thống, bất công   đánh mất năng lực
   mạo danh giọng nói học tập tự do        giới tính/chủng tộc phán đoán con người', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000012', 'a11a0000-0000-0000-0000-000000000006', 3, '3. Ba Cấp Độ Trao Quyền Cho AI: Hỗ Trợ, Tăng Cường & Tự Chủ', '3-ba-cap-do-trao-quyen-cho-ai-ho-tro-tang-cuong-tu-chu', 'Mức độ can thiệp của AI vào quá trình ra quyết định được chia thành 3 bậc: (1) Hỗ trợ (Assisted AI): Chỉ thực hiện tác vụ hành chính giản đơn, không tác động quyết định (như lên lịch thi, chuyển văn bản thành giọng nói); (2) Tăng cường (Augmented AI): Cung cấp số liệu phân tích, chỉ ra điểm mạnh/yếu để con người tham khảo nhưng quyền quyết định cuối cùng vẫn thuộc về giáo viên/nhà quản lý — đây là cấp độ an toàn và khuyến nghị nhất hiện nay; (3) Tự chủ (Autonomous AI): AI tự ra quyết định độc lập không cần con người giám sát — cấp độ này tiềm ẩn rủi ro cực lớn và chưa được phép áp dụng trong giáo dục.', 45, '[1. Hỗ Trợ (Assisted)]   ──► Làm chân chạy hành chính, nhắc lịch, format văn bản
  ▼
[2. Tăng Cường (Augmented)]──► Gợi ý lộ trình, phát hiện điểm yếu ◄── [KHUYẾN NGHỊ CHO GIÁO DỤC 5.0]
                              (Con người là người ra phán quyết cuối cùng!)
  ▼
[3. Tự Chủ (Autonomous)] ──► AI tự cho đỗ/trượt, tự đuổi học ◄── [NGHIÊM CẤM TRONG NHÀ TRƯỜNG]', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 7: Chuyên Đề 0.7 • Chân Dung Công Dân Số, Nguyên Tắc THINK & Khung Đạo Đức UNESCO / Việt Nam
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000007', 7, 'Chuyên Đề 0.7 • Chân Dung Công Dân Số, Nguyên Tắc THINK & Khung Đạo Đức UNESCO / Việt Nam', 'chuyen-de-0-7-chan-dung-cong-dan-so-nguyen-tac-think-khung-dao-duc-unesco-viet-nam', 'Trang bị bộ 8 phẩm chất và 6 nhiệm vụ của một công dân số chuẩn mực theo mô hình quốc tế (Endang Wulandari & Hadi Partovi). Ứng dụng quy tắc giao tiếp đạo đức số THINK. Cập nhật Chiến lược quốc gia về AI của Việt Nam (Bộ KH&CN) và Khung đánh giá mức độ sẵn sàng đạo đức AI (RAM - Readiness Assessment Methodology) của UNESCO.', 'L0', 'Apply & Create', 30, '20% AI - 80% Human', '1. Kiến thức công nghệ  ──► Khả năng sử dụng và cập nhật công cụ AI mới
2. Tinh thần trách nhiệm──► Chịu trách nhiệm về hành vi và lời nói trực tuyến
3. Sự thành thật         ──► Xác nhận tính xác thực, không lan truyền tin giả
4. Tư duy phản biện     ──► Thẩm định dữ kiện từ AI, không tin tưởng mù quáng
5. Giải quyết vấn đề    ──► Sử dụng công nghệ để vượt qua thử thách
6. Sự sáng tạo          ──► Trí tuệ bậc cao tháp Bloom: Phân tích -> Đánh giá -> Sáng tạo
7. Sự bình đẳng         ──► Mọi người đều có vị trí và quyền như nhau trên môi trường số
8. Kiến thức địa phương ──► Kết hợp đạo đức văn hóa nơi sinh sống vào không gian số', 'markdown', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000013', 'a11a0000-0000-0000-0000-000000000007', 1, '1. Chân Dung 8 Phẩm Chất Cốt Lõi Của Công Dân Số (Endang Wulandari, 2021)', '1-chan-dung-8-pham-chat-cot-loi-cua-cong-dan-so-endang-wulandari-2021', 'Để hòa nhập xã hội và giáo dục 5.0, một công dân số cần hội tụ 8 giá trị vàng: (1) Kiến thức công nghệ: Hiểu và biết dùng công cụ; (2) Tinh thần trách nhiệm: Tuân thủ quy tắc và chuẩn mực số; (3) Sự thành thật: Xác thực tin tức, không chia sẻ tin giả; (4) Tư duy phản biện: Đặt câu hỏi nghi vấn dữ liệu AI cung cấp; (5) Giải quyết vấn đề: Vận dụng công nghệ giải quyết khó khăn đời sống; (6) Sự sáng tạo: Đạt tới nấc thang cao nhất của tháp Bloom; (7) Sự bình đẳng: Tôn trọng quyền của người khác trên không gian mạng; (8) Kiến thức địa phương: Bảo tồn bản sắc và đạo đức văn hóa bản địa.', 45, '1. Kiến thức công nghệ  ──► Khả năng sử dụng và cập nhật công cụ AI mới
2. Tinh thần trách nhiệm──► Chịu trách nhiệm về hành vi và lời nói trực tuyến
3. Sự thành thật         ──► Xác nhận tính xác thực, không lan truyền tin giả
4. Tư duy phản biện     ──► Thẩm định dữ kiện từ AI, không tin tưởng mù quáng
5. Giải quyết vấn đề    ──► Sử dụng công nghệ để vượt qua thử thách
6. Sự sáng tạo          ──► Trí tuệ bậc cao tháp Bloom: Phân tích -> Đánh giá -> Sáng tạo
7. Sự bình đẳng         ──► Mọi người đều có vị trí và quyền như nhau trên môi trường số
8. Kiến thức địa phương ──► Kết hợp đạo đức văn hóa nơi sinh sống vào không gian số', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000014', 'a11a0000-0000-0000-0000-000000000007', 2, '2. Nguyên Tắc THINK & 6 Nhiệm Vụ Đạo Đức Khi Ứng Dụng AI (Hadi Partovi, 2024)', '2-nguyen-tac-think-6-nhiem-vu-dao-duc-khi-ung-dung-ai-hadi-partovi-2024', 'Khi tương tác trên không gian mạng và sử dụng AI, công dân số thực hành nguyên tắc ''THINK - Suy nghĩ'' trước khi phát ngôn hoặc đăng tải: T (True - Có đúng sự thật không?), H (Helpful - Có giúp ích không?), I (Inspiring - Có truyền cảm hứng không?), N (Necessary - Có cần thiết không?), K (Kind - Có tử tế và tôn trọng không?). Đồng thời tuân thủ 6 nhiệm vụ: Kết nối AI với mục tiêu giáo dục, Tuân thủ chính sách bảo mật, Thúc đẩy hiểu biết số, Giữ vững tính toàn vẹn học thuật (chống đạo văn), Con người luôn can thiệp quá trình ra quyết định, và Định kỳ đánh giá tác động của AI.', 45, 'T - Is it TRUE?        (Thông tin này đã được kiểm chứng nguồn chưa?)
H - Is it HELPFUL?     (Nội dung này có mang lại giá trị cho cộng đồng không?)
I - Is it INSPIRING?   (Có tính xây dựng và khích lệ người khác không?)
N - Is it NECESSARY?   (Có thực sự cần thiết phải chia sẻ hay chỉ là spam?)
K - Is it KIND?        (Có tôn trọng danh dự và quyền riêng tư của người khác không?)', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000015', 'a11a0000-0000-0000-0000-000000000007', 3, '3. Chiến Lược AI Quốc Gia Việt Nam & Khung Đánh Giá Đạo Đức UNESCO (RAM)', '3-chien-luoc-ai-quoc-gia-viet-nam-khung-danh-gia-dao-duc-unesco-ram', 'Tại Việt Nam, Bộ KH&CN chủ trì triển khai Chiến lược quốc gia về nghiên cứu, phát triển và ứng dụng AI. Thứ trưởng Bộ KH&CN khẳng định: ''Đạo đức và trách nhiệm trong AI nằm ở tất cả các khâu, từ xây dựng thuật toán, thu thập dữ liệu đến công cụ huấn luyện''. Việt Nam đang tiên phong phối hợp với UNESCO thử nghiệm công cụ RAM (Readiness Assessment Methodology) để đo lường mức độ sẵn sàng về thể chế, hạ tầng và nguồn nhân lực đạo đức. Các trường đại học (Fulbright, ĐHQG Hà Nội, Sư phạm) đã đưa đạo đức AI vào chương trình đào tạo chính quy.', 45, '• Với Người Dạy: Làm gương về đạo đức số, tích hợp đạo đức AI vào môn học, dạy học sinh 
                 nhận diện thiên vị và bảo vệ dữ liệu cá nhân.
• Với Người Học: Nâng cao tư duy phản biện, kiểm chứng thông tin từ AI, có ý thức tự bảo mật 
                 dữ liệu cá nhân, sử dụng AI với tinh thần trung thực học thuật.
• Với Tổ Chức : Áp dụng phương pháp đánh giá mức độ sẵn sàng RAM theo khuyến nghị UNESCO.', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 8: Module 01 • Nhập Môn Python Cho AI, Môi Trường Thực Thi (venv/pip) & Bản Chất Tokenizer BPE
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000008', 1, 'Module 01 • Nhập Môn Python Cho AI, Môi Trường Thực Thi (venv/pip) & Bản Chất Tokenizer BPE', 'module-01-nhap-mon-python-cho-ai-moi-truong-thuc-thi-venv-pip-ban-chat-tokenizer-bpe', 'Trang bị nền tảng lập trình Python thực chiến cho AI: Cài đặt môi trường ảo (venv), quản lý thư viện pip, hiểu sâu cơ chế Byte-Pair Encoding (BPE), tỉ lệ nở token tiếng Việt và không gian xác suất Softmax.', 'L1', 'Remember', 30, '20% AI - 80% Human', '# =========================================================================
# BƯỚC 1: THIẾT LẬP MÔI TRƯỜNG TRÊN TERMINAL
# python -m venv ai_env
# source ai_env/bin/activate  (hoặc .\ai_env\Scripts\activate trên Windows)
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
print(f"[Thống Kê Văn Bản]: {stats}")', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000016', 'a11a0000-0000-0000-0000-000000000008', 1, '1. Nhập Môn Python Cho AI: Môi Trường Ảo (venv), Quản Lý Thư Viện & Script Đầu Tiên', '1-nhap-mon-python-cho-ai-moi-truong-ao-venv-quan-ly-thu-vien-script-dau-tien', 'Dành riêng cho người học xuất phát điểm Non-tech: Để làm chủ AI, bạn không cần học toàn bộ lý thuyết khoa học máy tính phức tạp mà cần làm chủ ''Python như một công cụ điều khiển AI''. Bước đầu tiên là thiết lập môi trường ảo sạch (venv) để tránh xung đột thư viện, cài đặt các package AI cốt lõi (tiktoken, httpx, python-dotenv) và viết script Python đầu tiên để xử lý dữ liệu chuỗi.', 45, '# =========================================================================
# BƯỚC 1: THIẾT LẬP MÔI TRƯỜNG TRÊN TERMINAL
# python -m venv ai_env
# source ai_env/bin/activate  (hoặc .\ai_env\Scripts\activate trên Windows)
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
print(f"[Thống Kê Văn Bản]: {stats}")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000017', 'a11a0000-0000-0000-0000-000000000008', 2, '2. Thuật Toán Byte-Pair Encoding (BPE) & Hiện Tượng Nở Token Tiếng Việt', '2-thuat-toan-byte-pair-encoding-bpe-hien-tuong-no-token-tieng-viet', 'Mô hình ngôn ngữ lớn không đọc văn bản theo ký tự hay từ hoàn chỉnh mà xử lý thông qua Token IDs. Thuật toán BPE gộp các cặp byte xuất hiện thường xuyên nhất trong tập dữ liệu tiền huấn luyện. Do tiếng Việt sử dụng bảng mã UTF-8 với dấu thanh ghép (ví dụ: ''ế'', ''ặ''), một từ tiếng Việt có thể bị phân rã thành 2-4 tokens (so với 1 token ở tiếng Anh), làm tăng chi phí API và nhanh đầy cửa sổ ngữ cảnh (Context Window).', 45, 'import tiktoken

# 1. Khởi tạo tokenizer chuẩn GPT-4o / cl100k_base
enc = tiktoken.get_encoding("cl100k_base")

# 2. So sánh giữa tiếng Anh và tiếng Việt
text_en = "Artificial Intelligence Engineering in Action 2026"
text_vi = "Kỹ thuật Trí tuệ Nhân tạo Thực chiến 2026"

tokens_en = enc.encode(text_en)
tokens_vi = enc.encode(text_vi)

print(f"EN: ''{text_en}'' -> {len(tokens_en)} tokens: {tokens_en}")
print(f"VI: ''{text_vi}'' -> {len(tokens_vi)} tokens: {tokens_vi}")
print(f"-> Tỉ lệ nở token tiếng Việt: {len(tokens_vi)/len(tokens_en):.2f}x")

# 3. Giải mã từng token để xem cách BPE chia cắt từ
for token_id in tokens_vi:
    print(f"Token ID {token_id:<6} -> ''{enc.decode([token_id])}''")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 9: Module 02 • Cấu Trúc Điều Khiển Python & Lập Trình Gọi LLM API An Toàn
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000009', 2, 'Module 02 • Cấu Trúc Điều Khiển Python & Lập Trình Gọi LLM API An Toàn', 'module-02-cau-truc-dieu-khien-python-lap-trinh-goi-llm-api-an-toan', 'Làm chủ cấu trúc điều khiển logic trong Python (If/Else, Vòng lặp For/While, Định nghĩa Hàm def) và lập trình script kết nối an toàn đến LLM Gateway (OpenAI / Gemini / Anthropic) với bảo mật biến môi trường .env.', 'L1', 'Understand', 30, '20% AI - 80% Human', 'def validate_and_format_prompt(user_query: str, max_chars: int = 2000) -> str:
    """Kiểm tra điều kiện đầu vào của người dùng trước khi gửi vào LLM."""
    cleaned_query = user_query.strip()
    
    if not cleaned_query:
        raise ValueError("Câu hỏi không được để trống.")
        
    if len(cleaned_query) > max_chars:
        print(f"[Cảnh Báo]: Câu hỏi vượt quá {max_chars} ký tự -> Tự động cắt ngắn.")
        cleaned_query = cleaned_query[:max_chars] + "..."
        
    formatted_prompt = f"### CÂU HỎI NGƯỜI DÙNG:\n{cleaned_query}"
    return formatted_prompt

test_q = "   Làm sao để triển khai vLLM trên cụm Kubernetes?   "
print(validate_and_format_prompt(test_q))', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000018', 'a11a0000-0000-0000-0000-000000000009', 1, '1. Cấu Trúc Điều Khiển Python: If-Else, Vòng Lặp & Định Nghĩa Hàm Xử Lý AI', '1-cau-truc-dieu-khien-python-if-else-vong-lap-dinh-nghia-ham-xu-ly-ai', 'Mọi ứng dụng AI đều xoay quanh việc kiểm tra điều kiện (ví dụ: nếu người dùng gửi câu hỏi rỗng, nếu độ dài prompt vượt quá 4000 ký tự) và lặp qua danh sách tài liệu. Học cách viết mã nguồn tinh gọn, có xử lý lỗi logic trước khi gửi dữ liệu lên mô hình AI.', 45, 'def validate_and_format_prompt(user_query: str, max_chars: int = 2000) -> str:
    """Kiểm tra điều kiện đầu vào của người dùng trước khi gửi vào LLM."""
    cleaned_query = user_query.strip()
    
    if not cleaned_query:
        raise ValueError("Câu hỏi không được để trống.")
        
    if len(cleaned_query) > max_chars:
        print(f"[Cảnh Báo]: Câu hỏi vượt quá {max_chars} ký tự -> Tự động cắt ngắn.")
        cleaned_query = cleaned_query[:max_chars] + "..."
        
    formatted_prompt = f"### CÂU HỎI NGƯỜI DÙNG:\n{cleaned_query}"
    return formatted_prompt

test_q = "   Làm sao để triển khai vLLM trên cụm Kubernetes?   "
print(validate_and_format_prompt(test_q))', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000019', 'a11a0000-0000-0000-0000-000000000009', 2, '2. Lập Trình Python Gọi LLM API Chuẩn Production (Bảo Mật Biến Môi Trường)', '2-lap-trinh-python-goi-llm-api-chuan-production-bao-mat-bien-moi-truong', 'Để xây dựng ứng dụng AI, người học cần biết cách tạo HTTP Client trong Python bằng thư viện `httpx` hoặc SDK chính thức. Nguyên tắc sống còn là TUYỆT ĐỐI KHÔNG hardcode API Key vào code mà phải đọc từ biến môi trường (`.env` qua `python-dotenv`), đồng thời bọc trong khối `try...except` để bắt các lỗi mạng (Timeout, Rate Limit).', 45, 'import os
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
        return f"[Lỗi Kết Nối Mạng]: Không thể kết nối tới LLM Gateway ({req_err})"', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 10: Module 03 • System Prompting XML Đa Tầng, Strict Grounding Chống Ảo Giác & Chain-of-Thought
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-00000000000a', 3, 'Module 03 • System Prompting XML Đa Tầng, Strict Grounding Chống Ảo Giác & Chain-of-Thought', 'module-03-system-prompting-xml-da-tang-strict-grounding-chong-ao-giac-chain-of-thought', 'Làm chủ kiến trúc System Prompt đa tầng chuẩn Anthropic/OpenAI, kỹ thuật phân tách ranh giới dữ liệu bằng thẻ XML, thiết lập quy tắc Strict Grounding triệt tiêu Hallucination và bóc tách luồng suy luận CoT bằng Python regex.', 'L1', 'Understand', 30, '20% AI - 80% Human', '[ROLE & CONTEXT]
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
</user_query>', 'markdown', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000001a', 'a11a0000-0000-0000-0000-00000000000a', 1, '1. Kiến Trúc System Prompt Chuẩn & Kỹ Thuật Grounding Bắt Buộc', '1-kien-truc-system-prompt-chuan-ky-thuat-grounding-bat-buoc', 'Ảo giác (Hallucination) xảy ra khi mô hình tự bịa thông tin do thiếu dữ kiện trong ngữ cảnh hoặc bị câu hỏi dẫn dụ (Prompt Injection). Kỹ thuật Strict Grounding sử dụng các thẻ XML để phân tách rạch ròi giữa: [VAI TRÒ], [QUY TẮC PHÁP LÝ], [NGỮ CẢNH TÀI LIỆU], và [CÂU HỎI], đồng thời áp đặt ''Quy Tắc Im Lặng'' khi tài liệu không chứa câu trả lời.', 45, '[ROLE & CONTEXT]
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
</user_query>', 'markdown', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000001b', 'a11a0000-0000-0000-0000-00000000000a', 2, '2. Lập Trình Python Bóc Tách Luồng Suy Luận CoT Bằng Regular Expressions', '2-lap-trinh-python-boc-tach-luong-suy-luan-cot-bang-regular-expressions', 'Khi LLM thực hiện suy luận từng bước (Chain-of-Thought), văn bản trả về sẽ chứa cả phần giải thích (Reasoning Trace) và đáp án kết luận cuối cùng. Bài học này hướng dẫn sử dụng cấu trúc dữ liệu Python `dict`, `list` kết hợp với biểu thức chính quy (Regex) để tự động trích xuất kết quả sạch lưu vào database.', 45, 'import re
from typing import Dict, Any

def parse_chain_of_thought_response(raw_llm_output: str) -> Dict[str, Any]:
    """Phân tách văn bản LLM thành: Lý do suy luận (Thinking) và Đáp án cuối (Answer)."""
    think_pattern = r"<think>(.*?)</think>"
    answer_pattern = r"(?:Kết luận cuối cùng|Đáp án|Final Answer):s*(.*)"
    
    think_match = re.search(think_pattern, raw_llm_output, re.DOTALL)
    answer_match = re.search(answer_pattern, raw_llm_output, re.IGNORECASE)
    
    reasoning_trace = think_match.group(1).strip() if think_match else "Không có thẻ think."
    final_answer = answer_match.group(1).strip() if answer_match else raw_llm_output.strip()
    
    return {
        "raw_text_length": len(raw_llm_output),
        "reasoning_steps": [step.strip() for step in reasoning_trace.split("\n") if step.strip()],
        "final_result": final_answer,
        "is_structured": bool(answer_match)
    }', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 11: Module 04 • Lập Trình Pydantic Data Models & Tự Động Hóa Workflow Qua Webhook / n8n
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-00000000000b', 4, 'Module 04 • Lập Trình Pydantic Data Models & Tự Động Hóa Workflow Qua Webhook / n8n', 'module-04-lap-trinh-pydantic-data-models-tu-dong-hoa-workflow-qua-webhook-n8n', 'Làm chủ lập trình Hướng đối tượng Python (OOP), định nghĩa Pydantic v2 Models, cưỡng chế LLM trả về đúng 100% JSON Schema Type-Safe và tích hợp tự động hóa qua Webhook/n8n.', 'L2', 'Apply', 30, '20% AI - 80% Human', 'from pydantic import BaseModel, Field
from typing import List, Optional

class SystemVulnerabilityReport(BaseModel):
    service_name: str = Field(description="Tên dịch vụ hoặc module hạ tầng gặp sự cố")
    cve_id: Optional[str] = Field(default=None, description="Mã lỗ hổng CVE nếu có")
    severity: str = Field(description="Mức độ nghiêm trọng: LOW | MEDIUM | HIGH | CRITICAL")
    affected_endpoints: List[str] = Field(description="Danh sách các API endpoints bị ảnh hưởng")
    remediation_steps: List[str] = Field(description="Các bước khắc phục kỹ thuật cụ thể")
    is_patch_available: bool = Field(description="Đã có bản vá lỗi chính thức hay chưa")

# JSON Schema sinh tự động để gửi vào LLM API:
# schema = SystemVulnerabilityReport.model_json_schema()', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000001c', 'a11a0000-0000-0000-0000-00000000000b', 1, '1. Cưỡng Chế Cấu Trúc Bằng Pydantic & JSON Schema Validation', '1-cuong-che-cau-truc-bang-pydantic-json-schema-validation', 'Trong môi trường Production, ứng dụng không thể tiếp nhận văn bản tự do vì dễ gây crash parser khi lưu cơ sở dữ liệu. Sử dụng OpenAI / Instructor Pydantic Schema đảm bảo LLM chỉ sinh đúng định dạng JSON hợp lệ, tự động kiểm tra kiểu dữ liệu (Type Validation), trường bắt buộc và giới hạn miền giá trị.', 45, 'from pydantic import BaseModel, Field
from typing import List, Optional

class SystemVulnerabilityReport(BaseModel):
    service_name: str = Field(description="Tên dịch vụ hoặc module hạ tầng gặp sự cố")
    cve_id: Optional[str] = Field(default=None, description="Mã lỗ hổng CVE nếu có")
    severity: str = Field(description="Mức độ nghiêm trọng: LOW | MEDIUM | HIGH | CRITICAL")
    affected_endpoints: List[str] = Field(description="Danh sách các API endpoints bị ảnh hưởng")
    remediation_steps: List[str] = Field(description="Các bước khắc phục kỹ thuật cụ thể")
    is_patch_available: bool = Field(description="Đã có bản vá lỗi chính thức hay chưa")

# JSON Schema sinh tự động để gửi vào LLM API:
# schema = SystemVulnerabilityReport.model_json_schema()', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000001d', 'a11a0000-0000-0000-0000-00000000000b', 2, '2. Tích Hợp Tự Động Hóa Workflow Qua Webhook & n8n', '2-tich-hop-tu-dong-hoa-workflow-qua-webhook-n8n', 'Sau khi dữ liệu được chuẩn hóa dưới dạng JSON hợp lệ, hệ thống tự động đẩy payload qua HTTP Webhook vào n8n/Make để kích hoạt các hành động tự động: ghi dữ liệu vào PostgreSQL, gửi cảnh báo Telegram và tạo ticket Jira mà không cần can thiệp thủ công.', 45, 'import httpx
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
        raise RuntimeError(f"n8n Webhook Error HTTP {response.status_code}: {response.text}")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 12: Module 05 • Backend Bất Đồng Bộ FastAPI & Server-Sent Events (SSE) Streaming
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-00000000000c', 5, 'Module 05 • Backend Bất Đồng Bộ FastAPI & Server-Sent Events (SSE) Streaming', 'module-05-backend-bat-dong-bo-fastapi-server-sent-events-sse-streaming', 'Xây dựng Backend Non-blocking Asyncio I/O với FastAPI, xử lý streaming từng token thời gian thực qua Server-Sent Events (SSE), tối ưu Time-to-First-Token (TTFT < 250ms).', 'L2', 'Apply', 30, '20% AI - 80% Human', 'from fastapi import FastAPI, HTTPException
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
        return {"total": len(prompts), "results": results}', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000001e', 'a11a0000-0000-0000-0000-00000000000c', 1, '1. Cơ Chế Non-Blocking Asyncio Trong Xử Lý LLM API', '1-co-che-non-blocking-asyncio-trong-xu-ly-llm-api', 'Các cuộc gọi đến mô hình LLM thường mất từ 2-15 giây để hoàn thành. Nếu sử dụng lập trình đồng bộ (Synchronous Blocking), mỗi kết nối sẽ chiếm dụng 1 thread, khiến máy chủ bị nghẽn (Denial of Service) khi có vài chục yêu cầu đồng thời. Lập trình bất đồng bộ (Async/Await) giải phóng Event Loop trong thời gian chờ mạng, cho phép 1 server xử lý hàng nghìn kết nối đồng thời.', 45, 'from fastapi import FastAPI, HTTPException
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
        return {"total": len(prompts), "results": results}', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000001f', 'a11a0000-0000-0000-0000-00000000000c', 2, '2. Thiết Kế API Streaming Với Server-Sent Events (SSE)', '2-thiet-ke-api-streaming-voi-server-sent-events-sse', 'Server-Sent Events (SSE) là chuẩn HTTP đơn hướng cho phép Server chủ động bắn từng đoạn dữ liệu (data chunks) về Client ngay khi token vừa được giải mã. Giúp giảm Time-to-First-Token (TTFT) từ 5 giây xuống dưới 300ms, mang lại trải nghiệm gõ chữ mượt mà và trực quan cho người dùng.', 45, 'from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

async def sse_token_stream(query: str):
    """Sinh luồng sự kiện SSE chuẩn định dạng ''data: {...}\n\n''"""
    simulated_tokens = ["Kiến", " trúc", " RAG", " chuẩn", " quốc", " tế", " SFIA", " v8."]
    for idx, token in enumerate(simulated_tokens):
        payload = json.dumps({"token_idx": idx, "text": token})
        yield f"data: {payload}\n\n"
        await asyncio.sleep(0.04) # Tốc độ gõ 25 tokens/giây
    yield "data: [DONE]\n\n"

@app.get("/api/chat/stream")
async def chat_stream(q: str):
    return StreamingResponse(
        sse_token_stream(q),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 13: Module 06 • Toán Học Vector NumPy & Cơ Sở Dữ Liệu Vector Qdrant Chỉ Mục HNSW
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-00000000000d', 6, 'Module 06 • Toán Học Vector NumPy & Cơ Sở Dữ Liệu Vector Qdrant Chỉ Mục HNSW', 'module-06-toan-hoc-vector-numpy-co-so-du-lieu-vector-qdrant-chi-muc-hnsw', 'Làm chủ đại số tuyến tính căn bản cho AI bằng NumPy (Cosine Similarity 1536D), cài đặt Qdrant Vector Database trên Docker và tối ưu chỉ mục đồ thị HNSW kèm Payload Filtering.', 'L2', 'Apply', 30, '20% AI - 80% Human', 'import numpy as np

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """Tính khoảng cách Cosine Similarity giữa 2 embeddings."""
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(np.dot(v1, v2) / (norm_v1 * norm_v2))

vec_a = np.random.randn(1536)
vec_b = vec_a + np.random.normal(0, 0.1, 1536) # Rất gần vec_a
print(f"Độ tương đồng ngữ nghĩa: {cosine_similarity(vec_a, vec_b):.4f}")', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000020', 'a11a0000-0000-0000-0000-00000000000d', 1, '1. Không Gian Vector 1536 Chiều & Khoảng Cách Cosine Similarity', '1-khong-gian-vector-1536-chieu-khoang-cach-cosine-similarity', 'Mỗi đoạn văn bản sau khi qua mô hình Embedding sẽ trở thành một vector thực d=1536 chiều. Độ tương đồng ngữ nghĩa giữa câu hỏi Q và tài liệu D được đo bằng góc cos giữa hai vector: Cosine(Q, D) = (Q . D) / (||Q|| * ||D||). Khi hai vector cùng hướng, Cosine = 1.0 (ngữ nghĩa giống hệt), khi vuông góc Cosine = 0 (hoàn toàn không liên quan).', 45, 'import numpy as np

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """Tính khoảng cách Cosine Similarity giữa 2 embeddings."""
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(np.dot(v1, v2) / (norm_v1 * norm_v2))

vec_a = np.random.randn(1536)
vec_b = vec_a + np.random.normal(0, 0.1, 1536) # Rất gần vec_a
print(f"Độ tương đồng ngữ nghĩa: {cosine_similarity(vec_a, vec_b):.4f}")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000021', 'a11a0000-0000-0000-0000-00000000000d', 2, '2. Cấu Trúc Đồ Thị HNSW & Collection Qdrant Production', '2-cau-truc-do-thi-hnsw-collection-qdrant-production', 'Quét tuần tự toàn bộ vector (Brute-force) có độ phức tạp O(N) — quá chậm khi dữ liệu đạt hàng triệu bản ghi. Thuật toán HNSW xây dựng đồ thị phân tầng nhiều lớp giúp tìm kiếm láng giềng gần nhất (ANN) với độ phức tạp chỉ O(log N). Qdrant hỗ trợ lọc metadata (Payload Filtering) trực tiếp trong quá trình duyệt đồ thị.', 45, 'from qdrant_client import QdrantClient
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
)', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 14: Module 07 • Kỹ Thuật Phân Tách Văn Bản (Semantic Chunking) & Embeddings Đa Ngôn Ngữ BGE-M3
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-00000000000e', 7, 'Module 07 • Kỹ Thuật Phân Tách Văn Bản (Semantic Chunking) & Embeddings Đa Ngôn Ngữ BGE-M3', 'module-07-ky-thuat-phan-tach-van-ban-semantic-chunking-embeddings-da-ngon-ngu-bge-m3', 'Làm chủ chiến lược phân tách tài liệu thông minh: Fixed-size, Recursive Character và Semantic Chunking; tích hợp mô hình Embedding đa ngôn ngữ BAAI/bge-m3 & Cohere.', 'L3', 'Apply', 30, '20% AI - 80% Human', 'import numpy as np

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
    return chunks', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000022', 'a11a0000-0000-0000-0000-00000000000e', 1, '1. So Sánh Các Chiến Lược Phân Tách Chunking (Fixed vs Recursive vs Semantic)', '1-so-sanh-cac-chien-luoc-phan-tach-chunking-fixed-vs-recursive-vs-semantic', 'Phân tách sai tài liệu là nguyên nhân số 1 khiến RAG bị mất ngữ cảnh (Context Loss). Chiến lược Semantic Chunking tính toán độ tương đồng giữa các câu liền kề để chỉ cắt đoạn khi chủ đề thay đổi, bảo toàn 100% ngữ nghĩa của các điều khoản luật hoặc hàm code.', 45, 'import numpy as np

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
    return chunks', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000023', 'a11a0000-0000-0000-0000-00000000000e', 2, '2. Tích Hợp Mô Hình Embedding Đa Ngôn Ngữ BAAI/bge-m3', '2-tich-hop-mo-hinh-embedding-da-ngon-ngu-baai-bge-m3', 'BGE-M3 là mô hình embedding SOTA hỗ trợ đồng thời 3 khả năng: Dense Retrieval (1024D), Sparse Retrieval (Lexical weights) và Multi-Vector ColBERT, hỗ trợ xuất sắc tiếng Việt và hơn 100 ngôn ngữ khác.', 45, 'from FlagEmbedding import BGEM3FlagModel

model = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
sentences = ["Hạ tầng tính toán AI phục vụ mô hình ngôn ngữ lớn.", "FastAPI streaming server with Server-Sent Events."]
embeddings = model.encode(sentences, return_dense=True, return_sparse=True)
print(f"Kích thước Dense Vector: {embeddings[''dense_vecs''].shape}")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 15: Module 08 • Tìm Kiếm Lai (Hybrid Search: Qdrant Dense + BM25 Sparse) & Hợp Nhất RRF
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-00000000000f', 8, 'Module 08 • Tìm Kiếm Lai (Hybrid Search: Qdrant Dense + BM25 Sparse) & Hợp Nhất RRF', 'module-08-tim-kiem-lai-hybrid-search-qdrant-dense-bm25-sparse-hop-nhat-rrf', 'Kết hợp Vector Search (Dense) + BM25 (Sparse) qua thuật toán Reciprocal Rank Fusion (RRF) và Cross-Encoder Reranker, loại bỏ tài liệu rác và tăng độ chính xác tìm kiếm 35%.', 'L3', 'Apply', 30, '20% AI - 80% Human', 'def reciprocal_rank_fusion(dense_rankings: list[str], sparse_rankings: list[str], k: int = 60) -> list[tuple[str, float]]:
    """Hợp nhất thứ hạng từ Dense Vector và BM25 Sparse Search bằng công thức RRF."""
    rrf_scores = {}
    for rank, doc_id in enumerate(dense_rankings):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    for rank, doc_id in enumerate(sparse_rankings):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    return sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000024', 'a11a0000-0000-0000-0000-00000000000f', 1, '1. Sự Kết Hợp Giữa Dense Vector & BM25 Sparse Search', '1-su-ket-hop-giua-dense-vector-bm25-sparse-search', 'Vector Search rất mạnh trong việc hiểu ngữ nghĩa tương đồng nhưng dễ bị ''mù'' trước các từ khóa chính xác như mã SKU, tên hàm code, mã định danh lỗi (ví dụ: ''ERR-503-GATEWAY''). Ngược lại, BM25 tính toán tần suất xuất hiện từ vựng theo trọng số TF-IDF giúp bắt trọn từ khóa chính xác. Mô hình Hybrid Search chạy song song 2 luồng và hợp nhất kết quả.', 45, 'def reciprocal_rank_fusion(dense_rankings: list[str], sparse_rankings: list[str], k: int = 60) -> list[tuple[str, float]]:
    """Hợp nhất thứ hạng từ Dense Vector và BM25 Sparse Search bằng công thức RRF."""
    rrf_scores = {}
    for rank, doc_id in enumerate(dense_rankings):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    for rank, doc_id in enumerate(sparse_rankings):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
    return sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000025', 'a11a0000-0000-0000-0000-00000000000f', 2, '2. Tinh Chỉnh Thứ Hạng Với Cross-Encoder Re-ranker', '2-tinh-chinh-thu-hang-voi-cross-encoder-re-ranker', 'Mô hình Bi-Encoder tính toán vector của Query và Document độc lập. Cross-Encoder nhận đồng thời cả cặp (Query, Document) vào cùng một mạng Transformer để chấm điểm tương quan trực tiếp, đưa đoạn văn bản chất lượng nhất lên vị trí Top 1.', 45, 'from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
query = "Cách cấu hình vLLM Continuous Batching trên Kubernetes?"
candidate_docs = ["Tài liệu hướng dẫn vLLM Continuous Batching.", "Hướng dẫn cài đặt Docker."]
pairs = [[query, doc] for doc in candidate_docs]
scores = reranker.predict(pairs)
print(f"Top 1 Re-ranked Score: {scores[0]:.4f}")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 16: Module 09 • Điều Phối Đa Tác Nhân Tự Chủ (LangGraph) & Tinh Chỉnh Mô Hình PEFT / LoRA
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000010', 9, 'Module 09 • Điều Phối Đa Tác Nhân Tự Chủ (LangGraph) & Tinh Chỉnh Mô Hình PEFT / LoRA', 'module-09-dieu-phoi-da-tac-nhan-tu-chu-langgraph-tinh-chinh-mo-hinh-peft-lora', 'Mô hình hóa hệ thống Multi-Agent bằng Đồ thị trạng thái có chu trình (Cyclic StateGraph), quản lý bộ nhớ Checkpointing và fine-tuning mô hình bằng PEFT / LoRA (QLoRA 4-bit NF4) trên 1 GPU.', 'L3', 'Analyze', 30, '20% AI - 80% Human', 'from typing import TypedDict
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
workflow.add_conditional_edges("tester", lambda s: END if s["is_passed"] else "coder")', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000026', 'a11a0000-0000-0000-0000-000000000010', 1, '1. Kiến Trúc State Machine & Rẽ Nhánh Điều Kiện Trong LangGraph', '1-kien-truc-state-machine-re-nhanh-dieu-kien-trong-langgraph', 'LangGraph cho phép xây dựng đồ thị trạng thái có chu trình (Cyclic Graph), trong đó các tác nhân (Planner, Coder, Tester) cùng đọc và ghi vào một đối tượng State chung, cho phép hệ thống tự lặp lại bước code nếu kiểm thử chưa đạt yêu cầu.', 45, 'from typing import TypedDict
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
workflow.add_conditional_edges("tester", lambda s: END if s["is_passed"] else "coder")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000027', 'a11a0000-0000-0000-0000-000000000010', 2, '2. Tinh Chỉnh Mô Hình Tối Ưu Tham Số Với PEFT / LoRA (QLoRA 4-bit)', '2-tinh-chinh-mo-hinh-toi-uu-tham-so-voi-peft-lora-qlora-4-bit', 'Low-Rank Adaptation (LoRA) đóng băng toàn bộ trọng số gốc W0 và chỉ huấn luyện 2 ma trận phân rã hạng thấp B và A theo công thức: W = W0 + (alpha / r) * (B x A). Kết hợp QLoRA 4-bit NF4 giúp fine-tune mô hình 8B trên 1 GPU 16GB VRAM.', 45, 'from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM

base_model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")
lora_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"], task_type=TaskType.CAUSAL_LM)
model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 17: Module 10 • Hạ Tầng Suy Luận Hiệu Năng Cao: vLLM PagedAttention & Continuous Batching
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000011', 10, 'Module 10 • Hạ Tầng Suy Luận Hiệu Năng Cao: vLLM PagedAttention & Continuous Batching', 'module-10-ha-tang-suy-luan-hieu-nang-cao-vllm-pagedattention-continuous-batching', 'Thuật toán PagedAttention quản lý KV Cache không phân mảnh, cơ chế Continuous Batching, Tensor Parallelism và tối ưu hóa Throughput GPU gấp 15 lần trên cụm Kubernetes.', 'L4', 'Analyze', 30, '20% AI - 80% Human', 'python3 -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Meta-Llama-3-8B-Instruct \
  --tensor-parallel-size 1 \
  --gpu-memory-utilization 0.92 \
  --max-model-len 8192 \
  --enable-chunked-prefill \
  --port 8000', 'bash', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000028', 'a11a0000-0000-0000-0000-000000000011', 1, '1. Thuật Toán PagedAttention & Cơ Chế Continuous Batching Trong vLLM', '1-thuat-toan-pagedattention-co-che-continuous-batching-trong-vllm', 'PagedAttention chia nhỏ KV Cache thành các khối trang bộ nhớ không cần liên tục, giúp loại bỏ hoàn toàn hiện tượng phân mảnh bộ nhớ và tăng thông lượng phục vụ lên gấp 10-15 lần.', 45, 'python3 -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Meta-Llama-3-8B-Instruct \
  --tensor-parallel-size 1 \
  --gpu-memory-utilization 0.92 \
  --max-model-len 8192 \
  --enable-chunked-prefill \
  --port 8000', 'bash', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-000000000029', 'a11a0000-0000-0000-0000-000000000011', 2, '2. Cấu Hình Tensor Parallelism Đa GPU Trên Kubernetes', '2-cau-hinh-tensor-parallelism-da-gpu-tren-kubernetes', 'Kỹ thuật chia sẻ ma trận trọng số mô hình lớn qua nhiều GPU song song (Tensor Parallelism) và triển khai cụm vLLM Autoscaling trên Kubernetes.', 45, 'apiVersion: apps/v1
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
        args: ["--model", "meta-llama/Meta-Llama-3-70B-Instruct", "--tensor-parallel-size", "2"]', 'yaml', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 18: Module 11 • Đánh Giá Định Lượng RAG Triad Với Ragas & Truy Vết Toàn Diện OpenTelemetry Phoenix
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000012', 11, 'Module 11 • Đánh Giá Định Lượng RAG Triad Với Ragas & Truy Vết Toàn Diện OpenTelemetry Phoenix', 'module-11-danh-gia-dinh-luong-rag-triad-voi-ragas-truy-vet-toan-dien-opentelemetry-phoenix', 'Đo lường định lượng 3 chỉ số vàng RAG Triad tự động (Faithfulness, Answer Relevance, Context Recall) và thiết lập hệ thống Prompt Tracing toàn diện với OpenTelemetry & Arize Phoenix.', 'L4', 'Analyze', 30, '20% AI - 80% Human', 'from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevance, context_precision
from datasets import Dataset

eval_data = {
    "question": ["Cơ chế PagedAttention hoạt động như thế nào?"],
    "contexts": [["PagedAttention chia KV Cache thành các khối trang bộ nhớ ảo để chống phân mảnh VRAM."]],
    "answer": ["PagedAttention chia nhỏ KV Cache thành các trang bộ nhớ giúp tối ưu hoá 80% VRAM."]
}

dataset = Dataset.from_dict(eval_data)
results = evaluate(dataset, metrics=[faithfulness, answer_relevance, context_precision])
print(f"Faithfulness Score: {results[''faithfulness'']:.4f} (Mục tiêu > 0.90)")', 'python', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000002a', 'a11a0000-0000-0000-0000-000000000012', 1, '1. Đo Lường Định Lượng RAG Triad Tự Động Với Ragas', '1-do-luong-dinh-luong-rag-triad-tu-dong-voi-ragas', 'Bộ chỉ số Ragas đo lường 3 góc độ: 1) Faithfulness: Tỉ lệ phát biểu trong câu trả lời có bằng chứng xác thực trong tài liệu; 2) Answer Relevance: Độ phù hợp của câu trả lời với câu hỏi; 3) Context Recall: Mức độ bao phủ đầy đủ dữ kiện cần thiết của tài liệu.', 45, 'from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevance, context_precision
from datasets import Dataset

eval_data = {
    "question": ["Cơ chế PagedAttention hoạt động như thế nào?"],
    "contexts": [["PagedAttention chia KV Cache thành các khối trang bộ nhớ ảo để chống phân mảnh VRAM."]],
    "answer": ["PagedAttention chia nhỏ KV Cache thành các trang bộ nhớ giúp tối ưu hoá 80% VRAM."]
}

dataset = Dataset.from_dict(eval_data)
results = evaluate(dataset, metrics=[faithfulness, answer_relevance, context_precision])
print(f"Faithfulness Score: {results[''faithfulness'']:.4f} (Mục tiêu > 0.90)")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000002b', 'a11a0000-0000-0000-0000-000000000012', 2, '2. Giám Sát Chi Phí & Truy Vết LLM Với OpenTelemetry & Phoenix', '2-giam-sat-chi-phi-truy-vet-llm-voi-opentelemetry-phoenix', 'Tích hợp OpenTelemetry để ghi log từng request, thời gian trễ TTFT, tổng token tiêu thụ và truy vết từng node thực thi trong LangGraph StateGraph.', 45, 'import phoenix as px
from openinference.instrumentation.langchain import LangChainInstrumentor

session = px.launch_app(port=6006)
LangChainInstrumentor().instrument()
print(f"Phoenix Tracing Dashboard đang chạy tại: {session.url}")', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

-- MODULE 19: Module 12 • Thiết Kế Kiến Trúc AI Doanh Nghiệp (C4 Model), Lakehouse CDC & Quản Trị ISO 42001
INSERT INTO curriculum_modules (id, module_number, title, slug, description, target_level, bloom_level, estimated_hours, human_ai_ratio, code_snippet, code_language, is_published)
VALUES ('a11a0000-0000-0000-0000-000000000013', 12, 'Module 12 • Thiết Kế Kiến Trúc AI Doanh Nghiệp (C4 Model), Lakehouse CDC & Quản Trị ISO 42001', 'module-12-thiet-ke-kien-truc-ai-doanh-nghiep-c4-model-lakehouse-cdc-quan-tri-iso-42001', 'Mô hình hóa hệ thống AI theo C4 Diagrams 4 tầng, xây dựng Semantic Caching (Redis), Data Lakehouse CDC (Kafka / Debezium) và khung quản trị an toàn ISO/IEC 42001 (AIMS Matrix).', 'L4', 'Analyze', 30, '20% AI - 80% Human', '[Enterprise Users / Mobile / Web Clients]
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
                                                [vLLM Inference Cluster on K8s]', 'text', TRUE)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000002c', 'a11a0000-0000-0000-0000-000000000013', 1, '1. Mô Hình Hóa Kiến Trúc Enterprise AI Theo C4 Model', '1-mo-hinh-hoa-kien-truc-enterprise-ai-theo-c4-model', 'Hệ thống AI Enterprise cần được đặc tả ở 4 cấp độ trực quan: System Context, Container, Component và Code, kết hợp Redis Semantic Cache để giảm 70% chi phí gọi LLM.', 45, '[Enterprise Users / Mobile / Web Clients]
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
                                                [vLLM Inference Cluster on K8s]', 'text', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;
INSERT INTO curriculum_topics (id, module_id, topic_number, title, slug, description, reading_time_minutes, code_snippet, code_language, is_published)
VALUES ('b22b0000-0000-0000-0000-00000000002d', 'a11a0000-0000-0000-0000-000000000013', 2, '2. Khung Quản Trị AI Doanh Nghiệp Theo Chuẩn ISO/IEC 42001 & PII Guardrails', '2-khung-quan-tri-ai-doanh-nghiep-theo-chuan-iso-iec-42001-pii-guardrails', 'Tiêu chuẩn quốc tế ISO/IEC 42001 quy định 4 trụ cột bắt buộc: AI Impact Assessment (AIA), Data Governance & PII Masking, Explainability và Continuous Monitoring.', 45, 'import re

def pii_sanitization_guardrail(raw_prompt: str) -> str:
    """Tự động phát hiện và ẩn danh hoá thông tin nhạy cảm PII chuẩn ISO 42001."""
    sanitized = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+", "[REDACTED_EMAIL]", raw_prompt)
    sanitized = re.sub(r"(+84|0)d{9,10}", "[REDACTED_PHONE]", sanitized)
    sanitized = re.sub(r"d{12}", "[REDACTED_NATIONAL_ID]", sanitized)
    sanitized = re.sub(r"(sk-[a-zA-Z0-9]{32,})", "[REDACTED_SECRET_KEY]", sanitized)
    return sanitized', 'python', TRUE)
ON CONFLICT (module_id, topic_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, code_snippet = EXCLUDED.code_snippet;

