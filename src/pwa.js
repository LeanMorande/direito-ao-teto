import { useState, useEffect } from 'react'

// ¿Hay conexión? (la app funciona igual sin ella: solo se avisa)
export function useOnline() {
  const [on, setOn] = useState(() => navigator.onLine !== false)
  useEffect(() => {
    const a = () => setOn(true), b = () => setOn(false)
    window.addEventListener('online', a); window.addEventListener('offline', b)
    return () => { window.removeEventListener('online', a); window.removeEventListener('offline', b) }
  }, [])
  return on
}

// Devuelve una función "instalar" solo si el navegador ofrece instalar la PWA y aún no está instalada; si no, null.
export function useInstall() {
  const [ev, setEv] = useState(null)
  useEffect(() => {
    const on = (e) => { e.preventDefault(); setEv(e) }, done = () => setEv(null)
    window.addEventListener('beforeinstallprompt', on); window.addEventListener('appinstalled', done)
    return () => { window.removeEventListener('beforeinstallprompt', on); window.removeEventListener('appinstalled', done) }
  }, [])
  const app = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone
  return ev && !app ? () => { try { ev.prompt(); if (ev.userChoice) ev.userChoice.then(() => setEv(null), () => setEv(null)) } catch (e) { setEv(null) } } : null
}
