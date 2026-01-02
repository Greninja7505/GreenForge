/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep Blue to Indigo gradient base
        "deep-blue": "#101C3D",
        indigo: "#3D63AB",
        "navy-dark": "#13184B",
        "navy-indigo": "#2A2953",

        // Accent colors
        "soft-purple": "#6B59D3",
        "electric-blue": "#407BFF",
        "bright-teal": "#36D1C4",
        "primary-blue": "#3771FF",
        "vibrant-purple": "#7F56D9",
        violet: "#635BFF",

        // Highlight colors
        "mint-green": "#49E4A4",
        "accent-orange": "#FF6B4A",
        "gradient-orange": "#FF9354",
        "highlight-purple": "#A974FF",
        aqua: "#3CF2FF",
        "soft-pink": "#FFB5D2",

        // Neutral/Background colors
        "near-black": "#151924",
        "dark-charcoal": "#212936",
        "card-dark": "#242A38",
        "off-white": "#F9FAFB",
        "light-grey": "#EEF1F4",
        "neutral-grey": "#EFEFEF",
        "ultra-light": "#F7F7FA",

        // Typography
        "text-grey": "#C9CCD9",
        "text-soft-grey": "#C1C9D2",
        "text-dark": "#23272F",
        "heading-dark": "#2E2E2E",

        primary: {
          50: "#E6F0FF",
          100: "#CCE1FF",
          200: "#99C3FF",
          300: "#66A5FF",
          400: "#407BFF",
          500: "#3771FF",
          600: "#0052E6",
          700: "#003DB3",
          800: "#002980",
          900: "#00144D",
        },
        accent: {
          50: "#F0E6FF",
          100: "#E1CCFF",
          200: "#C399FF",
          300: "#A566FF",
          400: "#8733FF",
          500: "#7F56D9",
          600: "#6B59D3",
          700: "#5744B3",
          800: "#432F8C",
          900: "#2F1A66",
        },
        dark: {
          50: "#F7F7FA",
          100: "#EFEFEF",
          200: "#C9CCD9",
          300: "#94a3b8",
          400: "#64748b",
          500: "#475569",
          600: "#334155",
          700: "#242A38",
          800: "#212936",
          900: "#151924",
          950: "#101C3D",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        sm: ["14px", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        base: ["16px", { lineHeight: "1.6", letterSpacing: "0" }],
        lg: ["18px", { lineHeight: "1.6", letterSpacing: "0" }],
        xl: ["20px", { lineHeight: "1.5", letterSpacing: "-0.01em" }],
        "2xl": ["24px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        "3xl": ["30px", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "4xl": ["36px", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "5xl": ["48px", { lineHeight: "1.2", letterSpacing: "-0.03em" }],
        "6xl": ["60px", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "7xl": ["72px", { lineHeight: "1.1", letterSpacing: "-0.04em" }],
        "8xl": ["96px", { lineHeight: "1", letterSpacing: "-0.04em" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "slide-left": "slideLeft 0.6s ease-out",
        "slide-right": "slideRight 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
