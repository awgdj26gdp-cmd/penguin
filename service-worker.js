const CACHE_NAME = "pomodoro-pet-v1";
const ASSETS = [
  "/penguin/",
  "/penguin/index.html",
  "/penguin/script.js",
  "/penguin/manifest.json",
  "/penguin/icon-192.png",
  "/penguin/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
