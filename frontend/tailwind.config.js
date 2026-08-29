/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern SaaS Light Color System
        gov: {
          bg: '#F8FAFC',           // Crisp canvas slate-50
          surface: '#FFFFFF',      // Pure white surface
          card: '#FFFFFF',         // White card container
          elevated: '#F1F5F9',     // Slate-100 hover/elevated
          hover: '#F1F5F9',        // Slate-100
          border: '#E2E8F0',       // Slate-200 standard border
          borderSubtle: '#F1F5F9', // Slate-100 subtle divider
          borderLight: '#CBD5E1',  // Slate-300 light emphasis border
          'text-primary': '#0F172A',   // Slate-900 high contrast dark text
          'text-secondary': '#334155', // Slate-700 secondary text
          'text-muted': '#64748B',     // Slate-500 muted text
          'text-disabled': '#94A3B8',  // Slate-400 disabled text
          text: {
            primary: '#0F172A',
            secondary: '#334155',
            muted: '#64748B',
            disabled: '#94A3B8'
          }
        },
        // Modern SaaS Primary Blue Palette
        cyan: {
          accent: '#0284C7',       // Sky-600
          glow: '#0284C7',
          deep: '#0369A1'
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',          // SaaS Blue Primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        // Semantic SaaS Risk Colors
        risk: {
          low: '#059669',          // Emerald Green
          medium: '#D97706',       // Amber
          high: '#EA580C',         // Orange
          critical: '#DC2626'      // Red
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        'command-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'command-elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'cyan-glow': '0 1px 3px 0 rgba(2, 132, 199, 0.15)',
        'risk-critical-glow': '0 1px 3px 0 rgba(220, 38, 38, 0.15)',
        'saas-card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'saas-hover': '0 4px 12px 0 rgba(15, 23, 42, 0.08), 0 2px 4px 0 rgba(15, 23, 42, 0.04)'
      },
      borderRadius: {
        'card': '10px',
        'btn': '6px',
        'badge': '4px'
      }
    },
  },
  plugins: [],
}
