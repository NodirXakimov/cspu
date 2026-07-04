/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // mirror Element Plus primary so Tailwind + EP stay visually in sync
        brand: {
          DEFAULT: '#409eff',
          50: '#ecf5ff',
          100: '#d9ecff',
          200: '#c6e2ff',
          300: '#a0cfff',
          400: '#79bbff',
          500: '#409eff',
          600: '#337ecc',
          700: '#2b6cb0',
          800: '#1f5490',
          900: '#153e6b',
        },
      },
    },
  },
  // Element Plus injects its own resets; keep Tailwind preflight but let EP win where needed
  corePlugins: {
    preflight: true,
  },
  plugins: [],
}
