const APP_PREFIX = 'pwa-budget-tracker';
const version = 'version_01';
const CACHE_NAME = APP_PREFIX + version;


const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    './icons/icon-512x512.png',
    './icons/icon-384x384.png',
    './icons/icon-192x192.png',
    './icons/icon-152x152.png',
    './icons/icon-144x144.png',
    './icons/icon-128x128.png',
    './icons/icon-96x96.png',
    './icons/icon-72x72.png'
];

self.addEventListener("install", (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();

});

self.addEventListener("activate", (evt) => {
    evt.waitUntil(
        caches.keys().then((keylist) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
    if (evt.request.url.includes("/api/") && evt.request.method === "GET") {
        evt.respondWith(
            caches
                .open(DATA_CACHE_NAME)
                .then((response) => {
                    if (response.status === 200) {
                        caches.put(evt.request, response.clone());
                    }
                    return response;
                })
                .catch(() => {
                    return cache.match(evt.request);
                })
        )
        return;

    }
    evt.respondWith(
        caches.match(evt.request).then((response) => {
            return response || fetch(evt.request)
        })
    )
});

