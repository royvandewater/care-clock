/**
 * @typedef {{
 *   id: string;
 *   therapistName: string;
 *   camperName: string;
 *   description: string;
 *   startTime: string;
 *   endTime?: string;
 *   rowNumber?: number;
 * }} Activity
 */

/**
 * @param {IDBDatabase} database
 * @param {Activity} activity
 */
export const createActivityInIndexedDB = async (database, activity) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readwrite").objectStore("activities");
    const request = activitiesStore.add(activity);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * @param {IDBDatabase} database
 * @param {Activity} activity
 */
export const updateActivityInIndexedDB = async (database, activity) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readwrite").objectStore("activities");
    const request = activitiesStore.put(activity);
    request.onsuccess = () => resolve();
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
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
