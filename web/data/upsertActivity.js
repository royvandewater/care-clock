import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";
import { getActivityFromIndexedDB, upsertActivityInIndexedDB } from "./database.js";
import { postActivity } from "./startActivity.js";
import { formatActivity, parseActivity } from "./serialization.js";

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; description: string; startTime: Date; endTime: Date | null}} activity
 */
export const upsertActivity = async ({ database }, activity) => {
  const { id, rowNumber } = await getActivityFromIndexedDB(database, activity.id);
  assert(id, `Activity not found: ${activity.id}`);

  const updatedActivity = { ...formatActivity(activity), rowNumber, syncState: "syncing" };
  await upsertActivityInIndexedDB(database, updatedActivity);

  if (!Number.isInteger(rowNumber)) {
    console.warn("activity doesn't have a row number, using create", activity);
    // intentionally not awaited so that the function is not blocked on the network request
    postActivity({ database }, updatedActivity);
    return;
  }

  // intentionally not awaited so that the function is not blocked on the network request
  putActivity({ database }, updatedActivity);
};

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; description: string; startTime: string; endTime: string}} activity
 */
const putActivity = async ({ database }, activity) => {
  try {
    const res = await fetch(apiUrl(`/activities/${activity.rowNumber}`), {
      method: "PUT",
      body: JSON.stringify(activity),
    });

    const body = await res.text();
    assert(res.ok, `Received non-2xx response from PUT activity: ${res.status} ${body}`);

    await upsertActivityInIndexedDB(database, { ...activity, syncState: "synced" });
  } catch (error) {
    console.error("Failed to update remote activity", error.message);
    await upsertActivityInIndexedDB(database, { ...activity, syncState: "unsynced" });
  }
};
