/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '120': '30rem', // 480px (25% wider than w-96 which is 384px)
      }
    },
  },
  plugins: [],
};
