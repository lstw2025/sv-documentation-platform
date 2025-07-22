/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        gray: {
          300: '#d1d5db',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
        },
        red: {
          600: '#dc2626',
          700: '#b91c1c',
        },
        yellow: {
          50: '#fefce8',
          400: '#facc15',
          800: '#92400e',
        }
      }
    },
  },
  plugins: [],
}
