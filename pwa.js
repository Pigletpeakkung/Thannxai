/* ===== PWA REGISTRATION & MANAGEMENT ===== */

class PWAManager {
    constructor() {
        this.swRegistration = null;
        this.isOnline = navigator.onLine;
        this.deferredPrompt = null;
        this.updateAvailable = false;
        
        this.init();
    }

    async init() {
        this.setupServiceWorker();
        this.setupInstallPrompt();
        this.setupOnlineOfflineHandling();
        this.setupNotifications();
        this.setupBackgroundSync();
        this.setupPeriodicSync();
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('✅ Service Worker registered:', this.swRegistration);

                // Handle updates
                this.swRegistration.addEventListener('updatefound', () => {
                    const newWorker = this.swRegistration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });

                // Listen for messages from SW
                navigator.serviceWorker.addEventListener('message', (event) => {
                    this.handleSWMessage(event.data);
                });

                // Check for updates
                this.checkForUpdates();

            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA installed successfully!');
            this.hideInstallButton();
            this.trackEvent('pwa_installed');
        });
    }

    setupOnlineOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showOnlineNotification();
            this.syncWhenOnline();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineNotification();
        });
    }

    async setupNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('✅ Notification permission granted');
                this.subscribeToNotifications();
            }
        }
    }

    async setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            // Register for background sync when offline actions occur
            document.addEventListener('submit', (e) => {
                if (!this.isOnline) {
                    this.registerBackgroundSync('form-submission');
                }
            });
        }
    }

    async setupPeriodicSync() {
        if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
            try {
                await this.swRegistration.periodicSync.register('consciousness-sync', {
                    minInterval: 24 * 60 * 60 * 1000 // 24 hours
                });
                console.log('✅ Periodic sync registered');
            } catch (error) {
                console.log('⚠️ Periodic sync not supported:', error);
            }
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('🎉 User accepted PWA install');
                this.trackEvent('pwa_install_accepted');
            } else {
                console.log('❌ User dismissed PWA install');
                this.trackEvent('pwa_install_dismissed');
            }
            
            this.deferredPrompt = null;
        }
    }

    async updateSW() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    async checkForUpdates() {
        if (this.swRegistration) {
            await this.swRegistration.update();
        }
    }

    async subscribeToNotifications() {
        try {
            const subscription = await this.swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });

            // Send subscription to server
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });

            console.log('✅ Push notification subscription successful');
        } catch (error) {
            console.error('❌ Push notification subscription failed:', error);
        }
    }

    async registerBackgroundSync(tag) {
        if (this.swRegistration) {
            try {
                await this.swRegistration.sync.register(tag);
                console.log('✅ Background sync registered:', tag);
            } catch (error) {
                console.error('❌ Background sync registration failed:', error);
            }
        }
    }

    showInstallButton() {
        const installButton = document.getElementById('install-pwa');
        if (installButton) {
            installButton.style.display = 'block';
            installButton.addEventListener('click', () => this.installPWA());
        }
    }

    hideInstallButton() {
        const installButton = document.getElementById('install-pwa');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    showUpdateNotification() {
        this.updateAvailable = true;
        
        // Show update notification
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>🔄 New version available!</span>
                <button onclick="pwaManager.updateSW()">Update</button>
                <button onclick="this.parentElement.parentElement.remove()">Later</button>
            </div>
        `;
        
        document.body.appendChild(notification);
    }

    showOnlineNotification() {
        this.showToast('🌐 Back online! Syncing data...', 'success');
    }

    showOfflineNotification() {
        this.showToast('📱 You\'re offline. Some features may be limited.', 'warning');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    async syncWhenOnline() {
        if (this.swRegistration) {
            // Trigger various sync operations
            await this.registerBackgroundSync('consciousness-sync');
            await this.registerBackgroundSync('analytics-sync');
            await this.registerBackgroundSync('user-preferences');
        }
    }

    handleSWMessage(data) {
        const { type, payload } = data;
        
        switch (type) {
            case 'SW_METRICS':
                this.updatePerformanceMetrics(payload.metrics);
                break;
                
            case 'CONSCIOUSNESS_UPDATE':
                this.handleConsciousnessUpdate(payload);
                break;
                
            case 'CACHE_UPDATED':
                console.log('📦 Cache updated:', payload);
                break;
                
            default:
                console.log('Unknown SW message:', type, payload);
        }
    }

    updatePerformanceMetrics(metrics) {
        // Update UI with performance metrics
        const metricsElement = document.getElementById('sw-metrics');
        if (metricsElement) {
            metricsElement.innerHTML = `
                <div class="metric">Cache Hits: ${metrics.cacheHits}</div>
                <div class="metric">Cache Misses: ${metrics.cacheMisses}</div>
                <div class="metric">Network Requests: ${metrics.networkRequests}</div>
                <div class="metric">Offline Requests: ${metrics.offlineRequests}</div>
            `;
        }
    }

    handleConsciousnessUpdate(payload) {
        // Handle consciousness-specific updates
        console.log('🧠 Consciousness update:', payload);
        
        // Trigger UI updates
        document.dispatchEvent(new CustomEvent('consciousnessUpdate', {
            detail: payload
        }));
    }

    trackEvent(eventName, properties = {}) {
        // Track PWA events
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Store for offline sync
        const event = {
            name: eventName,
            properties,
            timestamp: Date.now()
        };
        
        this.storeOfflineEvent(event);
    }

    async storeOfflineEvent(event) {
        // Store events for later sync
        const events = JSON.parse(localStorage.getItem('offline-events') || '[]');
        events.push(event);
        localStorage.setItem('offline-events', JSON.stringify(events));
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();

// Export for global use
window.pwaManager = pwaManager;
