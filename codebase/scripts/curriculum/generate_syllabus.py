import os

# Create syllabus directory
os.makedirs("syllabus", exist_ok=True)

# Helper function to get objective and metadata based on week
def get_week_metadata(week):
    if 1 <= week <= 10:
        return {
            "objective": "Objective 1: Thiết lập Tư duy, Cấu trúc Dữ liệu & Mở Kênh YouTube",
            "hours": 20,
            "videos": 2,
            "focus": "Python/Java Core, Thuật toán cơ bản, HackerRank và LeetCode (Top Interview 150). So sánh cú pháp Python và Java.",
            "task_example": "- Giải 10 bài LeetCode (Easy/Medium)\n- Record 2 video phân tích cách giải bằng Python và Java."
        }
    elif 11 <= week <= 19:
        return {
            "objective": "Objective 2: Lập trình Hướng đối tượng (OOP) & Xây dựng Core Backend",
            "hours": 30,
            "videos": 3,
            "focus": "Enterprise Backend (Java Spring Boot hoặc C# ASP.NET Core). Kiến trúc phần mềm, Design Patterns, SOLID.",
            "task_example": "- Học Coursera IBM Full Stack Software Developer\n- Viết API quản lý nhân vật Game Idle RPG.\n- Record 3 video về OOP và Backend Architecture."
        }
    elif 20 <= week <= 27:
        return {
            "objective": "Objective 3: Lập trình Game Client & Frontend Web",
            "hours": 30,
            "videos": 3,
            "focus": "Unity C# (Core Gameplay, UI/UX, State Management) & React.js Admin Dashboard.",
            "task_example": "- Học Coursera Microsoft Full-Stack Developer\n- Thiết kế UI Game Idle RPG trên Unity, gọi API Backend.\n- Record 3 video Devlog làm game."
        }
    elif 28 <= week <= 31:
        return {
            "objective": "Objective 4: Tích hợp Trí tuệ Nhân tạo (AI Integration)",
            "hours": 35,
            "videos": 3,
            "focus": "Python FastAPI, GenAI, OpenAI/Gemini API. Tạo não bộ cho NPC và sinh ảnh Item tự động.",
            "task_example": "- Xây dựng microservice Python gọi AI API.\n- Kết nối Game Client (C#) với AI Microservice.\n- Record 3 video về tích hợp AI đa ngôn ngữ."
        }
    else:
        return {
            "objective": "Objective 5: Tối ưu hóa Database, Phát hành App Store & Tổng kết",
            "hours": 40,
            "videos": 4,
            "focus": "Tối ưu hóa Database (PostgreSQL/Redis), CI/CD, Publish App lên Google Play & App Store.",
            "task_example": "- Tối ưu truy vấn Database.\n- Build file .apk/.aab/.ipa và submit Store.\n- Quay phim tài liệu tổng kết hành trình 1000 giờ."
        }

template = """# Tuần {week_num:02d}

**Thuộc:** {objective}
**Mục tiêu thời gian:** ~{hours} giờ
**KPI YouTube:** Xuất bản {videos} video

---

## 🎯 Focus (Trọng tâm học tập)
{focus}

## 📚 Tài liệu & Khóa học (Coursera/Docs)
- *Link khóa học liên quan hoặc tài liệu đọc (Ví dụ: Tài liệu Unity, Spring Boot docs).*

## 💻 Nhiệm vụ Thực hành & Code
{task_example}

## ✅ Checklist Cuối Tuần (Đánh giá OKRs)
- [ ] Hoàn thành {hours} giờ code/học tập.
- [ ] Hoàn thành và publish {videos} video YouTube.
- [ ] Push toàn bộ code của tuần này lên GitHub.
- [ ] Viết nhật ký ngắn gọn (Retrospective) bên dưới.

---

### 📝 Nhật ký & Tóm tắt bài học (Retrospective)
*(Người học ghi chú lại những bug gặp phải, kiến thức hay nhất học được trong tuần vào đây...)*

"""

for week in range(1, 36):
    meta = get_week_metadata(week)
    content = template.format(
        week_num=week,
        objective=meta["objective"],
        hours=meta["hours"],
        videos=meta["videos"],
        focus=meta["focus"],
        task_example=meta["task_example"]
    )
    
    file_path = f"syllabus/week-{week:02d}.md"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Successfully generated 35 weekly syllabus files.")
