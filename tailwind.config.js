/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563EB',
          purple: '#7C3AED',
          lightBlue: '#3B82F6',
          lightPurple: '#8B5CF6',
          bg: '#F8FAFC',
        },
        brand: {
          blue: '#2563EB',
          purple: '#7C3AED',
          dark: '#111827',
          gray: '#6B7280',
          green: '#22C55E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.15)',
      }
    },
  },
  plugins: [],
}
