const CACHE_NAME = "todotodo-cache-v2";
const urlsToCache = [
    "/",
    "/index.html",
    "/todotodo-logo.png",
    "/app-icon-1200px.png",
];

// install: 캐시 초기화 + 새 서비스워커 바로 활성화
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        }).then(() => {
            return self.skipWaiting();  // 새 서비스 워커 즉시 활성화
        })
    );
});


// activate: 이전 캐시 삭제 + 클라이언트 즉시 제어
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
        ).then(() => {
            return self.clients.claim();  // 모든 클라이언트 즉시 제어
        })
    );
});

// fetch: 캐시 우선, 없으면 네트워크 요청
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});