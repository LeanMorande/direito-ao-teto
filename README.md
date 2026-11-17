# Direito ao Teto

Gerador de requerimentos administrativos (PDF en portugués formal) para la Câmara Municipal, pensado para el movimiento Vida Justa. Todo se procesa en el navegador: sin servidor, sin base de datos y sin cookies.

## Uso local
```
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
```

## Despliegue (Cloudflare Pages)
Build command `npm run build` · Output directory `dist` · Production branch `main`.
Cada `git push` a `main` redespliega solo.

## Configuración rápida → `src/config.js`
- **Logo de la ONG**: copia el archivo a `public/logo.png` (si no existe se muestra el icono de casa).
- **Sugerencias de prueba**: `feedback.on` (true/false) y `feedback.whatsapp` (p. ej. `'351912345678'`; vacío = elige contacto).

## Estructura (`src/`)
- `config.js` ajustes · `i18n.js` textos `[pt, es, kr, en]` · `legal.js` texto jurídico + PDF
- `ui.js` iconos, banderas, selector de idioma · `feedback.js` sugerencias e informe · `App.jsx` asistente
- `index.css` colores AAA y modo oscuro · `public/` manifest, iconos, `sw.js`, `_headers`

## Prueba de humo (opcional)
```
npm i jsdom --no-save
node scripts/smoke.mjs
```

## Aviso
Herramienta de apoyo cívico; no sustituye el asesoramiento jurídico. Antes de difundirla, que un jurista revise las referencias legales y hablantes nativos el Kriolu y el inglés.
