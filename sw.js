const CACHE_NAME = 'cultural-ai-portfolio-v1.0.0';
const STATIC_CACHE_NAME = 'cultural-ai-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'cultural-ai-dynamic-v1.0.0';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/404.html',
    '/privacy.html',
    '/terms.html',
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/site.webmanifest',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&display=swap',
    'https://cdn.rawgit.com/michalsnik/aos/2.3.1/dist/aos.css',
    'https://cdn.rawgit.com/michalsnik/aos/2.3.1/dist/aos.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

const EXCLUDED_URLS = [
    '/admin',
    '/wp-admin',
    'chrome-extension://',
    'moz-extension://',
    'analytics',
    'gtag',
    'googletagmanager'
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const requestURL = new URL(event.request.url);
    
    // Skip excluded URLs
    if (EXCLUDED_URLS.some(url => event.request.url.includes(url))) {
        return;
    }
    
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }
                
                // Fetch from network
                return fetch(event.request)
                    .then((fetchResponse) => {
                        // Check if valid response
                        if (!fetchResponse || 
                            fetchResponse.status !== 200 || 
                            fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }
                        
                        // Clone response for caching
                        const responseToCache = fetchResponse.clone();
                        
                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return fetchResponse;
                    })
                    .catch(() => {
                        // Return offline page for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/404.html');
                        }
                    });
            })
    );
});

// Background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon-192x192.png',
            badge: '/favicon-96x96.png',
            data: data.url
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.notification.data) {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

// Helper functions
function doBackgroundSync() {
    return new Promise((resolve) => {
        // Implement background sync logic here
        console.log('Performing background sync...');
        resolve();
    });
}

// Cache cleaning utility
function cleanOldCaches() {
    const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
    
    return caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        );
    });
}

// Periodically clean old caches
setInterval(() => {
    cleanOldCaches();
}, 86400000); // 24 hours
