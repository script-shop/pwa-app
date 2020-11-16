const CACHE_NAME = "v1.0";
const urlToCache = ["index.html", "offline.html"];

const self = this;

//Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened Cache");
        return cache.addAll(urlToCache);
      })
  )
});

//Listen for request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(() => {
        return fetch(event.request)
          .catch(() => caches.match("offline.html"))
      })
  )
});

//Activate
self.addEventListener("activate", (event) => {
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhiteList.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        )
      )
  )
});
