/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#06070d',
        panel: '#0b0d18',
        line: 'rgba(255,255,255,0.08)',
        brand: {
          300: '#9db4ff',
          400: '#7c96ff',
          500: '#5b6cff',
          600: '#4353f0',
        },
        accent: '#7ef0d4',
        gold: '#ffd58a',
      },
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'glow-brand': '0 0 40px rgba(91,108,255,0.35)',
        'glow-soft': '0 20px 60px rgba(0,0,0,0.55)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(ellipse at center, rgba(91,108,255,0.18) 0%, rgba(6,7,13,0) 65%)',
      },
    },
  },
  plugins: [],
}
