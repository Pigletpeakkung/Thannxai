// ===== THANNXAI SERVICE WORKER =====
// Advanced PWA functionality with caching strategies

const CACHE_NAME = 'thannxai-v1.2.0';
const STATIC_CACHE = 'thannxai-static-v1.2.0';
const DYNAMIC_CACHE = 'thannxai-dynamic-v1.2.0';
const IMAGE_CACHE = 'thannxai-images-v1.2.0';

// Files to cache immediately
const STATIC_ASSETS = [
    '/Thannxai/',
    '/Thannxai/index.html',
    '/Thannxai/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
];

// Dynamic content patterns
const DYNAMIC_PATTERNS = [
    /\/Thannxai\/admin\//,
    /\/api\//,
    /\.json$/
];

// Image patterns
const IMAGE_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
    /\/images\//,
    /\/assets\//
];

// ===== INSTALL EVENT =====
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', event => {
    console.log('✅ Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== IMAGE_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other protocols
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(handleFetch(request));
});

// ===== FETCH HANDLER =====
async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Static assets (Cache First)
        if (isStaticAsset(request)) {
            return await cacheFirst(request, STATIC_CACHE);
        }
        
        // Strategy 2: Images (Cache First with fallback)
        if (isImage(request)) {
            return await cacheFirstWithFallback(request, IMAGE_CACHE);
        }
        
        // Strategy 3: Dynamic content (Network First)
        if (isDynamicContent(request)) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }
        
        // Strategy 4: HTML pages (Stale While Revalidate)
        if (isHTMLPage(request)) {
            return await staleWhileRevalidate(request, STATIC_CACHE);
        }
        
        // Strategy 5: Default (Network First)
        return await networkFirst(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('🚨 Service Worker: Fetch error:', error);
        return await handleFetchError(request);
    }
}

// ===== CACHING STRATEGIES =====

// Cache First - Good for static assets
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Cache First with Fallback - Good for images
async function cacheFirstWithFallback(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return fallback image for failed image requests
        return new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="#1e293b"/>
                <text x="100" y="100" text-anchor="middle" fill="#64748b" font-size="16">Image Unavailable</text>
                <text x="100" y="120" text-anchor="middle" fill="#64748b" font-size="32">🖼️</text>
            </svg>`,
            {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    }
}

// Network First - Good for dynamic content
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Stale While Revalidate - Good for HTML pages
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Fetch in background to update cache
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Ignore network errors for background updates
    });
    
    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // If no cache, wait for network
    return await fetchPromise;
}

// ===== HELPER FUNCTIONS =====

function isStaticAsset(request) {
    const url = new URL(request.url);
    return STATIC_ASSETS.some(asset => url.pathname.includes(asset)) ||
           url.pathname.includes('/manifest.json') ||
           url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com';
}

function isImage(request) {
    const url = new URL(request.url);
    return IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isDynamicContent(request) {
    const url = new URL(request.url);
    return DYNAMIC_PATTERNS.some(pattern => pattern.test(url.pathname));
}

function isHTMLPage(request) {
    const url = new URL(request.url);
    return request.headers.get('Accept')?.includes('text/html') ||
           url.pathname.endsWith('.html') ||
           url.pathname.endsWith('/');
}

// ===== ERROR HANDLING =====
async function handleFetchError(request) {
    const url = new URL(request.url);
    
    // For HTML pages, return offline page
    if (isHTMLPage(request)) {
        return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ThannxAI - Offline</title>
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                        background: #0f172a;
                        color: #f8fafc;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        text-align: center;
                    }
                    .offline-container {
                        max-width: 400px;
                        padding: 2rem;
                    }
                    .offline-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    .offline-title {
                        font-size: 1.5rem;
                        margin-bottom: 1rem;
                        color: #3b82f6;
                    }
                    .offline-message {
                        color: #cbd5e1;
                        line-height: 1.6;
                        margin-bottom: 2rem;
                    }
                    .retry-button {
                        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                        color: white;
                        border: none;
                        padding: 0.75rem 1.5rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-weight: 600;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <div class="offline-icon">🧠</div>
                    <h1 class="offline-title">ThannxAI - Offline</h1>
                    <p class="offline-message">
                        You're currently offline. Some features may not be available, 
                        but you can still browse cached content.
                    </p>
                    <button class="retry-button" onclick="window.location.reload()">
                        Try Again
                    </button>
                </div>
            </body>
            </html>`,
            {
                headers: {
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    }
    
    // For other requests, return a generic error
    return new Response('Network error occurred', {
        status: 408,
        statusText: 'Request Timeout'
    });
}

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync triggered');
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Perform background tasks like:
        // - Sync offline form submissions
        // - Update cached content
        // - Send analytics data
        console.log('🔄 Service Worker: Performing background sync');
    } catch (error) {
        console.error('🚨 Service Worker: Background sync failed:', error);
    }
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', event => {
    console.log('📱 Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update from ThannxAI!',
        icon: '/Thannxai/icon-192.png',
        badge: '/Thannxai/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/Thannxai/icon-explore.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/Thannxai/icon-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('ThannxAI', options)
    );
});

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', event => {
    console.log('📱 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/Thannxai/#projects')
        );
    } else if (event.action === 'close') {
        // Just close the notification
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/Thannxai/')
        );
    }
});

// ===== MESSAGE HANDLING =====
self.addEventListener('message', event => {
    console.log('💬 Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(clearAllCaches());
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ Service Worker: All caches cleared');
}

// ===== PERIODIC BACKGROUND SYNC =====
self.addEventListener('periodicsync', event => {
    console.log('⏰ Service Worker: Periodic sync triggered');
    
    if (event.tag === 'content-sync') {
        event.waitUntil(updateContent());
    }
});

async function updateContent() {
    try {
        // Update cached content periodically
        const cache = await caches.open(STATIC_CACHE);
        const response = await fetch('/Thannxai/');
        
        if (response.ok) {
            await cache.put('/Thannxai/', response);
            console.log('🔄 Service Worker: Content updated');
        }
    } catch (error) {
        console.error('🚨 Service Worker: Content update failed:', error);
    }
}

// ===== CACHE MANAGEMENT =====
async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        const keysToDelete = keys.slice(0, keys.length - maxItems);
        await Promise.all(
            keysToDelete.map(key => cache.delete(key))
        );
        console.log(`🗑️ Service Worker: Cleaned ${keysToDelete.length} items from ${cacheName}`);
    }
}

// Limit cache sizes periodically
setInterval(() => {
    limitCacheSize(DYNAMIC_CACHE, 50);
    limitCacheSize(IMAGE_CACHE, 100);
}, 300000); // Every 5 minutes

console.log('🚀 Service Worker: ThannxAI SW loaded successfully');
