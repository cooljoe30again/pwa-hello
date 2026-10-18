// SERVICE WORKER — the PWA's offline brain.
//
// A service worker is a script the browser runs on a background thread,
// separate from any page. It can intercept every network request the app
// makes and decide: serve from cache, go to network, or fall back.
// It keeps running (briefly) even with no tabs open — that's also what
// powers push notifications and background sync in real apps.

const CACHE_NAME = 'pwa-hello-v1';

// The "app shell": everything needed to render the app with no network.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// INSTALL: "download the app shell right now, so we're offline-ready
// before the user ever loses connectivity." skipWaiting() makes the new
// worker take over immediately instead of waiting for tabs to close.
self.addEventListener('install', (event) => {
  console.log('[sw] install: caching app shell');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE: "I'm the live worker now." Clean up caches from older versions
// so updates don't pile up stale files. clients.claim() takes control of
// open pages immediately.
self.addEventListener('activate', (event) => {
  console.log('[sw] activate: cleaning old caches');
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// FETCH: the heart of it. Every request the page makes comes through here.
// Strategy: cache-first, then network (and stash a copy), then fall back
// to the cached page if we're fully offline.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        console.log('[sw] serving from cache:', event.request.url);
        return cached;
      }
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          console.log('[sw] offline, falling back to cached page');
          return caches.match('./index.html');
        });
    })
  );
});
