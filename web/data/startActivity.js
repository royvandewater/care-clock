import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";
import { upsertActivityInIndexedDB } from "./database.js";
import { formatActivity, parseActivity } from "./serialization.js";

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{therapistName: string; camperName: string; description: string}} activity
 * @returns {Promise<void>}
 */
export const startActivity = async ({ database }, activity) => {
  activity = formatActivity({
    ...activity,
    id: self.crypto.randomUUID(),
    startTime: new Date(),
    endTime: null,
    syncState: "syncing",
  });

  await upsertActivityInIndexedDB(database, activity);

  // intentionally not awaited so that the function is not blocked on the network request
  postActivity({ database }, activity);

  return parseActivity(activity);
};

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; description: string; startTime: string}} activity
 */
export const postActivity = async ({ database }, activity) => {
  try {
    const res = await fetch(apiUrl("/activities"), {
      method: "POST",
      body: JSON.stringify(activity),
    });

    const body = await res.text();
    assert(res.ok, `Received non-2xx response from POST activity: ${res.status} ${body}`);

    /** @type {{success: boolean; activity: {rowNumber: number}}} */
    const data = JSON.parse(body);
    await upsertActivityInIndexedDB(database, { ...activity, rowNumber: data.activity.rowNumber, syncState: "synced" });
  } catch (error) {
    console.error("Failed to create remote activity", error.message);
    await upsertActivityInIndexedDB(database, { ...activity, syncState: "unsynced" });
  }
};
