/**
 * Service Worker — Sogoian Personality Assessment
 * Cache-first strategy. Precaches all critical static assets.
 * Bump CACHE_VERSION on any deployment to invalidate stale caches.
 */

const CACHE_VERSION = 'sogoian-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/src/questions.js',
  '/src/engine.js',
  '/src/app.js',
  // Archetype images
  '/assets/images/theGeneral.jpg',
  '/assets/images/theCaretaker.jpg',
  '/assets/images/theOverachiever.jpg',
  '/assets/images/theAngel.jpg',
  '/assets/images/theInmyfeels.jpg',
  '/assets/images/theCreative.jpg',
  '/assets/images/theFairy.jpg',
  '/assets/images/theRecluse.jpg',
  '/assets/images/theMadScientist.jpg',
  '/assets/images/theTrickster.jpg',
  '/assets/images/theDeviant.jpg',
  '/assets/images/theManipulator.jpg',
];

// ── Install: precache all assets ──────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: purge old caches ────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_VERSION)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first, network fallback ─────────────────────────────────────
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for same-origin or precached CDN assets
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // Not in cache — fetch from network and cache the response
      return fetch(event.request).then((networkResponse) => {
        // Only cache valid responses from our own origin
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed and nothing in cache — return the offline shell
        return caches.match('/index.html');
      });
    })
  );
});
