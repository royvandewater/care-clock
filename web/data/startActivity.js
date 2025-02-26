import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";

/**
 * @param {IDBDatabase} database
 * @param {{therapistName: string; camperName: string; description: string}} props
 * @returns {Promise<{startTime: Date; id: string}>}
 */
export const startActivity = async (database, { therapistName, camperName, description, startTime }) => {
  const activity = {
    id: self.crypto.randomUUID(),
    therapistName,
    camperName,
    description,
    startTime,
  };

  await createActivityInIndexedDB(database, activity);

  const clients = await self.clients.matchAll();
  console.log("sending message to", clients.length, "clients");
  clients.forEach((client) => {
    client.postMessage({ action: "setActivityId", data: { id: activity.id } });
  });

  const res = await fetch(new URL("/activities", apiUrl), {
    method: "POST",
    body: JSON.stringify({
      therapistName,
      camperName,
      description,
      startTime,
    }),
  });

  const body = await res.text();
  assert(res.ok, `Failed to start activity: ${res.status} ${body}`);

  // TODO: Update indexedDB with rowNumber
  /**
   * @type {{success: boolean; activity: {rowNumber: number}}}
   */
  const data = JSON.parse(body);

  return { rowNumber: data.activity.rowNumber };
};

const createActivityInIndexedDB = async (database, activity) => {
  return new Promise((resolve, reject) => {
    const activitiesStore = database.transaction("activities", "readwrite").objectStore("activities");
    const request = activitiesStore.add(activity);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
