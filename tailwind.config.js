/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#000000',
          surface: '#0a0a0a',
          'surface-hover': '#161616',
          border: '#222222',
          'text-primary': '#d4d4d4',
          'text-secondary': '#666666',
          accent: '#ff8c00',
          positive: '#00c853',
          negative: '#ff1744',
          warning: '#ffab00',
        },
      },
      fontFamily: {
        data: ['JetBrains Mono', 'monospace'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
