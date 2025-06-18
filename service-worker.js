const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/Thannxai/',
  '/Thannxai/index.html',
  '/Thannxai/assets/css/style.css',
  '/Thannxai/assets/js/script.js',
  '/Thannxai/manifest.json',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://cdn.jsdelivr.net/npm/@emailjs/browser@3.10.0/dist/email.min.js',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.10.5/dist/cdn.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.3/gsap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/CustomEase.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrambleTextPlugin.min.js',
  'https://unpkg.com/split-text-js@1.0.2/dist/splittext.min.js'
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
