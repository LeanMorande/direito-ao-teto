import { createElement as h, useState, useEffect, useRef } from 'react'
import { S } from './i18n.js'
import { CONFIG } from './config.js'
import { I, inp, btn } from './ui.js'

/* Sugerencias de prueba: se guardan solo en este teléfono (sin datos personales) hasta que se envían. */
const KEY = 'dt_fb'
export const loadFb = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch (e) { return [] } }
const saveFb = (a) => { try { localStorage.setItem(KEY, JSON.stringify(a)) } catch (e) {} }

const device = () => {
  const ua = navigator.userAgent || ''
  return [window.innerWidth + 'x' + window.innerHeight + ' @' + (window.devicePixelRatio || 1) + 'x', (ua.match(/Android [\d.]+/) || [])[0], (ua.match(/(Chrome|Firefox|Version)\/\d+/) || [])[0]].filter(Boolean).join(' · ')
}
// El informe va siempre en español (lo lee el desarrollador) y NUNCA incluye datos del formulario.
export const buildReport = (fb, extra) =>
  'INFORME DE PRUEBAS · Direito ao Teto v' + CONFIG.version + '\n' +
  new Date().toISOString().slice(0, 16).replace('T', ' ') + ' · ' + device() + ' · ' + extra + '\n\n' +
  fb.map((x, i) => (i + 1) + ') [' + x.c + '] ' + x.t).join('\n\n')

export function Sheet({ li, mode, setMode, close, ctx, extra, fb, setFb }) {
  const t = (k) => S[k][li]
  const [tx, setTx] = useState(''), [saved, setSaved] = useState(false), [cp, setCp] = useState(false)
  const hd = useRef(null)
  useEffect(() => { hd.current && hd.current.focus() }, [mode])
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', k)
    const o = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = o }
  }, [])
  const txt = buildReport(fb, extra)
  const save = () => {
    const v = tx.trim()
    if (!v) return
    const n = fb.concat([{ c: ctx, t: v.slice(0, 600) }])
    setFb(n); saveFb(n); setTx(''); setSaved(true)
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(txt) } catch (e) { const a = document.getElementById('rp'); if (a) { a.select(); document.execCommand('copy') } }
    setCp(true); setTimeout(() => setCp(false), 2000)
  }
  const wipe = () => { if (window.confirm(t('clear') + '?')) { setFb([]); saveFb([]) } }
  const wa = 'https://wa.me/' + CONFIG.feedback.whatsapp + '?text=' + encodeURIComponent(txt)
  const sec = 'min-h-[3rem] px-4 rounded-xl border-2 border-brand text-brand font-bold flex items-center justify-center gap-2 '
  const sec2 = 'min-h-[3rem] px-4 rounded-xl border-2 border-line font-bold flex items-center justify-center gap-2 '

  const nuevo = h('div', null,
    h('p', { className: 'text-sm text-mute mb-3' }, ctx),
    h('textarea', { id: 'fbx', 'aria-label': t('fbT'), rows: 4, maxLength: 600, value: tx, placeholder: t('fbP'), onChange: (e) => { setTx(e.target.value); setSaved(false) }, className: inp + 'border-line mb-3' }),
    h('p', { className: 'flex gap-2 text-mute mb-4' }, h(I, { n: 'lock', s: 20 }), t('fbW')),
    saved ? h('p', { role: 'status', className: 'mb-4 font-semibold text-brand flex gap-2 items-center' }, h(I, { n: 'check', s: 20 }), t('fbOk')) : null,
    h('div', { className: 'flex flex-col gap-3 sm:flex-row' },
      h('button', { type: 'button', onClick: save, disabled: !tx.trim(), className: btn + 'grow bg-brand text-bi disabled:opacity-50' }, t('fbS')),
      fb.length ? h('button', { type: 'button', onClick: () => setMode('report'), className: btn + 'border-2 border-brand text-brand' }, t('fbR') + ' (' + fb.length + ')') : null))

  const informe = h('div', null,
    !fb.length ? h('p', { className: 'mb-4' }, t('none')) : h('div', null,
      h('p', { className: 'text-mute mb-3' }, t('fbRh')),
      h('textarea', { id: 'rp', readOnly: true, rows: 10, value: txt, className: inp + 'border-line mb-4 text-sm' }),
      h('div', { className: 'grid grid-cols-2 gap-3 mb-4' },
        typeof navigator.share === 'function' ? h('button', { type: 'button', onClick: () => navigator.share({ title: 'Direito ao Teto', text: txt }).catch(() => {}), className: sec }, h(I, { n: 'share', s: 20 }), t('share')) : null,
        h('a', { href: wa, target: '_blank', rel: 'noopener noreferrer', className: sec }, h(I, { n: 'send', s: 20 }), 'WhatsApp'),
        h('button', { type: 'button', onClick: copy, className: sec }, h(I, { n: 'copy', s: 20 }), cp ? t('copied') : t('copy')),
        h('button', { type: 'button', onClick: wipe, className: sec2 }, h(I, { n: 'trash', s: 20 }), t('clear')))),
    h('button', { type: 'button', onClick: () => setMode('new'), className: btn + 'w-full border-2 border-line' }, t('nova')))

  return h('div', { className: 'fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60', onClick: (e) => { if (e.target === e.currentTarget) close() } },
    h('div', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'fbt', className: 'w-full max-w-xl max-h-[92vh] overflow-auto rounded-t-3xl sm:rounded-3xl bg-card text-ink border-2 border-line p-5' },
      h('div', { className: 'flex items-start justify-between gap-3 mb-3' },
        h('h2', { id: 'fbt', ref: hd, tabIndex: -1, className: 'font-serif text-2xl font-bold outline-none' }, mode === 'new' ? t('fbT') : t('fbRT')),
        h('button', { type: 'button', 'aria-label': t('close'), onClick: close, className: 'min-h-[2.75rem] min-w-[2.75rem] grid place-items-center rounded-lg border-2 border-line shrink-0' }, h(I, { n: 'x' }))),
      mode === 'new' ? nuevo : informe))
}
