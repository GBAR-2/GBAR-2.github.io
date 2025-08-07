const CACHE_NAME = 'gbar-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/js/app.js',
  '/manifest.json',
  'images/ChatGPT Image 19 jun 2025, 08_57_38 p.m..png',
  'images/Captura de pantalla 2025-06-26 211713.png',
];


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== odsquiz) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
});
