import os
import shutil
import math

def setup_directory_structure():
    # Danh sách 35 chủ đề tương ứng 35 tuần
    topics = [
        "Array", "String", "Hashmap", "Two Pointers", "Linked List", "Linked List Advanced",
        "Binary Tree", "Binary Search Tree", "Dynamic Programming 1D", "Dynamic Programming 2D",
        "OOP Basics", "SOLID Principles", "Design Patterns", "Database Schema", "SQL Joins & Indexing",
        "Microservices Architecture", "RESTful API Development", "Authentication JWT", "Message Queues",
        "Unity Core & Movement", "Unity Combat & Collision", "Unity State Management", "Unity UI/UX",
        "Unity Inventory System", "ReactJS Fundamentals", "React Hooks & Context", "Admin Dashboard UI",
        "Offline Progress Logic", "Idle Math Calculation", "In-App Purchases (IAP)", "Ads Integration",
        "Redis Caching", "API Optimization (<50ms)", "CI/CD & GitHub Actions", "App Store Publishing"
    ]
    
    index_content = "# MỤC LỤC GIÁO TRÌNH 1000 HOURS HUMAN LEARNING WITH AI\n\n"
    index_content += "Mục lục này đóng vai trò như bản đồ điều hướng. Click vào bất kỳ tuần nào để nhảy trực tiếp vào thư mục mã nguồn tương ứng.\n\n"
    
    # Map các tuần vào Objective
    def get_objective_folder(week):
        if week <= 10: return "01-Objective-Data-Structures-Python-Java"
        elif week <= 19: return "02-Objective-OOP-Backend-Java-CSharp"
        elif week <= 27: return "03-Objective-Game-Client-Web-Unity-React"
        elif week <= 31: return "04-Objective-Monetization-Retention-Unity"
        else: return "05-Objective-Optimization-Publishing"

    for w in range(1, 36):
        month = math.ceil(w / 4.0)
        obj_folder = get_objective_folder(w)
        month_folder = f"Month-{month:02d}"
        
        # Định dạng slug tên thư mục tuần
        topic_slug = topics[w-1].lower().replace(" ", "-").replace("(", "").replace(")", "").replace("<", "").replace("&", "and").replace("/", "-")
        week_folder_name = f"week-{w:02d}-{topic_slug}"
        
        full_path = os.path.join(obj_folder, month_folder, week_folder_name)
        
        # Tạo thư mục
        os.makedirs(full_path, exist_ok=True)
        
        # In tiêu đề Objective nếu là tuần đầu tiên của Objective đó
        if w == 1: index_content += "## 🎯 GIAI ĐOẠN 1: TƯ DUY & CẤU TRÚC DỮ LIỆU CƠ BẢN\n"
        elif w == 11: index_content += "\n## 🎯 GIAI ĐOẠN 2: LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG & BACKEND\n"
        elif w == 20: index_content += "\n## 🎯 GIAI ĐOẠN 3: LẬP TRÌNH GAME CLIENT & FRONTEND WEB\n"
        elif w == 28: index_content += "\n## 🎯 GIAI ĐOẠN 4: THƯƠNG MẠI HÓA (IAP & ADS)\n"
        elif w == 32: index_content += "\n## 🎯 GIAI ĐOẠN 5: TỐI ƯU HÓA & PHÁT HÀNH APP STORE\n"
        
        # Add link to INDEX.md
        safe_path = full_path.replace("\\", "/")
        index_content += f"- [Tuần {w:02d}: {topics[w-1]}](./{safe_path})\n"

    # Lưu INDEX.md
    with open("INDEX.md", "w", encoding="utf-8") as f:
        f.write(index_content)
        
    print("Created Objective folders and INDEX.md mapping.")

    # -----------------------------------------------------
    # Di chuyển dữ liệu Tuần 1 từ `leetcode/week-01-array` sang cấu trúc mới
    # -----------------------------------------------------
    old_week1_path = "leetcode/week-01-array"
    new_week1_path = "01-Objective-Data-Structures-Python-Java/Month-01/week-01-array"
    
    if os.path.exists(old_week1_path):
        # Di chuyển tất cả nội dung bên trong old -> new
        for item in os.listdir(old_week1_path):
            s = os.path.join(old_week1_path, item)
            d = os.path.join(new_week1_path, item)
            if os.path.exists(d):
                if os.path.isdir(d):
                    shutil.rmtree(d)
                else:
                    os.remove(d)
            shutil.move(s, new_week1_path)
        print(f"Moved Week 1 content to {new_week1_path}")

    # Xóa các thư mục nháp
    for old_dir in ["leetcode", "backend-services", "game-client"]:
        if os.path.exists(old_dir):
            shutil.rmtree(old_dir)
            print(f"Removed old draft directory: {old_dir}")

if __name__ == "__main__":
    setup_directory_structure()
