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
trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>'};
export const I=({n,s=24})=>h('svg',{width:s,height:s,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':'true',className:'shrink-0',dangerouslySetInnerHTML:{__html:P[n]}});

export const inp = 'w-full min-h-[3.5rem] rounded-xl border-2 bg-card px-4 py-2 text-lg '
export const btn = 'min-h-[3.5rem] px-6 rounded-xl text-lg font-bold flex items-center justify-center gap-2 '

export const Fld = ({ id, label, hint, err, children }) =>
  h('div', { className: 'mb-6' },
    h('label', { htmlFor: id, className: 'block text-lg font-semibold mb-1' }, label),
    hint ? h('p', { id: id + 'h', className: 'text-mute mb-2' }, hint) : null,
    children,
    err ? h('p', { id: id + 'e', role: 'alert', className: 'mt-2 font-semibold text-acc flex gap-2 items-center' }, h(I, { n: 'tri', s: 20 }), err) : null)

export const Opt = ({ id, type, name, on, set, txt }) =>
  h('label', { className: 'flex items-center gap-4 min-h-[3.5rem] p-4 mb-3 rounded-xl border-2 cursor-pointer ' + (on ? 'border-brand bg-brand/10' : 'border-line bg-card') },
    h('input', { id, type: type || 'checkbox', name, checked: on, onChange: set, className: 'w-7 h-7 shrink-0 accent-[rgb(var(--brand))]' }),
    h('span', { className: 'text-lg' }, txt))

/* Banderas SVG (funcionan en cualquier móvil, sin depender de emojis) */
const star = (i) => '<circle cx="' + (22 + 10 * Math.cos(i * Math.PI / 5)).toFixed(1) + '" cy="' + (28 + 10 * Math.sin(i * Math.PI / 5)).toFixed(1) + '" r="1.6" fill="#F7D116"/>'
const FL = {
  pt: '<rect width="24" height="40" fill="#006600"/><rect x="24" width="36" height="40" fill="#FF0000"/><circle cx="24" cy="20" r="7.5" fill="#FFCC00"/><rect x="20.5" y="15.5" width="7" height="9" rx="1.5" fill="#fff" stroke="#FF0000" stroke-width="1.6"/>',
  es: '<rect width="60" height="40" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/>',
  en: '<rect width="60" height="40" fill="#012169"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="7"/><path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0V40M0 20H60" stroke="#fff" stroke-width="11"/><path d="M30 0V40M0 20H60" stroke="#C8102E" stroke-width="6"/>',
  kr: '<rect width="60" height="40" fill="#003893"/><rect y="22" width="60" height="4" fill="#fff"/><rect y="26" width="60" height="4" fill="#CF2027"/><rect y="30" width="60" height="4" fill="#fff"/>' + Array.from({ length: 10 }, (_, i) => star(i)).join(''),
}
export const Flag = ({ c }) => h('svg', { viewBox: '0 0 60 40', width: 28, height: 19, 'aria-hidden': 'true', className: 'shrink-0 rounded-sm border border-line', dangerouslySetInnerHTML: { __html: FL[c] } })

/* Índice = posición en los textos [pt, es, kr, en] de i18n.js */
export const LANGS = [{ i: 0, c: 'pt', n: 'Português', l: 'pt-PT' }, { i: 1, c: 'es', n: 'Español', l: 'es' }, { i: 3, c: 'en', n: 'English', l: 'en' }, { i: 2, c: 'kr', n: 'Kriolu', l: 'kea' }]

export function LangMenu({ li, setLi, label }) {
  const [o, setO] = useState(false), r = useRef(null)
  useEffect(() => {
    if (!o) return
    const away = (e) => { if (r.current && !r.current.contains(e.target)) setO(false) }
    const esc = (e) => { if (e.key === 'Escape') setO(false) }
    document.addEventListener('pointerdown', away); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [o])
  const cur = LANGS.find((l) => l.i === li)
  return h('div', { ref: r, className: 'relative' },
    h('button', { type: 'button', 'aria-haspopup': 'listbox', 'aria-expanded': o, 'aria-label': label, onClick: () => setO(!o), className: 'min-h-[2.75rem] px-3 rounded-lg border-2 border-line bg-card flex items-center gap-2 font-semibold' },
      h(Flag, { c: cur.c }), cur.n, h(I, { n: 'chev', s: 18 })),
    o ? h('ul', { role: 'listbox', 'aria-label': label, className: 'absolute right-0 z-40 mt-2 w-52 rounded-xl border-2 border-line bg-card shadow-lg overflow-hidden' },
      LANGS.map((l) => h('li', { key: l.c, role: 'presentation' },
        h('button', { type: 'button', role: 'option', lang: l.l, 'aria-selected': l.i === li, onClick: () => { setLi(l.i); setO(false) }, className: 'w-full min-h-[3rem] px-3 flex items-center gap-3 text-left ' + (l.i === li ? 'bg-brand/10 font-bold' : '') }, h(Flag, { c: l.c }), l.n)))) : null)
}
