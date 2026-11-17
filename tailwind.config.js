/** @type {import('tailwindcss').Config} */
// Los colores salen de variables CSS (src/index.css) para soportar modo oscuro.
const tokens = ['bg', 'card', 'ink', 'mute', 'brand', 'bi', 'acc', 'line']

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries(
        tokens.map((k) => [k, `rgb(var(--${k}) / <alpha-value>)`])
      ),
      fontFamily: { serif: ['Georgia', '"Times New Roman"', 'serif'] },
    },
  },
  plugins: [],
}
