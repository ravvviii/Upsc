/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit-Regular"],
        "outfit-medium": ["Outfit-Medium"],
        "outfit-bold": ["Outfit-Bold"],
        mono: ["SpaceMono-Regular"],
      },
      colors: {
        primary: {
          25: "#EFF6FF",
          50: "#DBEAFE",
          100: "#BFDBFE",
          200: "#93C5FD",
          300: "#60A5FA",
          400: "#3B82F6",
          500: "#2563EB", // Vibrant Blue
          600: "#1D4ED8",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#172554",
        },
        secondary: {
          10: "#F1F5F9",
          80: "#1E293B",
          100: "#0F172A", // Rich Black / Navy
        },
        accent: {
          orange: "#F59E0B",
          "deep-red": "#EF4444",
          "sky-blue": "#38BDF8",
          success: "#10B981",
        },
        text: {
          primary: "#0F172A", // Almost black
          secondary: "#334155", // Slate tone
          muted: "#94A3B8", // Muted gray-blue
        },
        surface: {
          0: "#FFFFFF", // Pure white
          1: "#F8FAFC", // Light bluish gray
          2: "#E2E8F0", // Border soft gray
        },
        grey: {
          100: "#CBD5E1",
          200: "#94A3B8",
          300: "#64748B",
          400: "#475569",
        },
      },
    },
  },
  plugins: [],
};
