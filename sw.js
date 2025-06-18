const CACHE_NAME = 'thanatsitt-portfolio-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/logo192.png',
  '/assets/images/logo512.png',
  '/assets/images/web03.webp',
  '/assets/images/wave-bg-001.webp',
  '/assets/images/wave-bg-002.webp',
  '/assets/images/wave-bg-003.webp',
  '/assets/images/wave-bg-004.webp',
  '/assets/css/custom.css',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.10.5/dist/cdn.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.3/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrambleTextPlugin.min.js',
  'https://unpkg.com/split-text-js@1.0.2/dist/splittext.min.js',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3.10.0/dist/email.min.js'
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
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match('/index.html');
      })
  );
});
