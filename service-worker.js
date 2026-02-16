const CACHE_NAME = "penguin-v7"; // ★更新するたびに v を上げる
const ASSETS = [
  "./", // ★名前を変更したら確認する
  "./index.html",
  "./script.v6.js",
  "./style.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./bg.png",
  "./cat_v2.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
  })());
  self.skipWaiting(); // すぐ新SWに切り替え
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // ★古いキャッシュ全部削除
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
    }));
    await self.clients.claim(); // 開いてるページも新SWが担当
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // ★画像はネット優先（更新が反映されやすい）
  if (req.destination === "image") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req))
    );
    return;
  }

  // それ以外はキャッシュ優先
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
