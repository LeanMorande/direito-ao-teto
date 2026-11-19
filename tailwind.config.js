/** @type {import('tailwindcss').Config} */
// Los colores salen de variables CSS (src/index.css) para soportar modo oscuro.
const tokens = ['bg', 'card', 'ink', 'mute', 'brand', 'bi', 'acc', 'line', 'band', 'band2', 'red']

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries(
        tokens.map((k) => [k, `rgb(var(--${k}) / <alpha-value>)`])
      ),
      fontFamily: { serif: ['Georgia', '"Times New Roman"', 'serif'] },
      boxShadow: { card: '0 22px 44px -26px rgb(15 23 42 / .5), 0 2px 8px -2px rgb(15 23 42 / .12)' },
    },
  },
  plugins: [],
}
