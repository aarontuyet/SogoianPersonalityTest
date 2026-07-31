// sw.js — CACHE KILL SWITCH — 20260731-2

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );

    const openPages = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    await self.registration.unregister();

    await Promise.all(
      openPages.map(page =>
        page.navigate(page.url).catch(() => undefined)
      )
    );
  })());
});