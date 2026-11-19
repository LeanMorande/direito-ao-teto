import { createElement as h, Fragment, useState, useEffect, useRef } from 'react'
import { S, SC, DS, MUN } from './i18n.js'
import { makePdf, loadPdf, nifOk, texto, latin } from './legal.js'
import { CONFIG } from './config.js'
import { I, Fld, Opt, LangMenu, House, Check, LANGS, LC, LK, inp, btn, buzz, shake } from './ui.js'
import { TextPanel } from './a11y.js'
import { useInstall, useOnline } from './pwa.js'
import { Sheet, loadFb } from './feedback.js'

const FS = ['80%', '90%', '100%', '112.5%', '125%', '137.5%', '150%'] // tamaños de letra (por defecto 100%)
const SNAP = [1, 1, 2, 4, 4, 6, 6] // el selector ofrece 4 tamaños (90/100/125/150): un valor guardado antiguo se ajusta al más cercano
const NAMES = ['Pedido', 'Municipio', 'Datos', 'Situación', 'Revisar'] // para el informe de sugerencias
const THN = ['auto', 'claro', 'oscuro']
const TOP = ['Lisboa', 'Porto', 'Amadora', 'Sintra', 'Loures', 'Odivelas', 'Oeiras', 'Cascais', 'Almada', 'Seixal', 'Vila Nova de Gaia', 'Matosinhos']
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const E0 = { sc: '', mun: '', nome: '', doc: '', morada: '', tel: '', kids: false, old: false, dis: false, why: 'despejo', srv: 'agua', rent: '', arr: '', dt: '', extra: '', ok: false }
const rd = (k, d) => { try { const v = localStorage.getItem(k); if (v !== null && v !== '' && !isNaN(+v)) return +v } catch (e) {} return d }
const wr = (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} }
const clamp = (n, a, b) => Math.min(Math.max(Math.round(n), a), b)
// Idioma inicial: el primero de los del navegador que la app conoce (pt, es, en, fr, bn, kea); si no, portugués
const guess = () => {
  const ls = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map((x) => String(x).toLowerCase())
  for (const x of ls) { const m = { pt: 0, es: 1, en: 3, fr: 4, bn: 5 }[x.slice(0, 2)]; if (m !== undefined) return m; if (x.indexOf('kea') === 0) return 2 }
  return 0
}

const V = (s, f, l) => {
  const e = {}, r = S.e.req[l], d = f.doc, lat = S.e.lat[l]
  if (s === 1) { if (f.mun.trim().length < 3) e.mun = r; else if (!latin(f.mun)) e.mun = lat }
  if (s === 2) {
    if (!/\S+\s+\S+/.test(f.nome.trim())) e.nome = r; else if (!latin(f.nome)) e.nome = lat
    if (f.morada.trim().length < 5) e.morada = r; else if (!latin(f.morada)) e.morada = lat
    if (!/^\+?\d{9,15}$/.test(f.tel.replace(/\s/g, ''))) e.tel = S.e.tel[l]
    if (d && !(d.length === 11 || (d.length === 9 && nifOk(d)))) e.doc = S.e.doc[l]
  }
  if (s === 3) {
    if (f.sc === 'c' && !/^\d{1,5}([.,]\d{1,2})?$/.test(f.rent.trim())) e.rent = r
    if (!latin(f.extra)) e.extra = lat
  }
  if (s === 4 && !f.ok) e.ok = S.e.ok[l]
  return e
}

// Vista previa del documento: mismo texto y numeración que el PDF (texto() de legal.js), en portugués
const Paper = ({ f }) => {
  const t = texto(f); let n = 1
  const sec = (ti, arr) => h(Fragment, { key: ti }, h('h4', { className: 'font-bold mt-4 mb-1' }, ti), arr.map((s, i) => h('p', { key: i, className: 'mb-2' }, (n++) + '.º  ' + s)))
  return h(Fragment, null,
    h('p', { className: 'text-right font-bold mb-4' }, 'Exmo. Senhor', h('br'), 'Presidente da Câmara Municipal de ' + t.mun),
    h('p', { className: 'font-bold mb-2' }, 'Assunto: ' + t.subject),
    h('p', { className: 'mb-2' }, f.nome.trim() + (f.doc ? ', ' + (f.doc.length === 11 ? 'NISS' : 'NIF') + ' ' + f.doc : '') + ', residente em ' + f.morada.trim() + ', contacto telefónico ' + f.tel.trim() + ', vem, ao abrigo do direito de petição (art. 52.º da CRP) e do dever de decisão da Administração (art. 13.º do CPA), expor e requerer a V. Ex.ª o seguinte:'),
    sec('I - DOS FACTOS', t.facts), sec('II - DO DIREITO', t.law),
    h('h4', { className: 'font-bold mt-4 mb-1' }, 'III - DO PEDIDO'),
    h('p', { className: 'mb-2' }, 'Face ao exposto, requer-se a V. Ex.ª que se digne determinar:'),
    t.asks.map((s, i) => h('p', { key: i, className: 'mb-2 pl-4' }, String.fromCharCode(97 + i) + ') ' + s)),
    h('h4', { className: 'font-bold mt-4 mb-1' }, 'IV - DO PRAZO E DA NOTIFICAÇÃO'),
    t.close.map((s, i) => h('p', { key: i, className: 'mb-2' }, s)),
    h('p', { className: 'mt-4 mb-2' }, 'Pede deferimento.'),
    h('p', { className: 'mb-8' }, t.mun + ', ' + new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }) + '.'),
    h('div', { className: 'mx-auto w-3/5 border-t border-black pt-2 text-center' }, 'O(A) Requerente', h('br'), f.nome.trim()))
}

export default function App() {
  const [li, setLi] = useState(() => { const s = rd('dt_l', -1); return LANGS.some((l) => l.i === s) ? s : guess() })
  const [fi, setFi] = useState(() => SNAP[clamp(rd('dt_fs', 2), 0, 6)])
  const [th, setTh] = useState(() => clamp(rd('dt_th', 0), 0, 2)) // 0 auto · 1 claro · 2 oscuro
  const [step, setStep] = useState(0), [v, setV] = useState('w'), [dir, setDir] = useState('n') // v: 'w' asistente · 'd' PDF listo · 'g' próximos pasos
  const [f, setF] = useState(E0), [er, setEr] = useState({})
  const [busy, setBusy] = useState(false), [msg, setMsg] = useState(''), [logo, setLogo] = useState(null), [pdf, setPdf] = useState(null), [more, setMore] = useState(false)
  const [fb, setFb] = useState(loadFb), [fo, setFo] = useState(null) // fo: null | 'new' | 'report'
  const hr = useRef(null), first = useRef(true), fr = useRef(f), sr = useRef(0)
  const online = useOnline(), install = useInstall()
  fr.current = f
  const st0 = f.sc ? step : 0
  sr.current = st0
  const big = fi > 2 // letra grande (125 % o más): menos relleno lateral para que el texto tenga sitio

  useEffect(() => { document.documentElement.lang = LC[li]; wr('dt_l', li) }, [li])
  useEffect(() => { document.documentElement.style.setProperty('--fs', FS[fi]); wr('dt_fs', fi) }, [fi])
  useEffect(() => {
    const el = document.documentElement
    if (th) el.setAttribute('data-theme', th === 1 ? 'light' : 'dark'); else el.removeAttribute('data-theme')
    const dark = th === 2 || (th === 0 && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', dark ? '#0B1D36' : '#12355B')
    wr('dt_th', th)
  }, [th])
  useEffect(() => {
    if (first.current) { first.current = false; return }
    // Al cambiar de pantalla: la tarjeta sube al inicio (la inicial muestra la cabecera) y el foco va al título
    const m = document.getElementById('main')
    window.scrollTo(0, st0 === 0 && v === 'w' ? 0 : Math.max(0, (m ? m.getBoundingClientRect().top : 0) + (window.scrollY || 0) - 12))
    hr.current && hr.current.focus({ preventScroll: true })
  }, [step, v])
  useEffect(() => {
    const t = setTimeout(() => loadPdf().catch(() => {}), 1500)
    window.history.replaceState({ s: 0, v: 'w' }, '')
    // El botón/gesto Atrás del móvil vuelve al paso anterior (o cierra la hoja de sugerencias).
    const pop = (e) => {
      let s = e.state || { s: 0, v: 'w' }
      if (!fr.current.sc) s = { ...s, s: 0, v: s.v === 'g' ? 'g' : 'w' }
      setDir(s.s < sr.current ? 'b' : 'f'); setStep(s.s); setV(s.v); setFo(s.fo || null)
    }
    window.addEventListener('popstate', pop)
    return () => { clearTimeout(t); window.removeEventListener('popstate', pop) }
  }, [])

  const nav = (s, vv) => { const x = { s, v: vv || 'w' }; setDir(s < st0 ? 'b' : 'f'); setStep(s); setV(x.v); window.history.pushState(x, ''); buzz(8) }
  const openFo = (m) => { window.history[fo ? 'replaceState' : 'pushState']({ s: step, v, fo: m }, ''); setFo(m) }
  const closeFo = () => window.history.back()
  const up = (k, val) => { setF((o) => ({ ...o, [k]: val })); setEr((o) => { const n = { ...o }; delete n[k]; return n }) }
  const okf = (s, id) => !!f[id] && !V(s, f, li)[id] // campo relleno y válido (marca verde)
  // Intro en un campo de una línea: pasa al siguiente campo; en el último, continúa
  const nextField = (e) => {
    if (e.key !== 'Enter' || (e.nativeEvent && e.nativeEvent.isComposing)) return
    e.preventDefault()
    const box = e.currentTarget.closest('[data-form]')
    const all = box ? Array.prototype.slice.call(box.querySelectorAll('input:not([type=checkbox]):not([type=radio]),textarea')) : []
    const nx = all[all.indexOf(e.currentTarget) + 1]
    nx ? nx.focus() : go()
  }
  const T = (id, o) => {
    o = o || {}
    return h(o.area ? 'textarea' : 'input', Object.assign({ id, value: f[id], onChange: (e) => up(id, o.fn ? o.fn(e.target.value) : e.target.value), onKeyDown: o.area ? undefined : nextField, className: inp + (er[id] ? 'border-acc' : 'border-line'), 'aria-invalid': er[id] ? 'true' : 'false', 'aria-describedby': (o.hint ? id + 'h ' : '') + (er[id] ? id + 'e' : '') }, o.p || {}))
  }
  const go = () => {
    const e = V(st0, f, li); setEr(e)
    const ks = Object.keys(e)
    if (ks.length) {
      buzz([30, 40, 30])
      setTimeout(() => {
        const els = ks.map((k) => document.getElementById(k)).filter(Boolean).sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1))
        els.forEach(shake); els[0] && els[0].focus()
      }, 0)
      return
    }
    nav(st0 + 1)
  }
  async function gen() {
    const e = V(4, f, li); setEr(e)
    if (Object.keys(e).length) { buzz([30, 40, 30]); return }
    setBusy(true); setMsg('')
    try {
      const { jsPDF } = await loadPdf()
      const doc = makePdf(f, jsPDF)
      const slug = f.mun.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const name = 'requerimento-' + f.sc + '-' + slug + '.pdf'
      let blob = null; try { blob = doc.output('blob') } catch (x) {}
      setPdf({ name, blob })
      doc.save(name)
      buzz([25, 40, 25, 40, 90])
      if (v !== 'd') nav(4, 'd')
    } catch (x) { setMsg(S.fail[li]) }
    setBusy(false)
  }
  // "Descarregar outra vez": reutiliza el PDF ya creado (instantáneo); si no se puede, lo crea de nuevo
  const again = () => {
    if (!pdf || !pdf.blob) return gen()
    try {
      const u = URL.createObjectURL(pdf.blob), a = document.createElement('a')
      a.href = u; a.download = pdf.name; document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(u), 5000)
    } catch (x) { gen() }
  }
  const mkFile = () => { try { return pdf && pdf.blob ? new File([pdf.blob], pdf.name, { type: 'application/pdf' }) : null } catch (x) { return null } }
  const canShare = (fl) => { try { return !!fl && typeof navigator.canShare === 'function' && navigator.canShare({ files: [fl] }) } catch (x) { return false } }
  const reset = () => { setF(E0); setEr({}); setMsg(''); setPdf(null); setMore(false); nav(0) }

  const sc = SC.find((s) => s.id === f.sc)
  const ctx = (v === 'd' ? 'Descarga lista' : v === 'g' ? 'Próximos pasos' : 'Paso ' + (st0 + 1) + '/5 ' + NAMES[st0]) + (f.sc ? ' · escenario ' + f.sc : '') + ' · idioma ' + LK[li]
  const H = (t, c) => h('h2', { ref: hr, tabIndex: -1, className: 'font-serif text-3xl font-bold outline-none ' + (c || 'mb-5') }, t)
  const spin = h('span', { 'aria-hidden': 'true', className: 'spin w-5 h-5 rounded-full border-[3px] border-bi/40 border-t-bi' })

  /* Cabecera: franja con idioma y tamaño de letra; el logo, centrado, a caballo entre la franja y el papel */
  const plate = logo === false
    ? h('div', { className: 'plate grid place-items-center w-24 h-24 rounded-2xl bg-white text-brand' }, h(I, { n: 'home', s: 48 }))
    : h('div', { className: 'plate grid place-items-center rounded-2xl bg-white p-3' + (logo ? '' : ' invisible') },
      h('img', { src: CONFIG.org.logo, alt: CONFIG.org.name, width: CONFIG.org.logoW, height: CONFIG.org.logoH, onLoad: () => setLogo(true), onError: () => setLogo(false), className: 'block h-[4.25rem] w-auto max-w-[min(14rem,70vw)] object-contain' }))
  const head = h('header', null,
    h('div', { className: 'band relative px-4 pb-16', style: { paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' } },
      h('div', { className: 'band-fx', 'aria-hidden': 'true' }),
      h('div', { className: 'relative z-30 max-w-xl mx-auto flex flex-wrap items-start justify-between gap-2' },
        h(LangMenu, { li, setLi, label: S.lang[li] }),
        h(TextPanel, { li, fi, setFi, th, setTh, cls: 'ml-auto' }))),
    h('div', { className: 'relative z-10 -mt-12 px-4 flex flex-col items-center text-center' }, plate,
      h('h1', { className: 'font-serif text-3xl font-bold mt-4 leading-tight' }, 'Direito ao Teto'),
      h('p', { className: 'text-mute mt-1' }, S.mov[li])))

  const guide = () => h('div', null,
    h('ol', { className: 'mb-2' }, DS.map((s, i) => h('li', { key: i, style: { '--i': i }, className: 'stg relative flex gap-4 pb-4' },
      i < DS.length - 1 ? h('span', { 'aria-hidden': 'true', className: 'absolute left-[28px] top-[56px] bottom-0 w-0.5 -ml-px bg-line/60' }) : null,
      h('span', { className: 'relative grid place-items-center w-[56px] h-[56px] rounded-2xl bg-brand text-bi shrink-0 shadow-sm' }, h(I, { n: s.ic, s: 28 })),
      h('div', { className: 'min-w-0 grow p-4 -mt-1 rounded-2xl border-2 border-line bg-card overflow-hidden' },
        h('p', { className: 'text-xl font-bold' }, (i + 1) + '. ' + s.t[li]),
        h('p', { className: 'text-mute' }, s.d[li]),
        i === 3 ? h('div', { 'aria-hidden': 'true', className: 'stamp inline-block max-w-full mt-3 -rotate-3 border-4 border-double border-acc text-acc px-4 py-2 text-center font-bold tracking-widest' }, h('div', { className: 'text-xl' }, S.rec[li]), h('div', { className: 'text-sm tracking-normal' }, '__/__/____ · __:__'), h('div', { className: 'text-sm tracking-normal' }, 'N.º ________')) : null)))),
    h('p', { className: 'my-5 text-lg font-semibold' }, S.aft[li]),
    h('p', { className: 'p-4 rounded-xl bg-brand/10 flex gap-3' }, h(I, { n: 'info', s: 22, c: 'mt-1 text-brand' }), S.help[li]))

  const guideLink = (cls, to) => h('button', { type: 'button', onClick: () => nav(to, 'g'), className: cls }, h(I, { n: 'badge', s: 20 }), S.gl[li])
  const backBtn = (cls) => h('button', { type: 'button', onClick: () => window.history.back(), className: btn + cls }, h(I, { n: 'left' }), S.back[li])

  let body
  if (v === 'd') {
    const fl = mkFile(), sh = canShare(fl)
    body = h('div', { className: 'fi', key: 'd' },
      h('div', { className: 'flex flex-col items-center text-center mb-6' },
        h(Check), h('div', { className: 'mt-4' }, H(S.dT[li], 'mb-2')),
        h('p', { className: 'text-xl' }, S.dS[li])),
      pdf ? h('div', { className: 'mb-5 p-4 rounded-2xl bg-brand/10 flex gap-3 items-start' }, h(I, { n: 'file', s: 28, c: 'text-brand' }),
        h('div', { className: 'min-w-0' }, h('p', { className: 'text-mute' }, S.dF[li]), h('p', { className: 'font-bold break-all' }, pdf.name))) : null,
      h('div', { className: 'flex flex-col gap-3 mb-8' },
        sh ? h('button', { type: 'button', onClick: () => { try { navigator.share({ files: [fl], title: 'Requerimento' }).catch(() => {}) } catch (x) {} }, className: btn + 'bg-brand text-bi' }, h(I, { n: 'share' }), S.share[li] + ' PDF') : null,
        h('button', { type: 'button', onClick: again, disabled: busy, className: btn + (sh ? 'border-2 border-brand text-brand' : 'bg-brand text-bi') + ' disabled:opacity-60' }, busy ? spin : h(I, { n: 'dl' }), S.again[li])),
      guide(),
      msg ? h('p', { role: 'alert', className: 'mt-4 font-semibold text-acc' }, msg) : null,
      h('button', { type: 'button', onClick: reset, className: btn + 'mt-6 w-full border-2 border-line' }, h(I, { n: 'trash' }), S.wipe[li]))
  } else if (v === 'g') {
    body = h('div', { className: 'fi', key: 'g' }, H(S.gT[li]), guide(), backBtn('mt-6 w-full border-2 border-brand text-brand'))
  } else if (st0 === 0) {
    body = h('div', { className: dir === 'b' ? 'sb' : 'fi', key: 'h' },
      h('p', { className: 'text-xl mb-6' }, S.tag[li]), H(S.q0[li]),
      SC.map((s, i) => h('button', { key: s.id, type: 'button', style: { '--i': i }, onClick: () => { up('sc', s.id); nav(1) }, className: 'stg group w-full text-left flex items-center mb-4 rounded-2xl border-2 border-line bg-card transition hover:border-brand hover:-translate-y-0.5 hover:shadow-md active:scale-[.985] ' + (big ? 'gap-3 p-3' : 'gap-4 p-4') },
        h('span', { className: 'grid place-items-center w-[56px] h-[56px] rounded-2xl text-bi shrink-0 shadow-sm', style: { background: 'rgb(var(--t' + s.id + '))' } }, h(I, { n: s.ic, s: 30 })),
        h('span', { className: 'grow min-w-0 [hyphens:auto] [overflow-wrap:anywhere]' }, h('b', { className: 'block text-xl' }, s.t[li]), h('span', { className: 'text-mute' }, s.d[li])),
        big ? null : h(I, { n: 'right', c: 'transition-transform group-hover:translate-x-1' }))),
      h('div', { className: 'flex gap-3 p-4 rounded-2xl bg-brand/10 mt-6' }, h(I, { n: 'lock', s: 28, c: 'text-brand' }), h('div', null, h('p', { className: 'font-semibold' }, S.priv[li]), h('p', { className: 'text-mute' }, S.pdf[li]))),
      install ? h('button', { type: 'button', onClick: install, className: 'mt-4 w-full text-left flex gap-3 items-center p-4 rounded-2xl border-2 border-dashed border-brand transition active:scale-[.985]' }, h(I, { n: 'app', s: 28, c: 'text-brand' }), h('span', null, h('b', { className: 'block' }, S.inst[li]), h('span', { className: 'text-mute' }, S.insth[li]))) : null,
      guideLink('mt-5 flex items-center gap-2 text-brand font-semibold underline underline-offset-4', 0))
  } else {
    const t = [0, S.q1, S.q2, S.q3, S.q4][st0][li]
    let c
    if (st0 === 1) {
      const q = norm(f.mun.trim()), list = q ? MUN.filter((m) => norm(m).includes(q)) : TOP
      c = h(Fld, { id: 'mun', label: S.mun[li], hint: S.munh[li], err: er.mun, ok: okf(1, 'mun') },
        T('mun', { hint: 1, p: { autoComplete: 'off', autoCapitalize: 'words', spellCheck: false, enterKeyHint: 'go' } }),
        h('div', { className: 'flex flex-wrap gap-2 mt-3' }, list.map((m) => h('button', { key: m, type: 'button', 'aria-pressed': f.mun === m, onClick: () => up('mun', m), className: 'min-h-[2.75rem] px-4 rounded-full border-2 font-semibold transition active:scale-95 ' + (f.mun === m ? 'border-brand bg-brand text-bi' : 'border-line bg-card') }, m))))
    }
    if (st0 === 2) c = h('div', null,
      h('p', { className: 'text-mute -mt-2 mb-5 flex gap-2' }, h(I, { n: 'info', s: 20, c: 'mt-1' }), S.latH[li]),
      h(Fld, { id: 'nome', label: S.nome[li], err: er.nome, ok: okf(2, 'nome') }, T('nome', { p: { autoComplete: 'name', enterKeyHint: 'next' } })),
      h(Fld, { id: 'doc', label: S.doc[li], hint: S.doch[li], err: er.doc, ok: okf(2, 'doc') }, T('doc', { hint: 1, fn: (x) => x.replace(/\D/g, '').slice(0, 11), p: { inputMode: 'numeric', enterKeyHint: 'next' } })),
      h(Fld, { id: 'morada', label: S.mor[li], err: er.morada, ok: okf(2, 'morada') }, T('morada', { p: { autoComplete: 'street-address', enterKeyHint: 'next' } })),
      h(Fld, { id: 'tel', label: S.tel[li], err: er.tel, ok: okf(2, 'tel') }, T('tel', { fn: (x) => x.replace(/[^\d+ ]/g, '').slice(0, 16), p: { type: 'tel', autoComplete: 'tel', enterKeyHint: 'go' } })))
    if (st0 === 3) c = h('div', null,
      h('fieldset', { className: 'mb-6' }, h('legend', { className: 'text-lg font-semibold mb-3' }, S.viv[li]),
        [['kids', S.kids], ['old', S.old], ['dis', S.dis]].map((a) => h(Opt, { key: a[0], id: a[0], on: f[a[0]], set: (e) => up(a[0], e.target.checked), txt: a[1][li] }))),
      f.sc === 'a' ? h('fieldset', { className: 'mb-6' }, h('legend', { className: 'text-lg font-semibold mb-3' }, S.why[li]), Object.keys(S.w).map((k) => h(Opt, { key: k, type: 'radio', name: 'why', on: f.why === k, set: () => up('why', k), txt: S.w[k][li] }))) : null,
      f.sc === 'b' ? h('fieldset', { className: 'mb-6' }, h('legend', { className: 'text-lg font-semibold mb-3' }, S.srv[li]), Object.keys(S.sv).map((k) => h(Opt, { key: k, type: 'radio', name: 'srv', on: f.srv === k, set: () => up('srv', k), txt: S.sv[k][li] }))) : null,
      f.sc === 'c' ? h('div', null,
        h(Fld, { id: 'rent', label: S.rent[li], err: er.rent, ok: okf(3, 'rent') }, T('rent', { fn: (x) => x.replace(/[^\d.,]/g, '').slice(0, 8), p: { inputMode: 'decimal', enterKeyHint: 'next' } })),
        h(Fld, { id: 'arr', label: S.arr[li] }, T('arr', { fn: (x) => x.replace(/\D/g, '').slice(0, 2), p: { inputMode: 'numeric', enterKeyHint: 'next' } }))) : null,
      h(Fld, { id: 'dt', label: S['dt' + f.sc][li] }, T('dt', { p: { type: 'date' } })),
      h(Fld, { id: 'extra', label: S.ext[li], hint: S.exth[li], err: er.extra }, T('extra', { area: 1, hint: 1, p: { rows: 3, maxLength: 400 } }),
        h('p', { 'aria-hidden': 'true', className: 'text-sm text-mute text-right mt-1' }, f.extra.length + '/400')))
    if (st0 === 4) {
      const vs = [f.kids && S.kids, f.old && S.old, f.dis && S.dis].filter(Boolean).map((x) => x[li]).join(' · ')
      const rows = [[sc.ic, S.q0[li], sc.t[li]], ['bank', S.mun[li], f.mun], ['user', S.nome[li], f.nome], ['pin', S.mor[li], f.morada], ['phone', S.tel[li], f.tel]]
        .concat(f.doc ? [['badge', 'NIF / NISS', f.doc]] : []).concat(vs ? [['users', S.viv[li], vs]] : [])
      c = h('div', null,
        h('ul', { className: 'mb-5 divide-y divide-line/50' }, rows.map((r, i) => h('li', { key: i, className: 'flex gap-3 items-start py-3' },
          h('span', { className: 'grid place-items-center w-10 h-10 rounded-xl bg-brand/10 text-brand shrink-0' }, h(I, { n: r[0], s: 22 })),
          h('div', { className: 'min-w-0' }, h('p', { className: 'text-mute text-sm' }, r[1]), h('p', { className: 'text-lg font-semibold break-words' }, r[2]))))),
        h('div', { className: 'mb-6' },
          h('button', { type: 'button', 'aria-expanded': more, onClick: () => setMore(!more), className: 'w-full min-h-[3.25rem] px-4 rounded-xl border-2 border-line flex items-center justify-between gap-2 font-semibold transition active:scale-[.99]' },
            h('span', { className: 'flex items-center gap-2' }, h(I, { n: 'file', s: 22 }), more ? S.pvx[li] : S.pv[li]), h(I, { n: 'chev', s: 20, c: 'transition-transform ' + (more ? 'rotate-180' : '') })),
          more ? h('div', { className: 'fi mt-3' }, h('p', { className: 'text-mute text-sm mb-3' }, S.pvh[li]), h('article', { lang: 'pt-PT', className: 'paper font-serif p-5 text-[0.9rem] leading-relaxed' }, h(Paper, { f }))) : null),
        h(Opt, { id: 'ok', on: f.ok, set: (e) => up('ok', e.target.checked), txt: S.decl[li] }),
        er.ok ? h('p', { role: 'alert', className: 'mb-4 font-semibold text-acc' }, er.ok) : null,
        h('p', { className: 'mb-4 text-mute flex gap-2' }, h(I, { n: 'lock', s: 20 }), S.pdf[li]),
        guideLink('mb-5 flex items-center gap-2 text-brand font-semibold underline underline-offset-4', 4),
        msg ? h('p', { role: 'alert', className: 'mb-4 font-semibold text-acc' }, msg) : null)
    }
    body = h('div', { className: dir === 'b' ? 'sb' : 'sf', key: 'w' + st0, 'data-form': 1 }, H(t), c,
      // Si con letra grande no caben en una línea, el botón principal pasa arriba y Voltar abajo (flex-wrap-reverse)
      h('div', { className: 'flex flex-wrap-reverse gap-3 mt-2' },
        backBtn('grow basis-[7rem] border-2 border-brand text-brand ' + (big ? '!px-3' : '')),
        st0 < 4
          ? h('button', { type: 'button', 'data-next': 1, onClick: go, className: btn + 'grow-[2] basis-[9rem] bg-brand text-bi ' + (big ? '!px-3' : '') }, S.next[li], h(I, { n: 'right' }))
          : h('button', { type: 'button', 'data-next': 1, onClick: gen, disabled: busy, className: btn + 'grow-[2] basis-[9rem] bg-brand text-bi disabled:opacity-60 ' + (big ? '!px-3' : '') }, busy ? spin : h(I, { n: 'dl' }), busy ? S.mking[li] : S.mk[li])))
  }

  // Progreso del asistente (pasos 2-5): la casa suma un tramo por paso; fuera del cuerpo animado para que se dibuje en directo
  const prog = v === 'w' && st0 > 0 ? h('div', { className: 'flex items-center gap-4 mb-6' },
    h(House, { n: st0, c: 'w-16 h-14 shrink-0 text-brand' }),
    h('div', { className: 'grow min-w-0' },
      h('p', { className: 'font-bold', 'aria-live': 'polite' }, S.pas[li] + ' ' + (st0 + 1) + '/5', h('span', { className: 'font-normal text-mute' }, ' · ' + S.st[li][st0])),
      h('div', { role: 'progressbar', 'aria-valuemin': 1, 'aria-valuemax': 5, 'aria-valuenow': st0 + 1, 'aria-label': S.pas[li], className: 'mt-2 flex gap-1.5' },
        [0, 1, 2, 3, 4].map((i) => h('span', { key: i, className: 'h-2.5 grow rounded-full transition-colors duration-300 ' + (i <= st0 ? 'bg-brand' : 'bg-line/40') }))))) : null

  const fbRow = CONFIG.feedback.on ? h('div', { className: 'mt-6 pt-4 border-t border-line/50 flex flex-wrap items-center justify-between gap-2' },
    h('button', { type: 'button', onClick: () => openFo('new'), className: 'min-h-[2.75rem] px-4 rounded-xl border-2 border-line flex items-center gap-2 font-semibold transition active:scale-[.97]' }, h(I, { n: 'msg', s: 20 }), S.fbBtn[li]),
    fb.length ? h('button', { type: 'button', onClick: () => openFo('report'), className: 'min-h-[2.75rem] px-3 text-brand font-semibold underline underline-offset-4' }, S.fbR[li] + ' (' + fb.length + ')') : null) : null

  const skip = h('a', { href: '#main', onClick: (e) => { e.preventDefault(); const m = document.getElementById('main'); m && m.focus() }, className: 'sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-3 focus:rounded-xl focus:bg-card focus:text-ink focus:border-2 focus:border-brand focus:font-bold' }, S.skip[li])
  const offline = online ? null : h('div', { role: 'status', className: 'bg-ink text-bg text-center text-sm font-semibold px-4 py-2 flex items-center justify-center gap-2' }, h(I, { n: 'off', s: 18 }), S.off[li])

  return h('div', { className: 'min-h-screen flex flex-col' }, skip, offline, head,
    h('div', { className: 'w-full max-w-xl mx-auto grow flex flex-col ' + (big ? 'px-2' : 'px-4') },
      h('main', { id: 'main', tabIndex: -1, className: 'grow pt-6 pb-8 outline-none' }, h('div', { className: 'bg-card rounded-3xl border-2 border-line shadow-card ' + (big ? 'p-3' : 'p-5 sm:p-7') }, prog, body, fbRow)),
      h('footer', { className: 'py-6 text-sm text-mute text-center' },
        h('p', { className: 'mb-2' }, S.disc[li]),
        h('p', { className: 'text-xs' }, h('a', { href: 'https://www.linkedin.com/in/leandromorande/', target: '_blank', rel: 'noopener noreferrer', className: 'opacity-80 underline-offset-4 hover:underline' }, 'Developed by Leandro Morande'), h('span', { className: 'opacity-60' }, ' · v' + CONFIG.version)))),
    fo ? h(Sheet, { li, mode: fo, setMode: openFo, close: closeFo, ctx, extra: 'idioma app: ' + LK[li] + ' · letra ' + FS[fi] + ' · tema ' + THN[th], fb, setFb }) : null)
}
