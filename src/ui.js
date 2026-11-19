import { createElement as h, useState, useEffect, useRef } from 'react'

const P={
home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
right:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
left:'<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
dl:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
drop:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
euro:'<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
print:'<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
pen:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
bank:'<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
badge:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
tri:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
chev:'<path d="m6 9 6 6 6-6"/>',
copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
auto:'<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/>',
file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
app:'<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
off:'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'};
export const I=({n,s=24,c})=>h('svg',{width:s,height:s,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':'true',className:'shrink-0'+(c?' '+c:''),dangerouslySetInnerHTML:{__html:P[n]}});

export const inp = 'w-full min-h-[3.5rem] rounded-xl border-2 bg-card px-4 py-2 text-lg transition-colors focus:border-brand '
export const btn = 'min-h-[3.5rem] px-6 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition active:scale-[.985] '
// Botón en forma de pastilla para la barra de la cabecera (idioma, tamaño de letra)
export const pill = 'min-h-[2.75rem] px-4 rounded-full border-2 border-white/30 bg-card text-ink shadow-md flex items-center gap-2 font-semibold transition active:scale-[.97] '

// Vibración corta (solo móviles que la permiten; nunca falla)
export const buzz = (p) => { try { if (navigator.vibrate) navigator.vibrate(p) } catch (e) {} }
// Sacudida del campo con error (Web Animations; se omite con "reducir movimiento")
export const shake = (el) => {
  try {
    if (!el || !el.animate || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 320, easing: 'ease-out' })
  } catch (e) {}
}

export const Fld = ({ id, label, hint, err, ok, children }) =>
  h('div', { className: 'mb-6' },
    h('div', { className: 'flex items-center justify-between gap-2 mb-1' },
      h('label', { htmlFor: id, className: 'block text-lg font-semibold' }, label),
      ok && !err ? h('span', { className: 'text-brand shrink-0 pop', 'aria-hidden': 'true' }, h(I, { n: 'check', s: 22 })) : null),
    hint ? h('p', { id: id + 'h', className: 'text-mute mb-2' }, hint) : null,
    children,
    err ? h('p', { id: id + 'e', role: 'alert', className: 'mt-2 font-semibold text-acc flex gap-2 items-start' }, h('span', { className: 'mt-1' }, h(I, { n: 'tri', s: 20 })), err) : null)

export const Opt = ({ id, type, name, on, set, txt }) =>
  h('label', { className: 'flex items-center gap-4 min-h-[3.5rem] p-4 mb-3 rounded-xl border-2 cursor-pointer transition active:scale-[.99] ' + (on ? 'border-brand bg-brand/10' : 'border-line bg-card') },
    h('input', { id, type: type || 'checkbox', name, checked: on, onChange: set, className: 'w-7 h-7 shrink-0 accent-[rgb(var(--brand))]' }),
    h('span', { className: 'text-lg' }, txt))

/* Banderas SVG (funcionan en cualquier móvil, sin depender de emojis) */
const star = (i) => '<circle cx="' + (22 + 10 * Math.cos(i * Math.PI / 5)).toFixed(1) + '" cy="' + (28 + 10 * Math.sin(i * Math.PI / 5)).toFixed(1) + '" r="1.6" fill="#F7D116"/>'
const FL = {
  pt: '<rect width="24" height="40" fill="#006600"/><rect x="24" width="36" height="40" fill="#FF0000"/><circle cx="24" cy="20" r="7.5" fill="#FFCC00"/><rect x="20.5" y="15.5" width="7" height="9" rx="1.5" fill="#fff" stroke="#FF0000" stroke-width="1.6"/>',
  es: '<rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/>',
  en: '<rect width="60" height="40" fill="#012169"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="7"/><path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="11"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="6"/>',
  kr: '<rect width="60" height="40" fill="#003893"/><rect y="22" width="60" height="4" fill="#fff"/><rect y="26" width="60" height="4" fill="#CF2027"/><rect y="30" width="60" height="4" fill="#fff"/>' + Array.from({ length: 10 }, (_, i) => star(i)).join(''),
  fr: '<rect width="20" height="40" fill="#0055A4"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#EF4135"/>',
  bn: '<rect width="60" height="40" fill="#006A4E"/><circle cx="27" cy="20" r="11" fill="#F42A41"/>',
}
export const Flag = ({ c }) => h('svg', { viewBox: '0 0 60 40', width: 28, height: 19, 'aria-hidden': 'true', className: 'shrink-0 rounded-sm border border-line', dangerouslySetInnerHTML: { __html: FL[c] } })

/* i = posición en los textos [pt, es, kr, en, fr, bn] de i18n.js · l = código BCP-47 (atributo lang). El orden de la lista es el del menú. */
export const LANGS = [
  { i: 0, c: 'pt', n: 'Português', l: 'pt-PT' }, { i: 1, c: 'es', n: 'Español', l: 'es' }, { i: 3, c: 'en', n: 'English', l: 'en' },
  { i: 2, c: 'kr', n: 'Kriolu', l: 'kea' }, { i: 4, c: 'fr', n: 'Français', l: 'fr' }, { i: 5, c: 'bn', n: 'বাংলা', l: 'bn' },
]
export const LC = [], LK = []
LANGS.forEach((x) => { LC[x.i] = x.l; LK[x.i] = x.c })

// Cierra un menú al pulsar fuera o con Escape
export function useAway(o, setO, r) {
  useEffect(() => {
    if (!o) return
    const away = (e) => { if (r.current && !r.current.contains(e.target)) setO(false) }
    const esc = (e) => { if (e.key === 'Escape') setO(false) }
    document.addEventListener('pointerdown', away); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [o])
}

export function LangMenu({ li, setLi, label }) {
  const [o, setO] = useState(false), r = useRef(null)
  useAway(o, setO, r)
  const cur = LANGS.find((l) => l.i === li) || LANGS[0]
  return h('div', { ref: r, className: 'relative' },
    h('button', { type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': o, 'aria-label': label + ': ' + cur.n, onClick: () => setO(!o), className: pill },
      h(Flag, { c: cur.c }), h('span', { lang: cur.l }, cur.n), h(I, { n: 'chev', s: 18, c: 'transition-transform ' + (o ? 'rotate-180' : '') })),
    o ? h('ul', { role: 'listbox', 'aria-label': label, className: 'pop absolute left-0 z-40 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-2xl border-2 border-line bg-card text-ink shadow-xl overflow-hidden' },
      LANGS.map((l) => h('li', { key: l.c, role: 'presentation' },
        h('button', { type: 'button', role: 'option', lang: l.l, 'aria-selected': l.i === li, onClick: () => { setLi(l.i); setO(false) }, className: 'w-full min-h-[3.25rem] px-4 flex items-center gap-3 text-left transition-colors hover:bg-brand/10 ' + (l.i === li ? 'bg-brand/10 font-bold' : '') },
          h(Flag, { c: l.c }), h('span', { className: 'grow' }, l.n), l.i === li ? h(I, { n: 'check', s: 20, c: 'text-brand' }) : null)))) : null)
}

/* Casa que se construye con los pasos: n = tramos dibujados (0-4, uno por paso del asistente). done = documento listo (se rellena y "salta").
   Cada tramo se anima al cambiar n; el tejado usa el rojo del logo. */
const HP = ['M6 52H58M14 52V30H50V52', 'M27 52V41a5 5 0 0 1 10 0V52', 'M8 33 32 11 56 33', 'M45 21V12h6v15M18 37h7v7h-7z']
export function House({ n, done, c }) {
  const [k, setK] = useState(Math.max(0, n - 1))
  useEffect(() => { const t = setTimeout(() => setK(n), 60); return () => clearTimeout(t) }, [n])
  return h('svg', { viewBox: '0 0 64 56', className: 'house ' + (done ? 'done ' : '') + (c || ''), 'aria-hidden': 'true' },
    h('path', { d: HP.join(''), className: 'hg' }),
    h('path', { d: 'M14 52V30H50V52ZM8 33 32 11 56 33Z', className: 'hf' }),
    HP.map((d, i) => h('path', { key: i, d, pathLength: 1, className: 'hs' + (i === 2 ? ' rf' : '') + (k > i ? ' on' : '') })))
}

/* Tilde animada con salpicadura de puntos (pantalla final) */
const PT = Array.from({ length: 14 }, (_, i) => { const a = i * (Math.PI * 2 / 14) + 0.2, d = 52 + (i % 3) * 12; return { x: Math.round(Math.cos(a) * d), y: Math.round(Math.sin(a) * d), c: ['--brand', '--red', '--acc'][i % 3] } })
export const Check = () => h('div', { className: 'relative w-24 h-24 text-brand', 'aria-hidden': 'true' },
  PT.map((p, i) => h('span', { key: i, className: 'bp', style: { '--x': p.x + 'px', '--y': p.y + 'px', background: 'rgb(var(' + p.c + '))' } })),
  h('svg', { viewBox: '0 0 52 52', className: 'w-full h-full' },
    h('circle', { cx: 26, cy: 26, r: 23, pathLength: 1, className: 'ring', fill: 'rgb(var(--brand) / .12)', stroke: 'currentColor', strokeWidth: 3 }),
    h('path', { d: 'M15 27l8 8 14-16', pathLength: 1, className: 'ck', fill: 'none', stroke: 'currentColor', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' })))
