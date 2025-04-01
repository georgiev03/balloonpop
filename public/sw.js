const CACHE_NAME = 'balloon-game-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/mobile.html',
    '/manifest.json',
    '/src/main.js',
    '/src/mobile.js',
    '/src/mobile-config.js',
    '/src/orientation-handler.js',
    '/assets/balloon.png',
    '/assets/heart.png',
    '/assets/heart-empty.png',
    '/assets/pop.mp3',
    '/assets/win.mp3',
    '/assets/words.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache responses that aren't successful
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Clone the response as it can only be consumed once
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
}); 