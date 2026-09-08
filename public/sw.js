// myICDCode.com — Service Worker
// StormGlass Interactive Inc.
// Caches key assets for fast loads and basic offline support

const CACHE_NAME = 'myicdcode-v1';
const STATIC_CACHE = 'myicdcode-static-v1';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/browse',
  '/about',
  '/manifest.json',
];

// Install — precache key pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip analytics and ads
  if (
    url.hostname.includes('google') ||
    url.hostname.includes('googlesyndication') ||
    url.hostname.includes('googletagmanager')
  ) return;

  event.respondWith(
    // Network first strategy — always try network
    fetch(request)
      .then(response => {
        // Cache successful responses for HTML and assets
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Network failed — try cache
        return caches.match(request)
          .then(cached => {
            if (cached) return cached;
            // For navigation requests, return cached homepage
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});
