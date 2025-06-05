const CACHE_NAME = 'thannxai-v1';
const OFFLINE_HTML = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([
        '/', '/index.html', '/blog.html', '/gallery.html', '/job.html',
        '/styles.css', '/script.js', '/manifest.json', OFFLINE_HTML,
        '/icons/icon-192x192.png', '/icons/icon-512x512.png'
      ]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match(OFFLINE_HTML);
      }
    })
  );
});
