# KIẾN TRÚC THƯƠNG MẠI HÓA (SAAS) & CHUYỂN ĐỔI SANG MOBILE APP

> **Tài liệu Kỹ thuật & Đặc tả Kiến trúc Toàn diện**  
> Dự án: **AI SFIA Engineering & Learning Hub** (AI Thực Chiến)  
> Hỗ trợ: **Web PWA (Next.js)** & **Native Mobile App (React Native / Expo / iOS & Android)**

---

## 1. TỔNG QUAN CHIẾN LƯỢC 2 GIAI ĐOẠN

```
[GIAI ĐOẠN 1: PWA & CỘNG ĐỒNG]                      [GIAI ĐOẠN 2: SAAS & MOBILE APP NATIVE]
• Nền tảng tri thức mở SFIA L1-L7                   • Tài khoản phân quyền: Admin / User / Fellow
• Không rào cản đăng nhập, Offline First             • Server AI Gateway trả phí (Token Balance / Quota)
• Web PWA cài đặt 1-click lên màn hình               • Mobile App trên Apple App Store & Google Play
• Thu hút học viên Khóa IV VinUni AI in Action      • Thanh toán tự động: PayOS (QR VN) + Stripe + Apple IAP
```

---

## 2. KIẾN TRÚC HỆ THỐNG: "SINGLE BACKEND - MULTI CLIENT"

Tất cả các client (Web PWA, iOS App, Android App) đều giao tiếp với 1 Backend chung duy nhất thông qua **REST API / SSE Streams** chuẩn hóa:

```
                  ┌──────────────────────────────────────────────┐
                  │           WEB CLIENT (Next.js PWA)           │
                  └──────────────────────┬───────────────────────┘
                                         │ (HTTPS / REST API)
                                         ▼
 ┌─────────────────────────┐    ┌──────────────────────────────────┐    ┌─────────────────────────┐
 │   NATIVE iOS APP        │───►│       BACKEND API GATEWAY        │◄───│   NATIVE ANDROID APP    │
 │   (React Native / Expo) │    │   (Supabase Auth + Next.js / AI) │    │   (React Native / Expo) │
 └─────────────────────────┘    └────────────────┬─────────────────┘    └─────────────────────────┘
                                                 │
                        ┌────────────────────────┼────────────────────────┐
                        ▼                        ▼                        ▼
              [PostgreSQL 15 + RLS]      [AI Streaming Router]    [Payment Webhooks]
              (Users, Quota, Chat DB)    (OpenAI, Claude, vLLM)   (PayOS, Apple IAP, Stripe)
```

---

## 3. ĐẶC TẢ CƠ SỞ DỮ LIỆU (DATABASE SPECIFICATION)

File migration hoàn chỉnh: `supabase/migrations/20260830_commercial_saas_schema.sql`

### 3.1. Các bảng dữ liệu cốt lõi
1. **`profiles`**: Quản lý thông tin học viên & vai trò (`admin`, `user`, `fellow`). Có trigger tự động khởi tạo khi user đăng ký qua Supabase Auth.
2. **`subscriptions`**: Quản lý gói cước (`free`, `pro`, `enterprise`), số dư `token_balance` và giới hạn `daily_query_limit`.
3. **`chat_sessions` & `chat_messages`**: Lưu trữ lịch sử hỏi đáp AI đồng bộ thời gian thực giữa Web và Mobile.
4. **`user_bookmarks`**: Lưu trữ các kỹ năng và công thức yêu thích của học viên.
5. **`audit_logs`**: Ghi nhận toàn bộ thao tác bảo mật, đăng nhập, nạp tiền và gọi AI.

### 3.2. Bảo mật Row Level Security (RLS)
- Mọi bảng đều kích hoạt RLS.
- Người dùng thông thường **chỉ có thể đọc/ghi dữ liệu của chính mình** (`auth.uid() = user_id`).
- Tài khoản `role = 'admin'` được cấp quyền truy cập quản trị hệ thống thông qua hàm bảo mật `public.is_admin()`.

---

## 4. HỆ THỐNG GÓI CƯỚC THƯƠNG MẠI (COMMERCIAL TIERS)

| Gói cước | Mức giá | Token AI khởi tạo / tháng | Tính năng nổi bật |
|---|---|---|---|
| **Free Fellow** | 0 VNĐ | 10.000 tokens (20 câu/ngày) | Tra cứu SFIA L1-L7, Lộ trình 12 ngày & 12 tuần, PWA Offline |
| **Pro AI Engineer** | 99.000 VNĐ / tháng | 500.000 tokens (500 câu/ngày) | AI Chat RAG chuyên sâu, Sinh mã nguồn, Đồng bộ Web $\leftrightarrow$ Mobile App |
| **Enterprise Team** | 990.000 VNĐ / tháng | 5.000.000 tokens | Phân quyền Admin quản trị nhóm, API Key Backend riêng |

---

## 5. HƯỚNG DẪN CHUYỂN ĐỔI SANG MOBILE APP (REACT NATIVE / EXPO)

Khi bắt đầu triển khai Mobile App trong Giai đoạn 2:

1. **Khởi tạo dự án Mobile**:
   ```bash
   npx create-expo-app ai-thuc-chien-mobile --template blank-typescript
   ```
2. **Cài đặt thư viện cốt lõi**:
   ```bash
   npx expo install @supabase/supabase-js expo-secure-store expo-notifications
   ```
3. **Tái sử dụng mã nguồn**:
   - Copy file `types/saas.ts` vào Mobile App.
   - Kết nối Supabase Client với cùng một URL & Anon Key của Web:
   ```ts
   import { createClient } from '@supabase/supabase-js';
   import * as SecureStore from 'expo-secure-store';

   export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
     auth: {
       storage: {
         getItem: (key) => SecureStore.getItemAsync(key),
         setItem: (key, value) => SecureStore.setItemAsync(key, value),
         removeItem: (key) => SecureStore.deleteItemAsync(key),
       },
       autoRefreshToken: true,
       persistSession: true,
     },
   });
   ```
4. **Đóng gói xuất bản**:
   ```bash
   eas build --platform all
   ```
