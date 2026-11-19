import { Component, createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { S } from './i18n.js'
import './index.css'

// Si algo falla al dibujar la pantalla, en vez de una página en blanco se muestra un aviso (en el idioma elegido) con botón para recargar.
class Guard extends Component {
  constructor(p) { super(p); this.state = { e: false } }
  static getDerivedStateFromError() { return { e: true } }
  render() {
    if (!this.state.e) return this.props.children
    let li = 0
    try { const n = +localStorage.getItem('dt_l'); if (n >= 0 && n < S.crash.length) li = n } catch (e) {}
    return h('div', { role: 'alert', className: 'min-h-screen grid place-items-center p-6 text-center' },
      h('div', { className: 'max-w-sm' },
        h('p', { className: 'text-xl font-semibold mb-6' }, S.crash[li]),
        h('button', { type: 'button', onClick: () => window.location.reload(), className: 'min-h-[3.5rem] px-6 rounded-xl text-lg font-bold bg-brand text-bi' }, S.reload[li])))
  }
}

createRoot(document.getElementById('root')).render(h(Guard, null, h(App)))

// Offline a partir de la segunda visita (solo en producción).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
