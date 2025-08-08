const CACHE_NAME = 'aventura-marina-tailwind-v3'; // Cambia el nombre al actualizar
const BASE_URL = '/GBAR-2.github.io';
const URLS_TO_CACHE = [
  `${BASE_URL}/`,
  `${BASE_URL}/index.html`,
  `${BASE_URL}/registro.html`,
  `${BASE_URL}/iniciosesion.html`,
  `${BASE_URL}/manifest.json`,
  `${BASE_URL}/js/app.js`,
  `${BASE_URL}/images/Captura de pantalla 2025-06-26 211713.png`,
  `${BASE_URL}/images/ChatGPT Image 19 jun 2025, 08_57_38 p.m..png`,
  'https://cdn.tailwindcss.com' // Cachear Tailwind
];

// Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .catch(err => console.error('Error al cachear:', err))
  );
});

// Limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch
self.addEventListener('fetch', (event) => {
  // Excluye CDNs externos que no quieras cachear
  if (event.request.url.includes('firebaseio.com')) {
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => {
        // Fallback solo para páginas HTML
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE_URL}/iniciosesion.html`);
        }
        return new Response('Recurso no disponible offline', { status: 503 });
      })
  );
});
