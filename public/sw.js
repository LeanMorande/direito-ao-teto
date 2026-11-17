// Service worker mínimo. Página: red primero. /assets (con hash): caché primero. Resto: caché + refresco en segundo plano.
const C = 'dt-v2'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) =>
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
)
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url)
  if (r.method !== 'GET' || u.origin !== location.origin) return
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r)
        .then((x) => { if (x.ok) { const c = x.clone(); caches.open(C).then((k) => k.put('/', c)) } return x })
        .catch(() => caches.match('/'))
    )
    return
  }
  const net = () => fetch(r).then((x) => {
    // No se cachea HTML para rutas que no son página (p. ej. un /logo.png inexistente).
    if (x.ok && !/text\/html/.test(x.headers.get('content-type') || '')) { const c = x.clone(); caches.open(C).then((k) => k.put(r, c)) }
    return x
  })
  e.respondWith(caches.match(r).then((m) => {
    if (!m) return net()
    if (!u.pathname.startsWith('/assets/')) e.waitUntil(net().catch(() => {}))
    return m
  }))
})
