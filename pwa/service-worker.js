/* Habla service worker. Built by the `hablaServiceWorker` Vite plugin, which fills in the placeholders. */
/* eslint-disable no-restricted-globals */

const VERSION = '__HABLA_VERSION__';
/** The app shell: everything needed to open the app and study lessons offline. */
const PRECACHE = __HABLA_PRECACHE__;
/** Code that is only downloaded on demand (the French speech engine); kept once fetched. */
const ON_DEMAND = __HABLA_ON_DEMAND__;

const SHELL_CACHE = `habla-shell-${VERSION}`;
const RUNTIME_CACHE = 'habla-runtime-v1';

const scoped = (path) => new URL(path, self.registration.scope).href;
const INDEX_URL = scoped('index.html');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE.map(scoped)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key.startsWith('habla-shell-') && key !== SHELL_CACHE).map((key) => caches.delete(key)),
      );
      // Drop on-demand files from older releases; current ones keep working offline.
      const keep = new Set(ON_DEMAND.map(scoped));
      const runtime = await caches.open(RUNTIME_CACHE);
      const entries = await runtime.keys();
      await Promise.all(entries.filter((request) => !keep.has(request.url)).map((request) => runtime.delete(request)));
      await self.clients.claim();
    })(),
  );
});

async function pageResponse(request) {
  try {
    return await fetch(request);
  } catch {
    const cached = await caches.match(INDEX_URL, { cacheName: SHELL_CACHE });
    return cached ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Other origins (Supabase, the French voice model) handle their own caching or need the network.
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(pageResponse(request));
    return;
  }
  event.respondWith(cacheFirst(request));
});
