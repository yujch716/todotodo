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
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting(); // 새 서비스 워커 즉시 활성화
      }),
  );
});

// activate: 이전 캐시 삭제 + 클라이언트 즉시 제어
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        ),
      )
      .then(() => {
        return self.clients.claim(); // 모든 클라이언트 즉시 제어
      }),
  );
});

// fetch: 네트워크 우선, 실패 시 캐시에서 응답
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
