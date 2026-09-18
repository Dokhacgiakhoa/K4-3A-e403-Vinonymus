import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono, Montserrat } from "next/font/google";
import { AppShellLayout } from "@/components/layout/app-shell-layout";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-thuc-chien.vn'),
  title: {
    default: "Nền Tảng Học AI Cá Nhân Hóa | Chuẩn Quốc Tế SFIA (V8)",
    template: "%s | K.AI Labs"
  },
  description: "Nền tảng học AI cá nhân hóa, chuẩn quốc tế SFIA (V8). Tích hợp AI Mentor 1-on-1 may đo lộ trình độc bản và AI Helpdesk 24/7 đồng hành giải đáp kỹ thuật.",
  keywords: [
    "Tự học AI từ L0",
    "AI SFIA",
    "SFIA 8",
    "Khung năng lực AI",
    "Kỹ sư AI thực chiến",
    "Transformer Attention",
    "Vector Database Qdrant",
    "Agentic AI LangGraph",
    "LoRA Fine-Tuning PEFT",
    "vLLM PagedAttention",
    "RAG Triad Ragas",
    "Đề thi mô phỏng AI",
    "AI Engineer Roadmap"
  ],
  authors: [{ name: "Đỗ Khắc Gia Khoa" }],
  creator: "Đỗ Khắc Gia Khoa",
  publisher: "AI in Action Community Hub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://ai-thuc-chien.vn",
    title: "Nền Tảng Học AI Cá Nhân Hóa | Chuẩn Quốc Tế SFIA (V8)",
    description: "Nền tảng tri thức mở tự học AI từ L0: Giáo trình & đề lab thực hành Level 0 đến Level 4, khung tham chiếu SFIA v8, luyện thi mô phỏng và trợ lý AI.",
    siteName: "AI in Action Community Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI in Action Engineering & Learning Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nền Tảng Học AI Cá Nhân Hóa | Chuẩn Quốc Tế SFIA (V8)",
    description: "Nền tảng tự học AI từ L0 chuẩn SFIA v8, giáo trình thực hành Level 0 - Level 4 và đề thi mô phỏng dành cho cộng đồng.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/aiia-logo.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png?v=4", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=4",
    apple: "/apple-icon.png?v=4",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI in Action",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1329",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://ai-thuc-chien.vn/#website",
        "url": "https://ai-thuc-chien.vn",
        "name": "K.AI Labs - Nền Tảng Tự Học AI Từ L0",
        "description": "Nền tảng tự học AI từ L0 chuẩn quốc tế SFIA (v8), giáo trình thực hành Level 0 đến Level 4.",
        "inLanguage": "vi-VN"
      },
      {
        "@type": "Person",
        "name": "Đỗ Khắc Gia Khoa",
        "jobTitle": "Lead AI Architect & Author",
        "url": "https://github.com/Dokhacgiakhoa"
      },
      {
        "@type": "Course",
        "name": "Giáo Trình Tự Học AI Từ L0 Chuẩn Quốc Tế SFIA (v8)",
        "description": "Giáo trình và lab thực hành từ Level 0 đến Level 4: từ AI Cho Mọi Người, Toán Transformer đến vLLM và Multi-Agent.",
        "provider": {
          "@type": "Person",
          "name": "Đỗ Khắc Gia Khoa"
        },
        "educationalCredentialAwarded": "Định Vị Năng Lực Chuẩn SFIA (v8)"
      },
      {
        "@type": "SoftwareApplication",
        "name": "AI in Action PWA",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All (Web, iOS, Android, Desktop)"
      }
    ]
  };

  return (
    <html lang="vi" suppressHydrationWarning className={`scroll-smooth ${beVietnamPro.variable} ${jetbrainsMono.variable} ${montserrat.variable}`}>
      <head>
        <link rel="canonical" href="https://ai-thuc-chien.vn" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans min-h-screen">
        <ThemeProvider>
          <AppShellLayout>
            {children}
          </AppShellLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
