import os

os.makedirs("syllabus", exist_ok=True)

# URL Constants
URL_LEETCODE = "https://leetcode.com/studyplan/top-interview-150/"
URL_HR_PYTHON = "https://www.hackerrank.com/skills-verification/python_basic"
URL_HR_JAVA = "https://www.hackerrank.com/skills-verification/java_basic"
URL_HR_SQL = "https://www.hackerrank.com/skills-verification/sql_basic"
URL_HR_CSHARP = "https://www.hackerrank.com/skills-verification/csharp_basic"
URL_IBM_FULLSTACK = "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer"
URL_MS_FULLSTACK = "https://www.coursera.org/professional-certificates/microsoft-full-stack-developer"
URL_IBM_AI = "https://www.coursera.org/professional-certificates/applied-artifical-intelligence-ibm-watson-ai"
URL_UNITY = "https://learn.unity.com/"
URL_REACT = "https://react.dev/learn"

def get_week_data(w):
    # Phase 1: W1-10
    if 1 <= w <= 10:
        obj = "Objective 1: Thiết lập Tư duy, Cấu trúc Dữ liệu & Mở Kênh YouTube"
        hours = 20
        vids = 2
        ai_ratio = "20% AI - 80% Human (AI làm gia sư, Human tự code 100%)"
        
        # HackerRank logic
        if w <= 3: hr = f"HackerRank: Luyện tập lấy [Python Basic Certificate]({URL_HR_PYTHON})."
        elif w <= 6: hr = f"HackerRank: Luyện tập lấy [Java Basic Certificate]({URL_HR_JAVA})."
        elif w <= 9: hr = f"HackerRank: Luyện tập lấy [SQL Basic Certificate]({URL_HR_SQL})."
        else: hr = "HackerRank: Ôn tập tổng hợp chứng chỉ Python, Java, SQL."
            
        # LeetCode logic
        topics = ["Array", "String", "HashMap", "Two Pointers", "Linked List", "Linked List", "Binary Tree", "Binary Tree", "Dynamic Programming", "Dynamic Programming"]
        lc = f"LeetCode: [Top Interview 150]({URL_LEETCODE}) - Chủ đề tuần này: **{topics[w-1]}**. Giải 5-10 bài."
        coursera = "Coursera: Không yêu cầu (Tập trung LeetCode & HackerRank)."
        
        focus = f"Hiểu sâu về cấu trúc dữ liệu {topics[w-1]}. Tiếp tục so sánh bộ nhớ giữa Python và Java. **Thực chiến Git/GitHub cơ bản:** Học cách `git init`, `git add`, `git commit` và cấu hình file `.gitignore` chuẩn."
        
        ai_usage = "- Dùng **Claude** để phân tích sâu Time/Space Complexity của thuật toán.\n- Cấm chỉ định dùng **Copilot/Codex** viết hộ code ở giai đoạn này. Tự gõ 100%."
        
        if w == 1:
            yt = f"""**Video 1: Giới thiệu Dự án 1000 Giờ (Build in Public)**
- Review tổng quan Lộ trình 35 tuần, giải thích triết lý 80/20 AI Copilot và OKRs.
**Video 2: Tổng kết Tuần 1 - Thành quả Khởi động**
- Show các repo Git đã setup thành công và review lại các bài LeetCode (Array) đã giải được trong tuần."""
        else:
            yt = f"""**Video {w*2 - 1}: Cấu trúc dữ liệu {topics[w-1]} - Góc nhìn Hệ thống**
- Show cách tư duy thuật toán trước khi viết code.
**Video {w*2}: Python vs Java - Code {topics[w-1]} bằng 2 ngôn ngữ**
- Thực hành giải bài LeetCode trực tiếp, so sánh tốc độ thực thi."""

    # Phase 2: W11-19
    elif 11 <= w <= 19:
        obj = "Objective 2: Lập trình Hướng đối tượng (OOP) & Xây dựng Core Backend (Microservices & 50+ APIs)"
        hours = 30
        vids = 3
        ai_ratio = "50% AI - 50% Human (Human thiết kế kiến trúc, AI sinh Boilerplate code)"
        
        if w <= 13: hr = f"HackerRank: Luyện tập lấy [C# Basic Certificate]({URL_HR_CSHARP})."
        else: hr = f"HackerRank: Hoàn tất 4 chứng chỉ Basic."
            
        lc = f"LeetCode: Giải duy trì 1 bài Medium từ [Top Interview 150]({URL_LEETCODE}) mỗi ngày."
        coursera = f"Coursera: Khóa [IBM Full Stack Software Developer]({URL_IBM_FULLSTACK}) (Tuần {w-10} của chứng chỉ)."
        
        focus = "Kiến trúc Microservices (Java Spring Boot / C# .NET Core) với 3 Services. Xây dựng 50+ RESTful APIs. **Vai trò Business Analyst (BA):** Học cách viết tài liệu Đặc tả Yêu cầu Phần mềm (SRS) cho Game trước khi code. **Thực chiến Git:** Phân nhánh (Git Branching) và làm quen quy trình tạo Pull Request (PR)."
        
        ai_usage = "- Dùng **Claude** làm System Analyst để thiết kế Schema và Design Patterns.\n- Dùng **Copilot/Codex** sinh nhanh các class Model (DTO) và CRUD cơ bản."
        
        yt = f"""**Video {w*3 - 2}: Hành trình làm Backend Game Idle RPG (Devlog)**
- Show kiến trúc Microservices và Database Schema.
**Video {w*3 - 1}: Học Coursera IBM Full Stack - Tuần {w-10} có gì hay?**
- Review kiến thức học được từ [IBM Full Stack]({URL_IBM_FULLSTACK}).
**Video {w*3}: .NET Core vs Spring Boot**
- So sánh cách 2 framework này xử lý một API Request cơ bản."""

    # Phase 3: W20-27
    elif 20 <= w <= 27:
        obj = "Objective 3: Lập trình Game Client (60 FPS) & Frontend Web (React 10+ screens)"
        hours = 30
        vids = 3
        ai_ratio = "50% AI - 50% Human (Human thiết kế State, AI hỗ trợ Scripting)"
        
        hr = "HackerRank: Không yêu cầu."
        lc = f"LeetCode: Chuyển sang giải các bài liên quan đến Graph/BFS/DFS ứng dụng cho Game ([Tham khảo]({URL_LEETCODE}))."
        coursera = f"Coursera: Khóa [Microsoft Full-Stack Developer]({URL_MS_FULLSTACK}) (Tuần {w-19} của chứng chỉ)."
        
        focus = f"Code Game Client bằng [Unity C#]({URL_UNITY}) (Tối ưu 60 FPS) và Admin Dashboard bằng [React.js]({URL_REACT}) (10+ màn hình). **Mô phỏng Teamwork:** Đóng vai cả Backend Dev & Frontend Dev để đẩy Git chéo, xử lý Merge Conflicts và tự Review Code (Cross-functional Roles)."
        
        ai_usage = "- Dùng **Antigravity** để quản lý các lệnh Git/Terminal. \n- Dùng **Claude** debug các lỗi vật lý khó trong Unity.\n- Dùng **Copilot** gõ Boilerplate cho React UI."
        
        yt = f"""**Video {w*3 - 2}: Devlog Game Idle RPG - Tối ưu 60FPS**
- Show tiến độ làm UI/UX trên Unity.
**Video {w*3 - 1}: Học Coursera Microsoft Full-Stack - Tuần {w-19}**
- Review chứng chỉ [Microsoft]({URL_MS_FULLSTACK}).
**Video {w*3}: Kết nối Unity Client với Backend Server**
- Hướng dẫn gọi RESTful API từ Unity bằng C#."""

    # Phase 4: W28-31
    elif 28 <= w <= 31:
        obj = "Objective 4: Tính năng App Nâng cao (Monetization & Retention)"
        hours = 35
        vids = 3
        ai_ratio = "80% AI - 20% Human (Human làm Architect/Prompt Engineer, AI code Boilerplate tích hợp SDK)"
        
        hr = "HackerRank: Không yêu cầu."
        lc = "LeetCode: Luyện tập các bài Medium tập trung vào thuật toán tối ưu cho hệ thống Offline Progress."
        coursera = "Coursera: Không yêu cầu. Dồn 100% thời gian code tính năng App thực tế."
        
        focus = "Thương mại hóa Game: Tích hợp In-App Purchases (IAP), Unity Ads/AdMob, Social Login và tính toán Offline Progress (Treo máy nhận EXP)."
        
        ai_usage = "- Human nghiên cứu logic của App. **Copilot / Codex** gánh 80% việc sinh code tích hợp các SDK của Google/Apple (IAP, Ads)."
        
        yt = f"""**Video {w*3 - 2}: Tính năng Offline Progress cho Game Idle**
- Giải thuật tính toán tài nguyên khi User tắt App.
**Video {w*3 - 1}: Kiếm tiền từ Game (IAP & Ads)**
- Review cách dùng AI Copilot để tích hợp SDK Quảng cáo và Nạp thẻ siêu tốc.
**Video {w*3}: Social Login & Bảo mật tài khoản**
- Hướng dẫn cấu hình đăng nhập Google/Apple trong Unity."""

    # Phase 5: W32-35
    else:
        obj = "Objective 5: Tối ưu hóa Database (Redis), Publish (App Store & Play Store)"
        hours = 40
        vids = 4 if w == 35 else 3
        ai_ratio = "80% AI - 20% Human (Tối đa hóa năng suất bằng AI)"
        
        hr = "HackerRank: Tổng ôn tập."
        lc = f"LeetCode: Mock Interview (Giả lập phỏng vấn 150 bài [Top Interview]({URL_LEETCODE}))."
        coursera = "Coursera: Hoàn tất mọi chứng chỉ còn nợ."
        
        focus = "Thiết kế Schema 20+ Tables (PostgreSQL). **Vai trò Tester (QA):** Viết Test Case, chạy Unit/Integration Test cho API. Tích hợp Redis Caching (<50ms). Thiết lập CI/CD, Build ứng dụng lên App Store & Google Play. **(Riêng Tuần 35): Code và Deploy 1 Website CV/Portfolio cá nhân.**"
        
        ai_usage = "- Dùng **Antigravity** chạy tự động các lệnh build và cấu hình DevOps.\n- Dùng **Claude** rà soát lỗ hổng bảo mật trước khi Publish."
        
        yt = f"""**Video {w*3 - 2}: Đưa game lên App Store & Google Play**
- Show quá trình đăng ký Developer Account và build app.
**Video {w*3 - 1}: Tối ưu hệ thống (Redis <50ms, CI/CD)**
- Cấu hình server chịu tải cao cho 10,000 CCU.
**Video {w*3}: Quản trị dự án bằng OKRs**
- Review tiến độ tuần."""
        
        if w == 35:
            yt += f"\n**Video {w*3 + 1}: DOCUMENTARY - Hành trình 1000 giờ Human Learning with AI**\n- Phim tài liệu tổng kết dự án, khoe thành quả Game và Chứng chỉ."

    return obj, hours, vids, ai_ratio, hr, lc, coursera, focus, ai_usage, yt

template_public = """# Tuần {week_num:02d}

**Thuộc:** {obj}
**Mục tiêu thời gian:** ~{hours} giờ
**Tỷ lệ AI/Human:** {ai_ratio}

---

## 🎯 Focus (Trọng tâm học tập)
{focus}

## 📚 Tài liệu & Chứng chỉ cần đạt
- **{hr}**
- **{lc}**
- **{coursera}**

## 💻 Nhiệm vụ Thực hành & Code
- Thực hiện nghiêm túc tỷ lệ Human/AI của tuần này.
- Bám sát lộ trình bài giảng của Coursera hoặc LeetCode.
- Code và hoàn thiện các module của Game Idle RPG theo Focus.

## 🤖 Ứng dụng AI trong tuần
{ai_usage}

## ✅ Checklist Cuối Tuần (Đánh giá OKRs)
- [ ] Hoàn thành {hours} giờ học tập & code.
- [ ] Push toàn bộ source code (LeetCode / Game) lên GitHub.
- [ ] Cập nhật tiến độ Coursera / HackerRank.

---

### 📝 Nhật ký & Tóm tắt bài học (Retrospective)
*(Ghi chú nhanh những bài học đắt giá, bug khó fix, hoặc những ý tưởng mới cho game vào đây...)*

"""

private_yt_content = "# KẾ HOẠCH NỘI DUNG YOUTUBE (PRIVATE)\n\n*Chiến lược Build in Public 100 Videos*\n\n"

for w in range(1, 36):
    obj, hours, vids, ai_ratio, hr, lc, coursera, focus, ai_usage, yt = get_week_data(w)
    
    # Ghi file Public (Syllabus thuần kỹ thuật)
    content_public = template_public.format(
        week_num=w,
        obj=obj,
        hours=hours,
        ai_ratio=ai_ratio,
        hr=hr,
        lc=lc,
        coursera=coursera,
        focus=focus,
        ai_usage=ai_usage
    )
    
    with open(f"syllabus/week-{w:02d}.md", "w", encoding="utf-8") as f:
        f.write(content_public)
        
    # Gom nội dung Private (YouTube)
    private_yt_content += f"## Tuần {w:02d} (Target: {vids} Videos)\n{yt}\n\n---\n\n"

# Đảm bảo thư mục private tồn tại
os.makedirs("private", exist_ok=True)
with open("private/YOUTUBE_SCRIPTS.md", "w", encoding="utf-8") as f:
    f.write(private_yt_content)

print("Successfully generated 35 Technical Syllabus files (Public) and 1 Youtube Scripts file (Private).")
