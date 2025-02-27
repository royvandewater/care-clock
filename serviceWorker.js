import { startActivity } from "./web/data/startActivity.js";
import { stopActivity } from "./web/data/stopActivity.js";

/** @type {BroadcastChannel} */
let channel;

/** @type {IDBDatabase} */
let database;

self.addEventListener("activate", (event) => {
  channel = new BroadcastChannel("sw-broadcast");

  event.waitUntil(
    new Promise(async (resolve, reject) => {
      await self.clients.claim();
      const request = self.indexedDB.open("care-clock", 1);
      request.onerror = (event) => reject(event);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (db.objectStoreNames.contains("activities")) {
          database = db;
          resolve();
          return;
        }

        const objectStore = db.createObjectStore("activities", { keyPath: "id" });
        objectStore.transaction.oncomplete = (event) => {
          database = db;
          resolve();
        };
      };
      request.onsuccess = (event) => {
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
    case "activity.start":
      return startActivity({ database, channel }, event.data);
    case "activity.stop":
      return stopActivity({ database, channel }, event.data);
    default:
      console.warn("unknown action", event.data);
      return;
  }
});
