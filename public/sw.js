const CACHE_NAME = "todotodo-cache-v3";
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
  if (event.request.method !== "GET") {
    event.respondWith(fetch(event.request));
    return;
  }

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

// push: 서버에서 보낸 알림 표시
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "todotodo";
  const options = {
    body: payload.body || "",
    icon: "/app-icon-1200px.png",
    badge: "/app-icon-1200px.png",
    tag: payload.tag,
    data: { url: payload.url || "/calendar" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// notificationclick: 열려있는 창이 있으면 포커스, 없으면 새로 연다
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/calendar";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            if ("navigate" in client) {
              return client
                .navigate(targetUrl)
                .then((c) => (c ? c.focus() : client.focus()));
            }
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});
