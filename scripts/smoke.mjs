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
for (const [i, name] of [[0, 'Casa'], [1, 'Água ou luz'], [2, 'renda']]) {
  const root = createRoot(document.getElementById('root'))
  await act(async () => root.render(React.createElement(App)))
  ok(has('O que precisa?'), `[${i}] inicio`)
  if (i === 0) {
    for (const [n, txt] of [['English', 'What do you need?'], ['Español', '¿Qué necesita?'], ['Kriolu', 'Ki ki bu pursiza?'], ['Português', 'O que precisa?']]) { await pick(n); ok(has(txt), 'idioma ' + n) }
    await click(btn('Ver o que fazer')); ok(has('Próximos passos'), 'guía desde el inicio'); await back(); ok(has('O que precisa?'), 'atrás desde la guía')
  }
  await click(btn(name)); ok(has('Qual é a sua Câmara'), `[${i}] paso 1`)
  await click(btn('Continuar')); ok(has('Preencha este campo.'), `[${i}] municipio obligatorio`)
  await click([...document.querySelectorAll('button[aria-pressed]')].find((b) => b.textContent === 'Lisboa'))
  ok(document.getElementById('mun').value === 'Lisboa', `[${i}] chip de municipio`)
  await click(btn('Continuar')); ok(has('Os seus dados'), `[${i}] paso 2`)
  if (i === 0) { await back(); ok(has('Qual é a sua Câmara'), 'historial: atrás'); await fwd(); ok(has('Os seus dados'), 'historial: adelante') }
  await type('nome', 'Maria Silva'); await type('morada', 'Rua Exemplo 12'); await type('tel', '12')
  await click(btn('Continuar')); ok(has('Número inválido.'), `[${i}] error teléfono`)
  await type('tel', '912345678'); await type('doc', '123456780')
  await click(btn('Continuar')); ok(has('Confira ou deixe'), `[${i}] NIF inválido`)
  await type('doc', '123456789'); await click(btn('Continuar')); ok(has('A sua situação'), `[${i}] paso 3`)
  if (i === 2) { await click(btn('Continuar')); ok(has('Preencha este campo.'), 'renda obligatoria'); await type('rent', '450') }
  await click(document.getElementById('kids')); await click(btn('Continuar'))
  ok(has('Rever e criar o documento') && has('Maria Silva'), `[${i}] paso 4 + resumen`)
  if (i === 0) {
    await click(btn('Sugestão')); await type('fbx', 'Letra muito pequena no passo 2'); await click(btn('Guardar')); ok(has('Sugestão guardada'), 'sugerencia guardada')
    await click(btn('Relatório')); const rp = document.getElementById('rp').value
    ok(rp.includes('INFORME DE PRUEBAS') && rp.includes('Letra muito pequena') && rp.includes('Paso 5/5 Revisar') && !rp.includes('Maria Silva') && !rp.includes('123456789'), 'informe sin datos personales')
    await click(document.querySelector('[aria-label="Fechar"]')); await sleep(120); ok(!has('Relatório de testes'), 'cerrar informe')
  }
  await click(btn('Criar PDF')); ok(has('Marque a caixa'), `[${i}] declaración obligatoria`)
  await click(document.getElementById('ok'))
  await click(btn('Criar PDF')); await act(async () => { await sleep(1000) })
  ok(has('O seu requerimento está pronto'), `[${i}] pantalla final` + (has('Não foi possível') ? ' (fallo)' : ''))
  if (i === 0) { await back(); ok(has('Rever e criar o documento'), 'atrás desde la pantalla final') }
  root.unmount()
}
fs.unlinkSync('src/__app.mjs')
for (const f of fs.readdirSync('.')) if (/^requerimento-.*\.pdf$/.test(f)) fs.unlinkSync(f)
console.log(bad ? 'FALLOS: ' + bad : 'TODO OK')
process.exit(bad ? 1 : 0)
