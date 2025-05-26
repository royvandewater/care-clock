const cacheVersion = "v2";

const putInCache = async (request, response) => {
  const cache = await caches.open(cacheVersion);
  await cache.put(request, response);
};

const networkFirst = async (request, event) => {
  try {
    const responseFromNetwork = await fetch(request);
    event.waitUntil(putInCache(request, responseFromNetwork.clone()));
    return responseFromNetwork;
  } catch (e) {
    const responseFromCache = await caches.match(request);
    if (!responseFromCache) {
      throw e;
    }
    return responseFromCache;
  }
};

self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    return event.respondWith(networkFirst(event.request, event));
  }
});

// Cleanup old caches on version change
const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => key !== cacheVersion);
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});
