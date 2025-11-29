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
          100: "#F9F1D8",
          200: "#F0DEAA",
          300: "#E6CB7D",
          400: "#D4AF37", // Base Gold
          500: "#AA8C2C",
          600: "#806921",
          700: "#554616",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        hover: "var(--shadow-hover)",
        glow: "0 0 20px rgba(212, 175, 55, 0.3)",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-card": "var(--gradient-card)",
        "gradient-gold": "linear-gradient(135deg, #F0DEAA 0%, #D4AF37 50%, #AA8C2C 100%)",
        "gradient-dark": "linear-gradient(180deg, rgba(10,10,10,0) 0%, #0a0a0a 100%)",
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
