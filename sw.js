/* Miku i Shëndetit service worker: the installed app gets a friendly offline page instead of the browser's error.
   Nothing else is cached (medical data must always be fresh). Registered in production only (src/components/InstallApp.tsx). */
const CACHE = 'miku-offline-v1'
const OFFLINE = new URL('offline.html', self.registration.scope).pathname

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE)).then(() => self.skipWaiting()))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return
  e.respondWith(fetch(e.request).catch(() => caches.match(OFFLINE)))
})
