import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "0.4" },
          "30%": { transform: "scale(1.2)", opacity: "0" },
          "100%": { transform: "scale(1.2)", opacity: "0" },
        },
      },
      animation: {
        "ping-slow": "ping-slow 3.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
