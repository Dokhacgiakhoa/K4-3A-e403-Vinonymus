# BÁO CÁO TIẾN ĐỘ QUY TRÌNH LÀM VIỆC (WORKFLOW PROGRESS REPORT)

> **Dự án**: AI Thực Chiến — Nền Tảng Giáo Trình & Khung Năng Lực Kỹ Sư AI  
> **Repository**: `Dokhacgiakhoa/AI-thuc-chien`  
> **Kiến trúc Framework**: Next.js 15 + React 19 + Tailwind CSS + Supabase RAG + Agent Framework  

---

## 🏗️ 1. Cấu Trúc Hệ Thống Khung Quản Trị (.agent/)

```
AI-thuc-chien/
├── .agent/
│   ├── rules/          # Quy tắc lập trình & tiêu chuẩn kỹ thuật (Global Constitution, Anti-Crash, Security)
│   ├── skills/         # Kỹ năng chuyên sâu (UI/UX Pro Max, NextJS, React, TDD, Security, RAG)
│   ├── workflows/      # Quy trình làm việc chuẩn hóa (plan, test, audit, deploy, review)
│   ├── core/           # Cốt lõi điều phối đa tác nhân
│   └── agents/         # Định nghĩa các vai trò DB, BE, FE, QA
├── TASK_BOARD.md       # Bảng phân công tính năng & nhật ký công việc
├── WORKFLOW_PROGRESS_REPORT.md # Báo cáo tiến độ chuẩn hóa
├── curriculum/         # Giáo trình gốc 35 tuần & tài liệu LeetCode/Game RPG
├── data/faqs/          # Cơ sở tri thức câu hỏi FAQ
└── src/                # Toàn bộ mã nguồn ứng dụng Web AI Thực Chiến
```

---

## 🎯 2. Các Bước Đang Thực Hiện Tiếp Theo

1. **Khớp nội dung Giáo trình 35 tuần**: Đọc trực tiếp các file `.md` trong `curriculum/syllabus/` để đưa vào giao diện Learning.
2. **Khớp nội dung Khung năng lực SFIA & Bloom's Taxonomy**: Tích hợp chuẩn L1 - L7 vào giao diện SFIA Hub.
3. **Giữ Chat Box AI hỗ trợ xuyên suốt**: Khung Chat K.AI RAG hoạt động đồng bộ với cơ sở tri thức `data/faqs/`.
