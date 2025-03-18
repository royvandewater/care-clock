import { upsertActivityInIndexedDB } from "./database.js";
import { formatActivity } from "./serialization.js";
import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";

/**
 * Marks the activity as syncing and sends it to the server to be updated.
 * If the server returns an error, the activity is marked as unsynced. If the
 * server returns a 204, the activity is marked as synced.
 *
 * @param {{database: IDBDatabase}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; groupName: string; description: string; startTime: Date; endTime: Date | null}} activity
 */
export const upsertActivity = async ({ database }, activity) => {
  const updatedActivity = { ...formatActivity(activity), syncState: "syncing" };
  await upsertActivityInIndexedDB(database, updatedActivity);

  // intentionally not awaited so that the function is not blocked on the network request
  putActivity({ database }, updatedActivity);
};

/**
 *
 * @param {{database: IDBDatabase}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; groupName: string; description: string; startTime: string; endTime: string}} activity
 */
const putActivity = async ({ database }, activity) => {
  try {
    const res = await fetch(apiUrl(`/activities/${activity.id}`), {
      method: "PUT",
      body: JSON.stringify(activity),
    });

    const body = await res.text();
    assert(res.ok, `Received non-2xx response from PUT activity: ${res.status} ${body}`);

    await upsertActivityInIndexedDB(database, { ...activity, syncState: "synced" });
  } catch (error) {
    console.warn("Failed to update remote activity", error.message);
    await upsertActivityInIndexedDB(database, { ...activity, syncState: "unsynced" });
  }
};
