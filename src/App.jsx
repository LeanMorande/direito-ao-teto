import { createElement as h, useState, useEffect, useRef } from 'react'
import { S, SC, DS, MUN } from './i18n.js'
import { makePdf, loadPdf, nifOk } from './legal.js'
import { CONFIG } from './config.js'
import { I, Fld, Opt, LangMenu, inp, btn } from './ui.js'
import { Sheet, loadFb } from './feedback.js'

const FS = ['80%', '90%', '100%', '112.5%', '125%', '137.5%', '150%'] // tamaños de letra (por defecto 100%)
const LC = ['pt-PT', 'es', 'kea', 'en']
const LK = ['pt', 'es', 'kr', 'en']
const NAMES = ['Pedido', 'Municipio', 'Datos', 'Situación', 'Revisar'] // para el informe de sugerencias
const TOP = ['Lisboa', 'Porto', 'Amadora', 'Sintra', 'Loures', 'Odivelas', 'Oeiras', 'Cascais', 'Almada', 'Seixal', 'Vila Nova de Gaia', 'Matosinhos']
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const E0 = { sc: '', mun: '', nome: '', doc: '', morada: '', tel: '', kids: false, old: false, dis: false, why: 'despejo', srv: 'agua', rent: '', arr: '', dt: '', extra: '', ok: false }
const rd = (k, d) => { try { const v = localStorage.getItem(k); if (v !== null) return +v } catch (e) {} return d }

const V = (s, f, l) => {
  const e = {}, r = S.e.req[l], d = f.doc
  if (s === 1 && f.mun.trim().length < 3) e.mun = r
  if (s === 2) {
    if (!/\S+\s+\S+/.test(f.nome.trim())) e.nome = r
    if (f.morada.trim().length < 5) e.morada = r
    if (!/^\+?\d{9,15}$/.test(f.tel.replace(/\s/g, ''))) e.tel = S.e.tel[l]
    if (d && !(d.length === 11 || (d.length === 9 && nifOk(d)))) e.doc = S.e.doc[l]
  }
  if (s === 3 && f.sc === 'c' && !/^\d{1,5}([.,]\d{1,2})?$/.test(f.rent.trim())) e.rent = r
  if (s === 4 && !f.ok) e.ok = S.e.ok[l]
  return e
}

export default function App() {
  const nl = navigator.language || ''
  const [li, setLi] = useState(() => rd('dt_l', /^es/i.test(nl) ? 1 : /^en/i.test(nl) ? 3 : 0))
  const [fi, setFi] = useState(() => Math.min(Math.max(rd('dt_fs', 2), 0), FS.length - 1))
  const [step, setStep] = useState(0), [v, setV] = useState('w') // v: 'w' asistente · 'd' PDF listo · 'g' próximos pasos
  const [f, setF] = useState(E0), [er, setEr] = useState({})
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState(''), [logo, setLogo] = useState(null)
  const [fb, setFb] = useState(loadFb), [fo, setFo] = useState(null) // fo: null | 'new' | 'report'
  const hr = useRef(null), first = useRef(true), fr = useRef(f)
  fr.current = f
  const st0 = f.sc ? step : 0

  useEffect(() => { document.documentElement.lang = LC[li]; try { localStorage.setItem('dt_l', li) } catch (e) {} }, [li])
  useEffect(() => { document.documentElement.style.setProperty('--fs', FS[fi]); try { localStorage.setItem('dt_fs', fi) } catch (e) {} }, [fi])
  useEffect(() => { if (first.current) { first.current = false; return } window.scrollTo(0, 0); hr.current && hr.current.focus() }, [step, v])
  useEffect(() => {
    const t = setTimeout(() => loadPdf().catch(() => {}), 1500)
    window.history.replaceState({ s: 0, v: 'w' }, '')
    // El botón/gesto Atrás del móvil vuelve al paso anterior (o cierra la hoja de sugerencias).
    const pop = (e) => {
      let s = e.state || { s: 0, v: 'w' }
      if (!fr.current.sc) s = { ...s, s: 0, v: s.v === 'g' ? 'g' : 'w' }
      setStep(s.s); setV(s.v); setFo(s.fo || null)
    }
    window.addEventListener('popstate', pop)
    return () => { clearTimeout(t); window.removeEventListener('popstate', pop) }
  }, [])

  const nav = (s, vv) => { const x = { s, v: vv || 'w' }; setStep(s); setV(x.v); window.history.pushState(x, '') }
  const openFo = (m) => { window.history[fo ? 'replaceState' : 'pushState']({ s: step, v, fo: m }, ''); setFo(m) }
  const closeFo = () => window.history.back()
  const up = (k, val) => { setF((o) => ({ ...o, [k]: val })); setEr((o) => { const n = { ...o }; delete n[k]; return n }) }
  const T = (id, o) => {
    o = o || {}
    return h(o.area ? 'textarea' : 'input', Object.assign({ id, value: f[id], onChange: (e) => up(id, o.fn ? o.fn(e.target.value) : e.target.value), className: inp + (er[id] ? 'border-acc' : 'border-line'), 'aria-invalid': er[id] ? 'true' : 'false', 'aria-describedby': (o.hint ? id + 'h ' : '') + (er[id] ? id + 'e' : '') }, o.p || {}))
  }
  const go = () => {
    const e = V(st0, f, li); setEr(e)
    const k = Object.keys(e)[0]
    if (k) { setTimeout(() => { const el = document.getElementById(k); el && el.focus() }, 0); return }
    nav(st0 + 1)
  }
  async function gen() {
    const e = V(4, f, li); setEr(e)
    if (Object.keys(e).length) return
    setBusy(true); setMsg('')
    try {
      const { jsPDF } = await loadPdf()
      const doc = makePdf(f, jsPDF)
      const slug = f.mun.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      doc.save('requerimento-' + f.sc + '-' + slug + '.pdf')
      if (v !== 'd') nav(4, 'd')
    } catch (x) { setMsg(S.fail[li]) }
    setBusy(false)
  }
  const reset = () => { setF(E0); setEr({}); setMsg(''); nav(0) }

  const sc = SC.find((s) => s.id === f.sc)
  const ctx = (v === 'd' ? 'Descarga lista' : v === 'g' ? 'Próximos pasos' : 'Paso ' + (st0 + 1) + '/5 ' + NAMES[st0]) + (f.sc ? ' · escenario ' + f.sc : '') + ' · idioma ' + LK[li]
  const H = (t) => h('h2', { ref: hr, tabIndex: -1, className: 'font-serif text-3xl font-bold mb-5 outline-none' }, t)

  const head = h('header', { className: 'flex flex-wrap items-center justify-between gap-3 py-4' },
    h('div', { className: 'flex items-center gap-3 min-w-0' },
      h('span', { className: logo ? 'grid place-items-center rounded-xl bg-white p-1 border border-line' : 'hidden' },
        h('img', { src: CONFIG.org.logo, alt: CONFIG.org.name, onLoad: () => setLogo(true), onError: () => setLogo(false), className: 'h-10 w-auto max-w-[8rem] object-contain' })),
      logo ? null : h('span', { className: 'grid place-items-center w-12 h-12 rounded-xl bg-brand text-bi shrink-0' }, h(I, { n: 'home', s: 28 })),
      h('div', { className: 'min-w-0' },
        h('p', { className: 'font-serif text-2xl font-bold leading-none' }, 'Direito ao Teto'),
        h('p', { className: 'text-sm text-mute mt-1' }, S.mov[li]))),
    h('div', { className: 'flex items-center gap-2 w-full sm:w-auto justify-end' },
      h(LangMenu, { li, setLi, label: S.lang[li] }),
      [0, 1].map((d) => h('button', { key: d, type: 'button', 'aria-label': S.a11y[li][d], disabled: d ? fi >= FS.length - 1 : fi <= 0, onClick: () => setFi(fi + (d ? 1 : -1)), className: 'min-h-[2.75rem] min-w-[2.75rem] rounded-lg border-2 border-line font-bold disabled:opacity-40' }, d ? 'A+' : 'A-'))))

  const guide = () => h('div', null,
    DS.map((s, i) => h('div', { key: i, className: 'flex gap-4 p-4 mb-3 rounded-2xl border-2 border-line bg-card' },
      h('span', { className: 'grid place-items-center w-14 h-14 rounded-xl bg-brand text-bi shrink-0' }, h(I, { n: s.ic, s: 28 })),
      h('div', null,
        h('p', { className: 'text-xl font-bold' }, (i + 1) + '. ' + s.t[li]),
        h('p', { className: 'text-mute' }, s.d[li]),
        i === 3 ? h('div', { 'aria-hidden': 'true', className: 'inline-block mt-3 -rotate-3 border-4 border-double border-acc text-acc px-5 py-2 text-center font-bold tracking-widest' }, h('div', { className: 'text-xl' }, S.rec[li]), h('div', { className: 'text-sm tracking-normal' }, '__/__/____ · __:__ · N.º ______')) : null))),
    h('p', { className: 'my-5 text-lg font-semibold' }, S.aft[li]),
    h('p', { className: 'p-4 rounded-xl bg-brand/10' }, S.help[li]))

  const guideLink = (cls, to) => h('button', { type: 'button', onClick: () => nav(to, 'g'), className: cls }, h(I, { n: 'badge', s: 20 }), S.gl[li])

  let body
  if (v === 'd') {
    body = h('div', { className: 'fi' },
      h('div', { className: 'flex items-center gap-3 text-brand mb-2' }, h(I, { n: 'check', s: 36 }), H(S.dT[li])),
      h('p', { className: 'text-xl mb-5' }, S.dS[li]),
      guide(),
      msg ? h('p', { role: 'alert', className: 'mt-4 font-semibold text-acc' }, msg) : null,
      h('div', { className: 'flex flex-col gap-3 sm:flex-row mt-6' },
        h('button', { type: 'button', onClick: gen, disabled: busy, className: btn + 'bg-brand text-bi' }, h(I, { n: 'dl' }), S.again[li]),
        h('button', { type: 'button', onClick: reset, className: btn + 'border-2 border-brand text-brand' }, S.wipe[li])))
  } else if (v === 'g') {
    body = h('div', { className: 'fi' }, H(S.gT[li]), guide(),
      h('button', { type: 'button', onClick: () => window.history.back(), className: btn + 'mt-6 w-full border-2 border-brand text-brand' }, h(I, { n: 'left' }), S.back[li]))
  } else if (st0 === 0) {
    body = h('div', { className: 'fi' },
      h('p', { className: 'text-xl mb-6' }, S.tag[li]), H(S.q0[li]),
      SC.map((s) => h('button', { key: s.id, type: 'button', onClick: () => { up('sc', s.id); nav(1) }, className: 'w-full text-left flex gap-4 items-center p-5 mb-4 rounded-2xl border-2 border-line bg-card hover:border-brand' },
        h('span', { className: 'grid place-items-center w-14 h-14 rounded-xl bg-brand text-bi shrink-0' }, h(I, { n: s.ic, s: 30 })),
        h('span', { className: 'grow' }, h('b', { className: 'block text-xl' }, s.t[li]), h('span', { className: 'text-mute' }, s.d[li])),
        h(I, { n: 'right' }))),
      h('div', { className: 'flex gap-3 p-4 rounded-2xl bg-brand/10 mt-6' }, h(I, { n: 'lock', s: 28 }), h('div', null, h('p', { className: 'font-semibold' }, S.priv[li]), h('p', { className: 'text-mute' }, S.pdf[li]))),
      guideLink('mt-5 flex items-center gap-2 text-brand font-semibold underline underline-offset-4', 0))
  } else {
    const t = [0, S.q1, S.q2, S.q3, S.q4][st0][li]
    let c
    if (st0 === 1) {
      const q = norm(f.mun.trim()), list = q ? MUN.filter((m) => norm(m).includes(q)) : TOP
      c = h(Fld, { id: 'mun', label: S.mun[li], hint: S.munh[li], err: er.mun },
        T('mun', { hint: 1, p: { autoComplete: 'off', autoCapitalize: 'words', spellCheck: false } }),
        h('div', { className: 'flex flex-wrap gap-2 mt-3' }, list.map((m) => h('button', { key: m, type: 'button', 'aria-pressed': f.mun === m, onClick: () => up('mun', m), className: 'min-h-[2.75rem] px-4 rounded-full border-2 font-semibold ' + (f.mun === m ? 'border-brand bg-brand text-bi' : 'border-line bg-card') }, m))))
    }
    if (st0 === 2) c = h('div', null,
      h(Fld, { id: 'nome', label: S.nome[li], err: er.nome }, T('nome', { p: { autoComplete: 'name' } })),
      h(Fld, { id: 'doc', label: S.doc[li], hint: S.doch[li], err: er.doc }, T('doc', { hint: 1, fn: (x) => x.replace(/\D/g, '').slice(0, 11), p: { inputMode: 'numeric' } })),
      h(Fld, { id: 'morada', label: S.mor[li], err: er.morada }, T('morada', { p: { autoComplete: 'street-address' } })),
      h(Fld, { id: 'tel', label: S.tel[li], err: er.tel }, T('tel', { fn: (x) => x.replace(/[^\d+ ]/g, '').slice(0, 16), p: { type: 'tel', autoComplete: 'tel' } })))
    if (st0 === 3) c = h('div', null,
      h('fieldset', { className: 'mb-6' }, h('legend', { className: 'text-lg font-semibold mb-3' }, S.viv[li]),
        [['kids', S.kids], ['old', S.old], ['dis', S.dis]].map((a) => h(Opt, { key: a[0], id: a[0], on: f[a[0]], set: (e) => up(a[0], e.target.checked), txt: a[1][li] }))),
      f.sc === 'a' ? h('fieldset', { className: 'mb-6' }, h('legend', { className: 'text-lg font-semibold mb-3' }, S.why[li]), Object.keys(S.w).map((k) => h(Opt, { key: k, type: 'radio', name: 'why', on: f.why === k, set: () => up('why', k), txt: S.w[k][li] }))) : null,
      f.sc === 'b' ? h('fieldset', { className: 'mb-6' }, h('legend', { className: 'text-lg font-semibold mb-3' }, S.srv[li]), Object.keys(S.sv).map((k) => h(Opt, { key: k, type: 'radio', name: 'srv', on: f.srv === k, set: () => up('srv', k), txt: S.sv[k][li] }))) : null,
      f.sc === 'c' ? h('div', null,
        h(Fld, { id: 'rent', label: S.rent[li], err: er.rent }, T('rent', { fn: (x) => x.replace(/[^\d.,]/g, '').slice(0, 8), p: { inputMode: 'decimal' } })),
        h(Fld, { id: 'arr', label: S.arr[li] }, T('arr', { fn: (x) => x.replace(/\D/g, '').slice(0, 2), p: { inputMode: 'numeric' } }))) : null,
      h(Fld, { id: 'dt', label: S['dt' + f.sc][li] }, T('dt', { p: { type: 'date' } })),
      h(Fld, { id: 'extra', label: S.ext[li], hint: S.exth[li] }, T('extra', { area: 1, hint: 1, p: { rows: 3, maxLength: 400 } })))
    if (st0 === 4) {
      const vs = [f.kids && S.kids, f.old && S.old, f.dis && S.dis].filter(Boolean).map((x) => x[li]).join(' · ')
      const rows = [[sc.t[li], f.mun], [S.nome[li], f.nome], [S.mor[li], f.morada], [S.tel[li], f.tel]].concat(vs ? [[S.viv[li], vs]] : [])
      c = h('div', null,
        h('dl', { className: 'mb-6 divide-y divide-line/50' }, rows.map((r, i) => h('div', { key: i, className: 'py-3' }, h('dt', { className: 'text-mute' }, r[0]), h('dd', { className: 'text-lg font-semibold break-words' }, r[1])))),
        h(Opt, { id: 'ok', on: f.ok, set: (e) => up('ok', e.target.checked), txt: S.decl[li] }),
        er.ok ? h('p', { role: 'alert', className: 'mb-4 font-semibold text-acc' }, er.ok) : null,
        h('p', { className: 'mb-4 text-mute flex gap-2' }, h(I, { n: 'lock', s: 20 }), S.pdf[li]),
        guideLink('mb-5 flex items-center gap-2 text-brand font-semibold underline underline-offset-4', 4),
        msg ? h('p', { role: 'alert', className: 'mb-4 font-semibold text-acc' }, msg) : null)
    }
    body = h('div', { className: 'fi', key: st0 },
      h('div', { className: 'mb-6' },
        h('p', { className: 'font-semibold text-mute mb-2', 'aria-live': 'polite' }, S.pas[li] + ' ' + (st0 + 1) + '/5 · ' + S.st[li][st0]),
        h('div', { role: 'progressbar', 'aria-valuemin': 1, 'aria-valuemax': 5, 'aria-valuenow': st0 + 1, className: 'h-3 rounded-full bg-line/40 overflow-hidden' }, h('div', { className: 'h-full bg-brand transition-all', style: { width: (st0 + 1) * 20 + '%' } }))),
      H(t), c,
      h('div', { className: 'flex gap-3 mt-2' },
        h('button', { type: 'button', onClick: () => window.history.back(), className: btn + 'border-2 border-brand text-brand' }, h(I, { n: 'left' }), S.back[li]),
        st0 < 4
          ? h('button', { type: 'button', onClick: go, className: btn + 'grow bg-brand text-bi' }, S.next[li], h(I, { n: 'right' }))
          : h('button', { type: 'button', onClick: gen, disabled: busy, className: btn + 'grow bg-brand text-bi disabled:opacity-60' }, h(I, { n: 'dl' }), busy ? S.mking[li] : S.mk[li])))
  }

  const fbRow = CONFIG.feedback.on ? h('div', { className: 'mt-6 pt-4 border-t border-line/50 flex flex-wrap items-center justify-between gap-2' },
    h('button', { type: 'button', onClick: () => openFo('new'), className: 'min-h-[2.75rem] px-4 rounded-xl border-2 border-line flex items-center gap-2 font-semibold' }, h(I, { n: 'msg', s: 20 }), S.fbBtn[li]),
    fb.length ? h('button', { type: 'button', onClick: () => openFo('report'), className: 'min-h-[2.75rem] px-3 text-brand font-semibold underline underline-offset-4' }, S.fbR[li] + ' (' + fb.length + ')') : null) : null

  return h('div', { className: 'max-w-xl mx-auto px-4 min-h-screen flex flex-col' }, head,
    h('main', { className: 'grow pb-8' }, h('div', { className: 'bg-card rounded-3xl border-2 border-line p-5 sm:p-7' }, body, fbRow)),
    h('footer', { className: 'py-6 text-sm text-mute text-center' },
      h('p', { className: 'mb-2' }, S.disc[li]),
      h('p', { className: 'text-xs opacity-80' }, h('a', { href: 'https://www.linkedin.com/in/leandromorande/', target: '_blank', rel: 'noopener noreferrer', className: 'underline-offset-4 hover:underline' }, 'Developed by Leandro Morande'))),
    fo ? h(Sheet, { li, mode: fo, setMode: openFo, close: closeFo, ctx, extra: 'idioma app: ' + LK[li] + ' · letra ' + FS[fi], fb, setFb }) : null)
}
