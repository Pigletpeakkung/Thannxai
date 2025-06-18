const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/Thannxai/',
  '/Thannxai/index.html',
  '/Thannxai/assets/css/custom.css',
  '/Thannxai/assets/js/main.js',
  '/Thannxai/assets/images/web03.webp',
  '/Thannxai/assets/images/wave-bg-001.webp',
  '/Thannxai/assets/images/wave-bg-002.webp',
  '/Thannxai/assets/images/wave-bg-003.webp',
  '/Thannxai/assets/images/wave-bg-004.webp',
  '/Thannxai/assets/images/logo192.png',
  '/Thannxai/assets/images/logo512.png',
  '/Thannxai/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || !networkResponse.ok || !event.request.url.startsWith('http')) {
            return networkResponse;
          }
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }).catch(() => {
        return caches.match('/Thannxai/index.html');
      })
  );
});
