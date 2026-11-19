// Prueba de humo (no forma parte del build). Uso: npm i jsdom --no-save && node scripts/smoke.mjs
import { JSDOM } from 'jsdom'
import fs from 'fs'
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/', pretendToBeVisual: true })
const w = dom.window
Object.assign(globalThis, { window: w, document: w.document, localStorage: w.localStorage, IS_REACT_ACT_ENVIRONMENT: true })
Object.defineProperty(globalThis, 'navigator', { value: w.navigator, configurable: true })
w.scrollTo = () => {}
w.localStorage.setItem('dt_l', '0') // PT por defecto (jsdom usa en-US)
fs.copyFileSync('src/App.jsx', 'src/__app.mjs')
const React = (await import('react')).default
const { createRoot } = await import('react-dom/client')
const App = (await import('../src/__app.mjs')).default
const act = React.act
const { S, SC, DS } = await import('../src/i18n.js')
const { LANGS, LC, LK } = await import('../src/ui.js')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const has = (t) => document.body.textContent.includes(t)
const btn = (t) => [...document.querySelectorAll('button')].find((b) => b.textContent.includes(t))
const click = (el) => act(async () => { el.dispatchEvent(new w.MouseEvent('click', { bubbles: true })) })
const type = (id, val) => act(async () => {
  const el = document.getElementById(id)
  Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set.call(el, val)
  el.dispatchEvent(new w.Event('input', { bubbles: true }))
})
const back = () => act(async () => { w.history.back(); await sleep(120) })
const fwd = () => act(async () => { w.history.forward(); await sleep(120) })
const pick = async (name) => { await click(document.querySelector('button[aria-haspopup="listbox"]')); await click([...document.querySelectorAll('[role=option]')].find((o) => o.textContent.includes(name))) }
let bad = 0
const ok = (c, m) => { if (!c) bad++; console.log(c ? 'OK  ' : 'FAIL', m) }

// --- Integridad de i18n: todo texto tiene 6 idiomas [pt, es, kr, en, fr, bn], ninguno vacío, y el bengalí está en escritura bengalí
const NL = 6, BN = /[\u0980-\u09FF]/
let tx = 0, miss = []
const check = (p, a) => {
  if (!Array.isArray(a) || a.length !== NL) return miss.push(p + ' (longitud ' + (a && a.length) + ')')
  a.forEach((x, i) => { tx++; if (Array.isArray(x)) return; if (typeof x !== 'string' || !x.trim()) miss.push(p + '[' + i + '] vacío'); else if ((i === 5) !== BN.test(x)) miss.push(p + '[' + i + '] escritura incorrecta: ' + x.slice(0, 30)) })
}
const walk = (p, v) => {
  if (Array.isArray(v) && v.every(Array.isArray)) { check(p, v); v.forEach((r, i) => { if (r.length !== v[0].length) miss.push(p + ' fila ' + i + ' distinta'); r.forEach((x, k) => { if ((i === 5) !== BN.test(x)) miss.push(p + '[' + i + '][' + k + '] escritura incorrecta') }) }) }
  else if (Array.isArray(v)) check(p, v)
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(p + '.' + k, x))
}
walk('S', S); SC.forEach((x) => { walk('SC.' + x.id + '.t', x.t); walk('SC.' + x.id + '.d', x.d) }); DS.forEach((x, i) => { walk('DS' + i + '.t', x.t); walk('DS' + i + '.d', x.d) })
ok(miss.length === 0, 'i18n: ' + Object.keys(S).length + ' claves en ' + NL + ' idiomas, sin huecos' + (miss.length ? ' → ' + miss.slice(0, 5).join(' | ') : ''))
ok(LANGS.length === NL && LANGS.every((l) => LC[l.i] === l.l && LK[l.i] === l.c) && new Set(LANGS.map((l) => l.i)).size === NL, 'LANGS: 6 idiomas con índice único')
const fsv = () => document.documentElement.style.getPropertyValue('--fs')
const radio = (t) => [...document.querySelectorAll('[role=radio]')].find((b) => b.textContent.includes(t) && (t !== 'Grande' || !b.textContent.includes('Muito')))

// --- Idioma automático: el primero de navigator.languages que la app conoce
for (const [langs, txt, code] of [[['xx', 'bn-BD', 'en'], 'আপনার কী প্রয়োজন?', 'bn'], [['de', 'fr-FR'], 'De quoi avez-vous besoin ?', 'fr'], [['es-ES'], '¿Qué necesita?', 'es'], [['kea'], 'Ki ki bu pursiza?', 'kea'], [['ja'], 'O que precisa?', 'pt-PT']]) {
  w.localStorage.removeItem('dt_l'); Object.defineProperty(w.navigator, 'languages', { value: langs, configurable: true })
  const r = createRoot(document.getElementById('root')); await act(async () => r.render(React.createElement(App)))
  ok(has(txt) && document.documentElement.lang === code, 'idioma automático ' + langs.join(',') + ' → ' + code); r.unmount()
}
// --- Tamaño de letra guardado de la v2.0 (índice 3 = 112,5 %) se ajusta al tamaño más cercano que ofrece el selector (125 %)
w.localStorage.setItem('dt_l', '0'); w.localStorage.setItem('dt_fs', '3')
{ const r = createRoot(document.getElementById('root')); await act(async () => r.render(React.createElement(App))); ok(fsv() === '125%', 'letra guardada antigua 112,5 % → 125 %'); r.unmount() }
w.localStorage.setItem('dt_fs', '2')
for (const [i, name] of [[0, 'Casa'], [1, 'Água ou luz'], [2, 'renda']]) {
  const root = createRoot(document.getElementById('root'))
  await act(async () => root.render(React.createElement(App)))
  ok(has('O que precisa?'), `[${i}] inicio`)
  if (i === 0) {
    for (const [n, txt, code] of [['English', 'What do you need?', 'en'], ['Español', '¿Qué necesita?', 'es'], ['Kriolu', 'Ki ki bu pursiza?', 'kea'], ['Français', 'De quoi avez-vous besoin ?', 'fr'], ['বাংলা', 'আপনার কী প্রয়োজন?', 'bn'], ['Português', 'O que precisa?', 'pt-PT']]) { await pick(n); ok(has(txt) && document.documentElement.lang === code, 'idioma ' + n + ' (lang=' + code + ')') }
    // Panel "Aa": tamaño de letra (4 botones) y aspecto (auto / claro / oscuro), guardados en localStorage
    await click(document.querySelector('button[aria-haspopup="dialog"]')); ok(has('Tamanho da letra') && has('Aspeto'), 'panel Aa se abre')
    await click(radio('Grande')); ok(fsv() === '125%' && w.localStorage.getItem('dt_fs') === '4' && radio('Grande').getAttribute('aria-checked') === 'true', 'tamaño Grande = 125 %')
    await click(radio('Muito grande')); ok(fsv() === '150%', 'tamaño Muito grande = 150 %')
    await click(radio('Pequeno')); ok(fsv() === '90%', 'tamaño Pequeno = 90 %')
    await click(radio('Normal')); ok(fsv() === '100%' && w.localStorage.getItem('dt_fs') === '2', 'tamaño Normal = 100 %')
    await click(radio('Escuro')); ok(document.documentElement.getAttribute('data-theme') === 'dark' && w.localStorage.getItem('dt_th') === '2', 'tema oscuro manual')
    await click(radio('Claro')); ok(document.documentElement.getAttribute('data-theme') === 'light', 'tema claro manual')
    await click(radio('Auto')); ok(!document.documentElement.hasAttribute('data-theme') && w.localStorage.getItem('dt_th') === '0', 'tema automático')
    await click(document.querySelector('button[aria-haspopup="dialog"]'))
    await click(btn('Ver o que fazer')); ok(has('Próximos passos'), 'guía desde el inicio'); await back(); ok(has('O que precisa?'), 'atrás desde la guía')
  }
  await click(btn(name)); ok(has('Qual é a sua Câmara'), `[${i}] paso 1`)
  await click(btn('Continuar')); ok(has('Preencha este campo.'), `[${i}] municipio obligatorio`)
  await click([...document.querySelectorAll('button[aria-pressed]')].find((b) => b.textContent === 'Lisboa'))
  ok(document.getElementById('mun').value === 'Lisboa', `[${i}] chip de municipio`)
  await click(btn('Continuar')); ok(has('Os seus dados'), `[${i}] paso 2`)
  if (i === 0) { await back(); ok(has('Qual é a sua Câmara'), 'historial: atrás'); await fwd(); ok(has('Os seus dados'), 'historial: adelante') }
  if (i === 0) { await type('nome', 'মোহাম্মদ রহমান'); await type('morada', 'Rua Exemplo 12'); await type('tel', '912345678'); await click(btn('Continuar')); ok(has('letras latinas'), 'nombre en otro alfabeto → aviso (el PDF solo dibuja letras latinas)') }
  await type('nome', 'Maria Silva'); await type('morada', 'Rua Exemplo 12'); await type('tel', '12')
  await click(btn('Continuar')); ok(has('Número inválido.'), `[${i}] error teléfono`)
  await type('tel', '912345678'); await type('doc', '123456780')
  await click(btn('Continuar')); ok(has('Confira ou deixe'), `[${i}] NIF inválido`)
  await type('doc', '123456789'); await click(btn('Continuar')); ok(has('A sua situação'), `[${i}] paso 3`)
  if (i === 2) { await click(btn('Continuar')); ok(has('Preencha este campo.'), 'renda obligatoria'); await type('rent', '450') }
  await click(document.getElementById('kids')); await click(btn('Continuar'))
  ok(has('Rever e criar o documento') && has('Maria Silva'), `[${i}] paso 4 + resumen`)
  if (i === 0) {
    await click(btn('Ver o texto do documento')); ok(has('Exmo. Senhor') && has('I - DOS FACTOS') && has('Maria Silva') && has('Pede deferimento.'), 'vista previa del documento')
    await click(btn('Ocultar o texto')); ok(!has('I - DOS FACTOS'), 'ocultar vista previa')
    await click(btn('Sugestão')); await type('fbx', 'Letra muito pequena no passo 2'); await click(btn('Guardar')); ok(has('Sugestão guardada'), 'sugerencia guardada')
    await click(btn('Relatório')); const rp = document.getElementById('rp').value
    ok(rp.includes('INFORME DE PRUEBAS') && rp.includes('Letra muito pequena') && rp.includes('Paso 5/5 Revisar') && !rp.includes('Maria Silva') && !rp.includes('123456789'), 'informe sin datos personales')
    await click(document.querySelector('[aria-label="Fechar"]')); await sleep(120); ok(!has('Relatório de testes'), 'cerrar informe')
  }
  await click(btn('Criar PDF')); ok(has('Marque a caixa'), `[${i}] declaración obligatoria`)
  await click(document.getElementById('ok'))
  await click(btn('Criar PDF')); await act(async () => { await sleep(1000) })
  ok(has('O seu requerimento está pronto'), `[${i}] pantalla final` + (has('Não foi possível') ? ' (fallo)' : ''))
  if (i === 0) {
    ok(has('requerimento-a-lisboa.pdf'), 'pantalla final muestra el nombre del archivo')
    await click(btn('Descarregar outra vez')); await act(async () => { await sleep(600) }); ok(has('O seu requerimento está pronto'), 'descargar otra vez')
    await back(); ok(has('Rever e criar o documento'), 'atrás desde la pantalla final')
  }
  root.unmount()
}
fs.unlinkSync('src/__app.mjs')
for (const f of fs.readdirSync('.')) if (/^requerimento-.*\.pdf$/.test(f)) fs.unlinkSync(f)
console.log(bad ? 'FALLOS: ' + bad : 'TODO OK')
process.exit(bad ? 1 : 0)
