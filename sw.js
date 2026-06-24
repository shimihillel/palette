// v38 no-cache reset
self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k))))));
self.addEventListener('fetch', () => {});
