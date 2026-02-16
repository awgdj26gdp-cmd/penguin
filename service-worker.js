const CACHE_NAME = "penguin-v7"; // ★更新するたびに v を上げる
const ASSETS = [
  "./",
  "./index.html",
  "./script.v6.js",
  "./style.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./bg.png",
  "./cat.png",
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

  // GET以外は触らない（安全）
  if (req.method !== "GET") return;

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    const res = await fetch(req);
    return res;
  })());
});
