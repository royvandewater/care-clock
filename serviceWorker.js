import { startActivity } from "./web/data/startActivity.js";

/** @type {BroadcastChannel} */
let channel;

/** @type {IDBDatabase} */
let database;

self.addEventListener("activate", (event) => {
  channel = new BroadcastChannel("sw-broadcast");

  event.waitUntil(
    new Promise(async (resolve) => {
      await self.clients.claim();
      const request = self.indexedDB.open("care-clock", 1);
      request.onerror = (event) => console.error("indexedDB error", event);
      request.onsuccess = (event) => console.log("indexedDB success", event);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (db.objectStoreNames.contains("activities")) {
          console.log("activities object store already exists", db);
          database = db;
          resolve();
          return;
        }

        const objectStore = db.createObjectStore("activities", { keyPath: "id" });
        objectStore.transaction.oncomplete = (event) => {
          console.log("transaction completed", event);
          database = db;
          resolve();
        };
      };
      request.onsuccess = (event) => {
        console.log("request success", event);
        database = event.target.result;
        resolve();
      };
    })
  );
});

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async (request, event) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  const responseFromNetwork = await fetch(request);
  event.waitUntil(putInCache(request, responseFromNetwork.clone()));
  return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    return event.respondWith(cacheFirst(event.request, event));
  }

  return fetch(event.request);
});

self.addEventListener("message", (event) => {
  switch (event.data.action) {
    case "startActivity":
      return startActivity({ database, channel }, event.data);
    default:
      console.warn("unknown action", event.data);
      return;
  }
});
