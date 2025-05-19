import { parseActivity } from "./serialization.js";

/** @returns {Promise<IDBDatabase>} */
export const connectToDatabase = async () => {
  return new Promise(async (resolve, reject) => {
    const request = self.indexedDB.open("care-clock", 1);
    request.onerror = (event) => reject(event);
    request.onsuccess = (event) => {
      window.db = event.target.result;
      return resolve(event.target.result);
    };
    // is only called if the version has changed
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (db.objectStoreNames.contains("activities")) {
        return;
      }

      const objectStore = db.createObjectStore("activities", { keyPath: "id" });
      objectStore.createIndex("syncState", "syncState", { unique: false });
    };
  });
};

/**
 * @typedef {{
 *   id: string;
 *   therapistName: string;
 *   camperName: string;
 *   groupName: string;
 *   description: string;
 *   startTime: string;
 *   endTime?: string;
 *   syncState: "unsynced" | "syncing" | "synced";
 * }} Activity
 */

/**
 * @param {IDBDatabase} database
 * @param {Activity} activity
 */
export const upsertActivityInIndexedDB = async (database, activity) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readwrite").objectStore("activities");
    const request = activitiesStore.put(activity);
    request.onsuccess = () => {
      database.dispatchEvent(new Event("activities:changed"));
      return resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * @param {IDBDatabase} database
 * @param {string} id
 * @returns {Promise<Activity>}
 */
export const getActivityFromIndexedDB = async (database, id) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    const request = activitiesStore.get(id);
    request.onsuccess = () => resolve(parseActivity(request.result));
    request.onerror = () => reject(request.error);
  });
};

/**
 * Returns all activities that are synced.
 * @param {IDBDatabase} database
 * @returns {Promise<Activity[]>}
 */
export const getSyncedActivities = async (database) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    const request = activitiesStore.index("syncState").getAll("synced");
    request.onsuccess = () => resolve(request.result.map(parseActivity).sort(startTimesDesc));
    request.onerror = () => reject(request.error);
  });
};

/**
 * Returns all activities that are unsynced. This does not include activities that are syncing.
 * @param {IDBDatabase} database
 * @returns {Promise<Activity[]>}
 */
export const getUnsyncedActivities = async (database) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    const request = activitiesStore.index("syncState").getAll("unsynced");
    request.onsuccess = () => resolve(request.result.map(parseActivity).sort(startTimesDesc));
    request.onerror = () => reject(request.error);
  });
};

/**
 * Returns all activities that are not synced. This includes both unsynced and syncing activities.
 * @param {IDBDatabase} database
 * @returns {Promise<Activity[]>}
 */
export const getActivitesThatAreNotSynced = async (database) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    // This bound() call only works because "synced" is before "syncing" lexicographically and is therefore
    // outside the range of "syncing" -> "unsynced"
    const request = activitiesStore.index("syncState").getAll(IDBKeyRange.bound("syncing", "unsynced"));
    request.onsuccess = () => resolve(request.result.map(parseActivity).sort(startTimesDesc));
    request.onerror = () => reject(request.error);
  });
};

// const startTimesAsc = (a, b) => a.startTime - b.startTime;
const startTimesDesc = (a, b) => b.startTime - a.startTime;
