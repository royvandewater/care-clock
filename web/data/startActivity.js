import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";
import { createActivityInIndexedDB, updateActivityInIndexedDB } from "./database.js";

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{therapistName: string; camperName: string; description: string; startTime: string}} activity
 * @returns {Promise<{id: string}>}
 */
export const startActivity = async ({ database }, activity) => {
  activity = structuredClone({ ...activity, id: self.crypto.randomUUID(), syncState: "syncing" });

  await createActivityInIndexedDB(database, activity);

  // intentionally not awaited so that the function is not blocked on the network request
  postActivity({ database }, activity);

  return { id: activity.id };
};

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; description: string; startTime: string}} activity
 */
const postActivity = async ({ database }, activity) => {
  try {
    const res = await fetch(apiUrl("/activities"), {
      method: "POST",
      body: JSON.stringify(activity),
    });

    const body = await res.text();
    assert(res.ok, `Received non-2xx response from POST activity: ${res.status} ${body}`);

    /** @type {{success: boolean; activity: {rowNumber: number}}} */
    const data = JSON.parse(body);
    await updateActivityInIndexedDB(database, { ...activity, rowNumber: data.activity.rowNumber, syncState: "synced" });
  } catch (error) {
    console.error("Failed to create remote activity", error.message);
    await updateActivityInIndexedDB(database, { ...activity, syncState: "unsynced" });
  }
};
