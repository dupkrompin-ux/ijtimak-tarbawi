// SERVICE WORKER v3 — Ijtimak Tarbawi Dewan Ulamak
// Tukar versi ini setiap kali nak paksa browser ambil kod terbaru

const CACHE_NAME = 'ijtimak-tarbawi-v3';
const ASSETS = ['./', './index.html', './manifest.json'];

// Install — cache fail asas
self.addEventListener('install', event => {
  self.skipWaiting(); // Paksa SW baharu aktif serta-merta
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate — BUANG semua cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Buang cache lama:', key);
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim()) // Ambil alih semua tab serta-merta
  );
});

// Fetch — Network first, JANGAN cache Apps Script
self.addEventListener('fetch', event => {
  // Jangan cache Apps Script sama sekali
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
