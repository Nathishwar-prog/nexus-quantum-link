
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        'quantum': ['Orbitron', 'monospace'],
        'cyber': ['Rajdhani', 'sans-serif'],
      },
      colors: {
        'neon-blue': '#00f3ff',
        'neon-purple': '#bc13fe',
        'neon-pink': '#ff2d94',
        'neon-green': '#0cff92',
        'dark-bg': '#080815',
        'glass-bg': 'rgba(16, 18, 35, 0.8)',
        'text-color': '#e0e0ff',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'glitch': {
          '0%, 100%': {
            textShadow: '0 0 2px #bc13fe, 0 0 4px #00f3ff',
            transform: 'translateX(0)'
          },
          '94.9%': {
            textShadow: '0 0 2px #bc13fe, 0 0 4px #00f3ff',
            transform: 'translateX(0)'
          },
          '95%': {
            textShadow: '-2px 0 2px #ff2d94, 2px 0 2px #00f3ff',
            transform: 'translateX(2px)'
          },
          '95.5%': {
            textShadow: '2px 0 2px #ff2d94, -2px 0 2px #00f3ff',
            transform: 'translateX(-2px)'
          },
          '96%': {
            textShadow: '0 0 2px #bc13fe, 0 0 4px #00f3ff',
            transform: 'translateX(0)'
          }
        },
        'scan': {
          '0%, 100%': {
            top: '-10px',
            opacity: '0'
          },
          '20%, 80%': {
            opacity: '0.8'
          },
          '50%': {
            top: '100%'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(0.8)',
            opacity: '0.8'
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '1'
          }
        },
        'matrix-rain': {
          '0%': {
            transform: 'translateY(-100vh)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(100vh)',
            opacity: '0'
          }
        },
        'quantum-float': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)'
          },
          '33%': {
            transform: 'translate(30px, -30px) rotate(120deg)'
          },
          '66%': {
            transform: 'translate(-20px, 20px) rotate(240deg)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glitch': 'glitch 5s infinite',
        'scan': 'scan 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'matrix-rain': 'matrix-rain 3s linear infinite',
        'quantum-float': 'quantum-float 6s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
