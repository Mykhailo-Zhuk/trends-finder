import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        teal: {
          50: "#effefb",
          100: "#c7fff5",
          200: "#90ffec",
          300: "#51f7e1",
          400: "#1de4cf",
          500: "#05c8b6",
          600: "#00a196",
          700: "#057f78",
          800: "#0a6460",
          900: "#0d524f",
          950: "#013332",
        },
        glass: {
          light: "rgba(255,255,255,0.06)",
          mid: "rgba(255,255,255,0.10)",
          strong: "rgba(255,255,255,0.15)",
          border: "rgba(255,255,255,0.12)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
