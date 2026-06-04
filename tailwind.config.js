/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bebas)'],
        body: ['var(--font-outfit)'],
        mono: ['var(--font-dm-mono)'],
      },
      colors: {
        ink: '#0a0a0a',
        paper: '#f5f0e8',
        cream: '#ede7d9',
        accent: '#c8401a',
        accent2: '#1a6bc8',
        gold: '#c4a032',
        muted: '#8a7d6b',
        border: '#d4c9b8',
      },
    },
  },
  plugins: [],
};
