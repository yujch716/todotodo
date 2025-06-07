const CACHE_NAME = "todotodo-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/todotodo-logo.png",
    "/app-icon-1200px.png",
];

// install: 캐시 초기화
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// activate: 이전 캐시 정리
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});

// fetch: 캐시 먼저 확인, 없으면 네트워크 요청
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
