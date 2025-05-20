# Code Citations

This project includes code or design inspiration from the following sources:

---

## License: unknown  
https://github.com/AkshitPareek/Sherlocked/tree/e92f9beb5473d09cd754e0783075b82d82f53044/levels/level6.php

## License: unknown  
https://github.com/Christinabraham/studentapp/tree/bd00498e3bf47496cc98610a272330995bba4642/resources/views/welcome.blade.php

## License: unknown  
https://github.com/litposthinker/Tugas-aydin/tree/d488355075682b7260e2bc77502204a9221c1596/portofolio-gue/detail.php

## License: MIT  
https://github.com/Agilbay04/VLMS-JTI/tree/ac9dee3ecf421da62ff9cf5b76dee9de633b83de/bootstrap-4.6.0/site/content/docs/4.6/components/navbar.md

## License: unknown  
https://github.com/gagas3113/uts_1402019041/tree/95f760ab6348f7119af08858f43580ca1bf172f1/uts_1402019041/index.php

---

## Service Worker Implementation

A service worker is implemented in `scripts/sw.js` to cache key assets for offline support and faster load times.  
Example:

```javascript
// filepath: [sw.js](http://_vscodecontentref_/0)
const CACHE_NAME = 'thannxai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
  'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1920&format=webp'
];
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
```

