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

## Dónde editar (todo en `src/App.jsx`)
- Textos de la interfaz PT/ES/Kriolu: objetos `S`, `SC` y `DS`.
- Texto jurídico del PDF (siempre portugués de Portugal): función `texto()`.
- Municipios del selector: constante `MUN`.
- Colores y modo oscuro: variables CSS en `src/index.css`.

## Aviso
Herramienta de apoyo cívico; no sustituye el asesoramiento jurídico. Antes de difundirla, que un jurista revise las referencias legales y un hablante nativo el Kriolu.
