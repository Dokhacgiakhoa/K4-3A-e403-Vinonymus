import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `next dev` và `next build` mặc định dùng chung thư mục .next, gây xung đột file
  // khi cả hai chạy song song (ví dụ npm run verify build trong lúc dev server đang chạy).
  // Tách riêng .next-dev cho dev để không bao giờ đụng .next của production build nữa.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
