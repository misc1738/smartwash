// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        "primary-light": "hsl(var(--primary-light))",
        "primary-glow": "hsl(var(--primary-glow))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        glass: "rgba(10, 10, 10, 0.6)",
        "glass-border": "rgba(212, 175, 55, 0.2)",
        gold: {
          100: "#e0f2fe", // Sky 100
          200: "#bae6fd", // Sky 200
          300: "#7dd3fc", // Sky 300
          400: "#3b82f6", // Blue 500 (Base "Gold" replacement)
          500: "#2563eb", // Blue 600
          600: "#1d4ed8", // Blue 700
          700: "#1e40af", // Blue 800
        }
      },
      borderRadius: {
        lg: "var(--radius)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        hover: "var(--shadow-hover)",
        glow: "0 0 20px rgba(59, 130, 246, 0.5)",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-card": "var(--gradient-card)",
        "gradient-gold": "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
        "gradient-dark": "linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, #0f172a 100%)",
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      transitionProperty: {
        smooth: "var(--transition-smooth)",
      },
    },
  },
  plugins: [],
};
