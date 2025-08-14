const CACHE_NAME = 'aventura-marina-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './registro.html',
  './iniciosesion.html',
  './manifest.json',
  './js/app.js',
  './js/serviceWorker.js',
  './images/Captura de pantalla 2025-06-26 211713.png',
  './images/ChatGPT Image 19 jun 2025, 08_57_38 p.m..png',
  'https://cdn.tailwindcss.com'
];

// Instalación: cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => console.error('Error al cachear:', err))
  );
});

// Activación: limpiar cachés viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Interceptar fetch
self.addEventListener('fetch', event => {
  // No cachear peticiones a Firebase
  if (event.request.url.includes('firebaseio.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // Fallback para navegación offline
        if (event.request.mode === 'navigate') {
          return caches.match('./iniciosesion.html');
        }
        return new Response('Recurso no disponible offline', { status: 503 });
      })
  );
});