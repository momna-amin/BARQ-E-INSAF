/**
 * sw.js — minimal service worker.
 *
 * WHY THIS FILE IS REQUIRED:
 * Without a registered service worker, Chrome on Android will NOT generate
 * a WebAPK for this PWA. Instead, "Add to Home Screen" just creates a
 * lightweight bookmark-shortcut — which is exactly why it shows up with a
 * small Chrome badge on top of the icon and does not appear as a real entry
 * in the app drawer. Registering this file (see app/+html.tsx) is what
 * upgrades the install into a full WebAPK: real app-drawer icon, no browser
 * badge, own task-switcher entry.
 *
 * Kept intentionally simple — network-first, falling back to cache only
 * when offline. This is NOT meant to be a full offline-first strategy.
 */
const CACHE_NAME = 'barq-e-insaf-shell-v1';
const APP_SHELL = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
  );
});
