import { createElement as h, useState, useRef } from 'react'
import { S } from './i18n.js'
import { I, pill, useAway } from './ui.js'

/* Panel "Aa": tamaño de letra (4 botones con una A cada vez mayor) y aspecto (auto / claro / oscuro).
   El panel se abre debajo del botón y la página cambia en directo, así se ve el efecto al pulsar. */
export const PRESETS = [1, 2, 4, 6] // posiciones de FS en App.jsx: 90 %, 100 %, 125 %, 150 %
const GLYPH = [0.9, 1.3, 1.8, 2.4]  // tamaño (rem) de la "A" de muestra de cada botón
const TH = ['auto', 'sun', 'moon']

export function TextPanel({ li, fi, setFi, th, setTh, cls }) {
  const [o, setO] = useState(false), r = useRef(null)
  useAway(o, setO, r)
  const t = S.fsT[li]
  const seg = (on) => 'flex flex-col items-center justify-start gap-1 min-h-[4.25rem] rounded-xl border-2 px-1 py-2 text-center transition active:scale-[.97] ' + (on ? 'border-brand bg-brand text-bi' : 'border-line bg-card hover:border-brand')
  return h('div', { ref: r, className: 'relative ' + (cls || '') },
    h('button', { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': o, 'aria-controls': 'tp', 'aria-label': t, onClick: () => setO(!o), className: pill },
      h('span', { 'aria-hidden': 'true', className: 'font-bold leading-none' }, h('span', { className: 'text-xl' }, 'A'), h('span', { className: 'text-sm' }, 'a')),
      h('span', null, S.fsB[li])),
    o ? h('div', { id: 'tp', role: 'dialog', 'aria-label': t, className: 'pop absolute right-0 z-40 mt-2 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border-2 border-line bg-card text-ink shadow-xl p-4' },
      h('p', { className: 'font-bold mb-3' }, t),
      h('div', { role: 'radiogroup', 'aria-label': t, className: 'grid grid-cols-4 gap-2 mb-5' },
        PRESETS.map((idx, k) => h('button', { key: k, type: 'button', role: 'radio', 'aria-checked': fi === idx, onClick: () => setFi(idx), className: seg(fi === idx) },
          h('span', { 'aria-hidden': 'true', className: 'flex items-end justify-center h-10 font-serif font-bold leading-none', style: { fontSize: GLYPH[k] + 'rem' } }, 'A'),
          h('span', { className: 'text-xs leading-tight' }, S.sz[li][k])))),
      h('p', { className: 'font-bold mb-3' }, S.thT[li]),
      h('div', { role: 'radiogroup', 'aria-label': S.thT[li], className: 'grid grid-cols-3 gap-2' },
        TH.map((ic, k) => h('button', { key: k, type: 'button', role: 'radio', 'aria-checked': th === k, onClick: () => setTh(k), className: seg(th === k) },
          h(I, { n: ic, s: 24 }), h('span', { className: 'text-xs leading-tight' }, S.thm[li][k]))))) : null)
}
