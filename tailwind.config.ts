import type { Config } from "tailwindcss";

// SEAPEDIA design tokens — "Fresh Marketplace, Marine Heritage".
// Palette: deep ink navy ground, brackish teal as the brand spine,
// a warm coral signal for seller/commerce actions, and a clean foam surface.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f3f5f7",
          100: "#e2e8ee",
          200: "#c5d0db",
          300: "#9aabbd",
          400: "#6b8099",
          500: "#4c6178",
          600: "#3a4c60",
          700: "#2f3d4e",
          800: "#1c2733",
          900: "#0f1722",
          950: "#0b1018",
        },
        brand: {
          50: "#e9faf7",
          100: "#c8f2eb",
          200: "#94e5da",
          300: "#5bd1c3",
          400: "#2fb6a8",
          500: "#0e7c7b",
          600: "#0c6566",
          700: "#0d5152",
          800: "#0f4142",
          900: "#0f3739",
        },
        coral: {
          50: "#fff1ed",
          100: "#ffdfd4",
          200: "#ffc1ad",
          300: "#ff9a79",
          400: "#fb6a42",
          500: "#ef4d28",
          600: "#dc3a1d",
          700: "#b62b1a",
          800: "#92271c",
          900: "#78241b",
        },
        foam: "#f7faf9",
      },
      fontFamily: {
        display: ['"DM Sans"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,34,0.04), 0 8px 24px -12px rgba(15,23,34,0.12)",
        lift: "0 12px 32px -12px rgba(14,124,123,0.28)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(47,182,168,0.5)" },
          "70%": { boxShadow: "0 0 0 8px rgba(47,182,168,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(47,182,168,0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
        "slide-in": "slide-in 0.25s ease-out both",
        "pulse-ring": "pulse-ring 1.6s ease-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
