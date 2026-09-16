import os
import shutil
import re

def sync_directories_with_index():
    with open("INDEX.md", "r", encoding="utf-8") as f:
        content = f.read()

    # Tìm tất cả các đường dẫn trong cặp ngoặc đơn sau đường link markdown: [Tên](./path)
    links = re.findall(r'\]\(\.\/([^\)]+)\)', content)

    # Đảm bảo đường dẫn Tuần 1 cũ tồn tại để di chuyển
    old_week1 = "01-Objective-Data-Structures-Python-Java/Month-01/week-01-array"
    new_week1 = None

    for link in links:
        safe_path = link.strip()
        os.makedirs(safe_path, exist_ok=True)
        print(f"Ensured directory exists: {safe_path}")

        # Ghi nhận path của Tuần 1 mới
        if "week-01-" in safe_path:
            new_week1 = safe_path

    # Di chuyển dữ liệu từ thư mục Tuần 1 cũ sang thư mục Tuần 1 mới siêu chi tiết
    if new_week1 and old_week1 != new_week1 and os.path.exists(old_week1):
        for item in os.listdir(old_week1):
            s = os.path.join(old_week1, item)
            d = os.path.join(new_week1, item)
            if os.path.exists(d):
                if os.path.isdir(d):
                    shutil.rmtree(d)
                else:
                    os.remove(d)
            shutil.move(s, new_week1)
        shutil.rmtree(old_week1)
        print(f"Moved content from {old_week1} to {new_week1}")

if __name__ == "__main__":
    sync_directories_with_index()
