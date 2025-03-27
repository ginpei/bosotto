// Service Worker for Bosotto PWA

// Use a cache name with a timestamp that changes on each service worker update
const CACHE_NAME = 'bosotto-pwa-v2-' + Date.now();
// Get the base path for the app (in GitHub Pages it will be '/bosotto/')
const BASE_PATH = location.pathname.includes('/bosotto/') ? '/bosotto/' : '/';

const ASSETS_TO_CACHE = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'icons/icon-192x192.png',
  BASE_PATH + 'icons/icon-512x512.png'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request.clone())
      .then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Add to cache
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try to get from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If cache fails and it's a navigation, return the offline page
            if (event.request.mode === 'navigate') {
              return caches.match(BASE_PATH);
            }
            
            return null;
          });
      })
  );
});
