// Ajustes que puedes tocar sin leer el resto del código.
export const CONFIG = {
  version: '2.1',
  // Logo de la ONG: copia tu archivo a public/logo.png (si no existe se muestra el icono de casa).
  // logoW/logoH = tamaño en píxeles del PNG: reservan el hueco al cargar (si cambias el logo, actualízalos).
  org: { name: 'Vida Justa', logo: '/logo.png?v=2.1', logoW: 999, logoH: 446 }, // ?v=: sube el número si cambias el logo (el service worker guarda copia)
  feedback: {
    on: true,      // false = oculta los botones de Sugerencia cuando acabe la fase de pruebas
    whatsapp: '351931383494',  // '351912345678' (código de país, sin + ni espacios) = abre tu chat directo; vacío = elegir contacto
  },
}
