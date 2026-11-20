import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#1F8A4C", // Primary Green spec
          600: "#176B3B",
          700: "#12512C",
          800: "#0E3E22",
          900: "#0A2D18",
          dark: "#14261A", // Dark text spec
        },
        surface: {
          light: "#FFFFFF",
          mutedLight: "#F2F6F3",
          dark: "#132219", // Refined dark mode card surface
          cardDark: "#182A20", // Elevated dark mode element
          cardDarkBorder: "#1F3527", // Subtle organic dark border
        },
        bg: {
          light: "#F7FAF5", // Warm off-white spec
          dark: "#0A130E",  // Refined deep organic slate
        },
        dishTag: {
          safeBg: "#EAF7EE",
          safeText: "#1F8A4C",
          safeDarkBg: "#0F2E1B",
          safeDarkText: "#4ADE80",

          amberBg: "#FEF3C7",
          amberText: "#D97706",
          amberDarkBg: "#2E1E05",
          amberDarkText: "#FBBF24",

          redBg: "#FEE2E2",
          redText: "#DC2626",
          redDarkBg: "#2E0E0E",
          redDarkText: "#F87171",
        },
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        "20": "20px",
        "28": "28px",
      },
      boxShadow: {
        card: "0 4px 18px -2px rgba(20, 38, 26, 0.05), 0 1px 4px -1px rgba(20, 38, 26, 0.02)",
        "card-dark": "0 6px 22px -2px rgba(0, 0, 0, 0.45)",
        "glow-green": "0 8px 25px -4px rgba(31, 138, 76, 0.38)",
        "glow-green-sm": "0 4px 14px -2px rgba(31, 138, 76, 0.28)",
        sheet: "0 -10px 40px rgba(0, 0, 0, 0.15)",
        tactile: "0 2px 0 rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
