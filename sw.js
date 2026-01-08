const CACHE_VERSION = 'v2.7.0'; // Major Performance Update
const CACHE_NAME = `tulpar-${CACHE_VERSION}`;
const ASSETS = [
    './',
    './index.html',
    './styles/main.css',
    './scripts/main.js',
    './scripts/lazy-loader.js',
    './scripts/ui-enhancements.js',
    './scripts/i18n.js',
    './scripts/legal-content.js',
    './scripts/tools-definitions.js',
    './scripts/tools/BaseTool.js',
    './scripts/workspace-fixed.js',
    './scripts/renderer-fixed.js',
    './scripts/performance.js',
    './scripts/accessibility.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Inter:wght@400;500;600;700;800&family=Lato:wght@400;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Merriweather:wght@400;700&family=Montserrat:wght@400;600;700&family=Oswald:wght@400;500;700&family=Playfair+Display:wght@400;700&family=Raleway:wght@400;600;700&family=Roboto:wght@400;500;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap'
];

// Install event
self.addEventListener('install', (event) => {
    // console.log(`[SW] Installing ${CACHE_VERSION}`);
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // console.log(`[SW] Caching assets for ${CACHE_VERSION}`);
                return cache.addAll(ASSETS);
            })
            .catch((err) => {
                // console.error('[SW] Cache installation failed:', err);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    // console.log(`[SW] Activating ${CACHE_VERSION}`);
    event.waitUntil(self.clients.claim());

    // Clean up old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        // console.log(`[SW] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event with network-first strategy for API calls
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Network-first for external APIs
    if (url.hostname !== location.hostname || url.pathname.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for local assets
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((fetchResponse) => {
                        // Cache new responses
                        if (fetchResponse && fetchResponse.status === 200) {
                            const responseClone = fetchResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                        }
                        return fetchResponse;
                    });
            })
            .catch((err) => {
                // console.error('[SW] Fetch failed:', err);
                // Return offline page if available
                return caches.match('./index.html');
            })
    );
});
