// Service worker mínimo: red primero para la página; caché para el resto (los archivos de /assets llevan hash).
const C = 'dt-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) =>
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
)
self.addEventListener('fetch', (e) => {
  const r = e.request
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r)
        .then((x) => { if (x.ok) { const c = x.clone(); caches.open(C).then((k) => k.put('/', c)) } return x })
        .catch(() => caches.match('/'))
    )
    return
  }
  e.respondWith(
    caches.match(r).then((m) => m || fetch(r).then((x) => {
      if (x.ok) { const c = x.clone(); caches.open(C).then((k) => k.put(r, c)) }
      return x
    }))
  )
})
