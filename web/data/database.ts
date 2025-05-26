import { formatActivity, parseActivity } from "./serialization.js";
import { assert } from "@/assert";

export const connectToDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = self.indexedDB.open("care-clock", 1);
    request.onerror = (event) => reject(event);
    request.onsuccess = (event) => {
      assert(event.target, "Event target not found");
      assert("result" in event.target, "Result not found");
      const db = event.target.result as IDBDatabase;
      return resolve(db);
    };
    // is only called if the version has changed
    request.onupgradeneeded = (event) => {
      assert(event.target, "Event target not found");
      assert("result" in event.target, "Result not found");
      const db = event.target.result as IDBDatabase;

      if (db.objectStoreNames.contains("activities")) {
        return;
      }

      const objectStore = db.createObjectStore("activities", { keyPath: "id" });
      objectStore.createIndex("syncState", "syncState", { unique: false });
    };
  });
};

type Activity = ReturnType<typeof parseActivity>;

export const upsertActivityInIndexedDB = async (database: IDBDatabase, activity: Activity) => {
  return new Promise<void>((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readwrite").objectStore("activities");
    const request = activitiesStore.put(formatActivity(activity));
    request.onsuccess = () => {
      database.dispatchEvent(new Event("activities:changed"));
      return resolve();
    };
    request.onerror = () => reject(request.error);
  });
};

export const getActivityFromIndexedDB = async (database: IDBDatabase, id: string) => {
  return new Promise<Activity>((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    const request = activitiesStore.get(id);
    request.onsuccess = () => resolve(parseActivity(request.result));
    request.onerror = () => reject(request.error);
  });
};

export const getSyncedActivities = async (database: IDBDatabase) => {
  return new Promise<Activity[]>((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    const request = activitiesStore.index("syncState").getAll("synced");
    request.onsuccess = () => resolve(request.result.map(parseActivity).sort(startTimesDesc));
    request.onerror = () => reject(request.error);
  });
};

export const getUnsyncedActivities = async (database: IDBDatabase) => {
  return new Promise<Activity[]>((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    const request = activitiesStore.index("syncState").getAll("unsynced");
    request.onsuccess = () => resolve(request.result.map(parseActivity).sort(startTimesDesc));
    request.onerror = () => reject(request.error);
  });
};

export const getActivitesThatAreNotSynced = async (database: IDBDatabase) => {
  return new Promise<Activity[]>((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readonly").objectStore("activities");
    // This bound() call only works because "synced" is before "syncing" lexicographically and is therefore
    // outside the range of "syncing" -> "unsynced"
    const request = activitiesStore.index("syncState").getAll(IDBKeyRange.bound("syncing", "unsynced"));
    request.onsuccess = () => resolve(request.result.map(parseActivity).sort(startTimesDesc));
    request.onerror = () => reject(request.error);
  });
};

const startTimesDesc = (a: Activity, b: Activity) => {
  if (a.startTime === null) {
    return 1;
  }
  if (b.startTime === null) {
    return -1;
  }
  return b.startTime.getTime() - a.startTime.getTime();
};
