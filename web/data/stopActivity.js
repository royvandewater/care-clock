import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";
import { getActivityFromIndexedDB, updateActivityInIndexedDB } from "./database.js";

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; description: string; startTime: string; endTime: string}} activity
 */
export const stopActivity = async ({ database }, activity) => {
  const storedActivity = await getActivityFromIndexedDB(database, activity.id);
  assert(storedActivity, `Activity not found: ${activity.id}`);

  const updatedActivity = { ...storedActivity, ...activity, syncState: "syncing" };
  await updateActivityInIndexedDB(database, updatedActivity);

  const { rowNumber } = updatedActivity;
  if (!rowNumber) {
    console.warn("activity doesn't have a row number, skipping network update", activity);
    await updateActivityInIndexedDB(database, { ...updatedActivity, syncState: "unsynced" });
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

    await updateActivityInIndexedDB(database, { ...activity, syncState: "synced" });
  } catch (error) {
    console.error("Failed to update remote activity", error.message);
    await updateActivityInIndexedDB(database, { ...activity, syncState: "unsynced" });
  }
};
