/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#0EA5E9",
          dark: "#0284C7",
          light: "#E0F2FE",
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
        },
        // Status
        available: "#22C55E",
        waiting: "#F59E0B",
        emergency: "#EF4444",
        // Backgrounds
        bg: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
          muted: "#F1F5F9",
        },
        // Text
        text: {
          main: "#0F172A",
          sub: "#64748B",
          muted: "#94A3B8",
          white: "#FFFFFF",
        },
        // Borders
        border: {
          DEFAULT: "#E2E8F0",
          light: "#F1F5F9",
        },
      },
      fontFamily: {
        sans: ["Inter", "System"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.06)",
        modal: "0 8px 32px rgba(0,0,0,0.12)",
        btn: "0 4px 12px rgba(14,165,233,0.3)",
      },
    },
  },
  plugins: [],
};
