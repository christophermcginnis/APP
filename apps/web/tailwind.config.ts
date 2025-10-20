import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f6ff",
          100: "#e6ebff",
          200: "#c6d1ff",
          300: "#9daeff",
          400: "#6a7dff",
          500: "#4052ff",
          600: "#2531db",
          700: "#1b26af",
          800: "#161f83",
          900: "#121b69"
        }
      },
      boxShadow: {
        glow: "0 0 2rem rgba(64, 82, 255, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;

