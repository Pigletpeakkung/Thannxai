// ===== THANNXAI ADVANCED SERVICE WORKER =====
// Ultra-high performance PWA with intelligent caching

const SW_VERSION = '2.0.0';
const CACHE_PREFIX = 'thannxai';
const CACHES = {
    STATIC: `${CACHE_PREFIX}-static-v${SW_VERSION}`,
    DYNAMIC: `${CACHE_PREFIX}-dynamic-v${SW_VERSION}`,
    IMAGES: `${CACHE_PREFIX}-images-v${SW_VERSION}`,
    FONTS: `${CACHE_PREFIX}-fonts-v${SW_VERSION}`,
    API: `${CACHE_PREFIX}-api-v${SW_VERSION}`
};

// ===== CRITICAL ASSETS (Cache immediately) =====
const CRITICAL_ASSETS = [
    '/Thannxai/',
    '/Thannxai/index.html',
    '/Thannxai/manifest.json',
    // Google Fonts
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
];

// ===== CACHE STRATEGIES =====
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only'
};

// ===== ROUTE PATTERNS =====
const ROUTES = [
    {
        pattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/,
        strategy: CACHE_STRATEGIES.CACHE_FIRST,
        cache: CACHES.IMAGES,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxEntries: 100
    },
    {
        pattern: /\.(?:woff|woff2|ttf|eot)$/,
        strategy: CACHE_STRATEGIES.CACHE_FIRST,
        cache: CACHES.FONTS,
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        maxEntries: 30
    },
    {
        pattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
        strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
        cache: CACHES.FONTS,
        maxAge: 365 * 24 * 60 * 60 * 1000
    },
    {
        pattern: /\/api\//,
        strategy: CACHE_STRATEGIES.NETWORK_FIRST,
        cache: CACHES.API,
        maxAge: 5 * 60 * 1000, // 5 minutes
        maxEntries: 50
    },
    {
        pattern: /\.(?:js|css|html)$/,
        strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
        cache: CACHES.STATIC,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
];

// ===== PERFORMANCE METRICS =====
let performanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    networkRequests: 0,
    offlineRequests: 0,
    averageResponseTime: 0
};

// ===== INSTALL EVENT =====
self.addEventListener('install', event => {
    console.log(`🔧 SW v${SW_VERSION}: Installing...`);
    
    event.waitUntil(
        Promise.all([
            // Pre-cache critical assets
            caches.open(CACHES.STATIC).then(cache => {
                console.log('📦 SW: Pre-caching critical assets');
                return cache.addAll(CRITICAL_ASSETS);
            }),
            
            // Initialize performance tracking
            initializePerformanceTracking(),
            
            // Skip waiting for immediate activation
            self.skipWaiting()
        ])
    );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', event => {
    console.log(`✅ SW v${SW_VERSION}: Activating...`);
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            cleanupOldCaches(),
            
            // Take control of all clients
            self.clients.claim(),
            
            // Initialize background tasks
            initializeBackgroundTasks(),
            
            // Send update notification to clients
            notifyClientsOfUpdate()
        ])
    );
});

// ===== FETCH EVENT (The Heart of SW) =====
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Skip non-GET requests and chrome-extension URLs
    if (request.method !== 'GET' || !request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(handleRequest(request));
});

// ===== INTELLIGENT REQUEST HANDLER =====
async function handleRequest(request) {
    const startTime = performance.now();
    const url = new URL(request.url);
    
    try {
        // Find matching route strategy
        const route = findMatchingRoute(request);
        
        if (route) {
            const response = await executeStrategy(request, route);
            trackPerformance(startTime, true);
            return response;
        }
        
        // Default strategy for unmatched routes
        const response = await staleWhileRevalidate(request, CACHES.DYNAMIC);
        trackPerformance(startTime, true);
        return response;
        
    } catch (error) {
        console.error('🚨 SW: Request failed:', error);
        trackPerformance(startTime, false);
        return handleRequestError(request, error);
    }
}

// ===== STRATEGY EXECUTOR =====
async function executeStrategy(request, route) {
    switch (route.strategy) {
        case CACHE_STRATEGIES.CACHE_FIRST:
            return await cacheFirst(request, route);
            
        case CACHE_STRATEGIES.NETWORK_FIRST:
            return await networkFirst(request, route);
            
        case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
            return await staleWhileRevalidate(request, route.cache);
            
        case CACHE_STRATEGIES.NETWORK_ONLY:
            return await fetch(request);
            
        case CACHE_STRATEGIES.CACHE_ONLY:
            return await cacheOnly(request, route.cache);
            
        default:
            return await staleWhileRevalidate(request, route.cache);
    }
}

// ===== CACHING STRATEGIES =====

// 🎯 Cache First (Best for static assets)
async function cacheFirst(request, route) {
    const cache = await caches.open(route.cache);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, route.maxAge)) {
        performanceMetrics.cacheHits++;
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
            await limitCacheSize(route.cache, route.maxEntries);
        }
        
        performanceMetrics.networkRequests++;
        return networkResponse;
        
    } catch (error) {
        if (cachedResponse) {
            performanceMetrics.offlineRequests++;
            return cachedResponse;
        }
        throw error;
    }
}

// 🌐 Network First (Best for dynamic content)
async function networkFirst(request, route) {
    const cache = await caches.open(route.cache);
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
            await limitCacheSize(route.cache, route.maxEntries);
        }
        
        performanceMetrics.networkRequests++;
        return networkResponse;
        
    } catch (error) {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            performanceMetrics.offlineRequests++;
            return cachedResponse;
        }
        
        throw error;
    }
}

// 🔄 Stale While Revalidate (Best for frequently updated content)
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    // Background fetch to update cache
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Ignore network errors for background updates
    });
    
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        return cachedResponse;
    }
    
    performanceMetrics.networkRequests++;
    return await fetchPromise;
}

// 💾 Cache Only
async function cacheOnly(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        performanceMetrics.cacheHits++;
        return cachedResponse;
    }
    
    throw new Error('No cached response available');
}

// ===== UTILITY FUNCTIONS =====

function findMatchingRoute(request) {
    const url = new URL(request.url);
    return ROUTES.find(route => route.pattern.test(url.pathname + url.search));
}

function isExpired(response, maxAge) {
    if (!maxAge) return false;
    
    const dateHeader = response.headers.get('date');
    if (!dateHeader) return false;
    
    const responseTime = new Date(dateHeader).getTime();
    return Date.now() - responseTime > maxAge;
}

async function limitCacheSize(cacheName, maxEntries) {
    if (!maxEntries) return;
    
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxEntries) {
        const keysToDelete = keys.slice(0, keys.length - maxEntries);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
        console.log(`🗑️ SW: Cleaned ${keysToDelete.length} items from ${cacheName}`);
    }
}

// ===== ERROR HANDLING =====
async function handleRequestError(request, error) {
    const url = new URL(request.url);
    
    // Return offline page for HTML requests
    if (request.headers.get('Accept')?.includes('text/html')) {
        return createOfflinePage();
    }
    
    // Return placeholder for images
    if (/\.(png|jpg|jpeg|svg|gif|webp)$/i.test(url.pathname)) {
        return createImagePlaceholder();
    }
    
    // Return error response for other requests
    return new Response(
        JSON.stringify({
            error: 'Network unavailable',
            message: 'This content is not available offline',
            timestamp: new Date().toISOString()
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
        }
    );
}

function createOfflinePage() {
    return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ThannxAI - Offline</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: #f8fafc;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 2rem;
                }
                .offline-container {
                    max-width: 500px;
                    background: rgba(30, 41, 59, 0.8);
                    padding: 3rem;
                    border-radius: 1rem;
                    border: 1px solid #334155;
                    backdrop-filter: blur(20px);
                }
                .brain-animation {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                    animation: pulse 2s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                h1 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    background-clip: text;
                    -webkit-background-clip: text;
                    color: transparent;
                }
                p {
                    color: #cbd5e1;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }
                .retry-btn {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                    margin-right: 1rem;
                }
                .retry-btn:hover {
                    transform: translateY(-2px);
                }
                .home-btn {
                    background: transparent;
                    color: #3b82f6;
                    border: 2px solid #3b82f6;
                    padding: 1rem 2rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .home-btn:hover {
                    background: #3b82f6;
                    color: white;
                }
                .status {
                    margin-top: 2rem;
                    padding: 1rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid #ef4444;
                    border-radius: 0.5rem;
                    color: #fca5a5;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="brain-animation">🧠</div>
                <h1>You're Offline</h1>
                <p>
                    Don't worry! ThannxAI works offline too. Some features may be limited, 
                    but you can still browse cached content and explore our AI solutions.
                </p>
                <button class="retry-btn" onclick="window.location.reload()">
                    🔄 Try Again
                </button>
                <button class="home-btn" onclick="window.location.href='/Thannxai/'">
                    🏠 Go Home
                </button>
                <div class="status">
                    📡 Connection Status: Offline<br>
                    💾 Cached Content: Available<br>
                    🕒 Last Updated: <span id="lastUpdate"></span>
                </div>
            </div>
            <script>
                document.getElementById('lastUpdate').textContent = 
                    new Date().toLocaleString();
                
                // Check for connection every 5 seconds
                setInterval(() => {
                    if (navigator.onLine) {
                        window.location.reload();
                    }
                }, 5000);
            </script>
        </body>
        </html>
    `, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        }
    });
}

function createImagePlaceholder() {
    return new Response(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
            <rect width="400" height="300" fill="#1e293b"/>
            <circle cx="200" cy="120" r="30" fill="#3b82f6" opacity="0.3"/>
            <text x="200" y="180" text-anchor="middle" fill="#64748b" font-size="14" font-family="Arial">
                Image Unavailable Offline
            </text>
            <text x="200" y="200" text-anchor="middle" fill="#64748b" font-size="24">🖼️</text>
        </svg>
    `, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'max-age=86400'
        }
    });
}

// ===== PERFORMANCE TRACKING =====
function initializePerformanceTracking() {
    // Reset metrics
    performanceMetrics = {
        cacheHits: 0,
        cacheMisses: 0,
        networkRequests: 0,
        offlineRequests: 0,
        averageResponseTime: 0,
        startTime: Date.now()
    };
}

function trackPerformance(startTime, success) {
    const responseTime = performance.now() - startTime;
    
    if (success) {
        const currentAvg = performanceMetrics.averageResponseTime;
        const totalRequests = performanceMetrics.cacheHits + performanceMetrics.networkRequests;
        performanceMetrics.averageResponseTime = 
            (currentAvg * (totalRequests - 1) + responseTime) / totalRequests;
    }
}

// ===== BACKGROUND TASKS =====
function initializeBackgroundTasks() {
    // Clean up caches every hour
    setInterval(async () => {
        await Promise.all([
            limitCacheSize(CACHES.IMAGES, 100),
            limitCacheSize(CACHES.DYNAMIC, 50),
            limitCacheSize(CACHES.API, 30)
        ]);
    }, 60 * 60 * 1000);
    
    // Log performance metrics every 10 minutes
    setInterval(() => {
        console.log('📊 SW Performance:', performanceMetrics);
    }, 10 * 60 * 1000);
}

// ===== CACHE CLEANUP =====
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const validCaches = Object.values(CACHES);
    
    const deletionPromises = cacheNames
        .filter(cacheName => !validCaches.includes(cacheName))
        .map(cacheName => {
            console.log(`🗑️ SW: Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
        });
    
    await Promise.all(deletionPromises);
}

// ===== CLIENT COMMUNICATION =====
async function notifyClientsOfUpdate() {
    const clients = await self.clients.matchAll();
    
    clients.forEach(client => {
        client.postMessage({
            type: 'SW_UPDATED',
            version: SW_VERSION,
            timestamp: Date.now()
        });
    });
}

// ===== MESSAGE HANDLING =====
self.addEventListener('message', event => {
    const { data } = event;
    
    switch (data?.type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0]?.postMessage({ version: SW_VERSION });
            break;
            
        case 'GET_PERFORMANCE':
            event.ports[0]?.postMessage({ metrics: performanceMetrics });
            break;
            
        case 'CLEAR_CACHE':
            event.waitUntil(clearAllCaches());
            break;
            
        case 'FORCE_UPDATE':
            event.waitUntil(forceUpdateCache());
            break;
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🗑️ SW: All caches cleared');
}

async function forceUpdateCache() {
    const cache = await caches.open(CACHES.STATIC);
    await Promise.all(
        CRITICAL_ASSETS.map(async url => {
            try {
                const response = await fetch(url, { cache: 'reload' });
                if (response.ok) {
                    await cache.put(url, response);
                }
            } catch (error) {
                console.error(`Failed to update ${url}:`, error);
            }
        })
    );
    console.log('🔄 SW: Cache force updated');
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', event => {
    const data = event.data?.json() || {};
    
    const options = {
        body: data.body || 'New update from ThannxAI!',
        icon: '/Thannxai/icon-192.png',
        badge: '/Thannxai/badge-72.png',
        image: data.image,
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/Thannxai/',
            timestamp: Date.now()
        },
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: '/Thannxai/icon-open.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/Thannxai/icon-close.png'
            }
        ],
        requireInteraction: true,
        tag: 'thannxai-notification'
    };
    
    event.waitUntil(
        self.registration.showNotification('ThannxAI', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        const url = event.notification.data?.url || '/Thannxai/';
        event.waitUntil(
            clients.openWindow(url)
        );
    }
});

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(performBackgroundSync());
    }
});

async function performBackgroundSync() {
    try {
        // Sync offline form submissions
        await syncOfflineData();
        
        // Update critical content
        await updateCriticalContent();
        
        console.log('🔄 SW: Background sync completed');
    } catch (error) {
        console.error('🚨 SW: Background sync failed:', error);
    }
}

async function syncOfflineData() {
    // Implementation for syncing offline form submissions
    // This would typically involve IndexedDB operations
}

async function updateCriticalContent() {
    const cache = await caches.open(CACHES.STATIC);
    
    try {
        const response = await fetch('/Thannxai/', { cache: 'reload' });
        if (response.ok) {
            await cache.put('/Thannxai/', response);
        }
    } catch (error) {
        console.error('Failed to update critical content:', error);
    }
}

console.log(`🚀 ThannxAI Service Worker v${SW_VERSION} loaded successfully!`);
console.log('📊 Features enabled: Offline support, Smart caching, Push notifications, Background sync');
