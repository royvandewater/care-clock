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

  const updatedActivity = { ...storedActivity, ...activity, synchronized: false };
  await updateActivityInIndexedDB(database, updatedActivity);

  const { rowNumber } = updatedActivity;
  if (!rowNumber) {
    console.warn("activity doesn't have a row number, skipping network update", activity);
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
  const res = await fetch(apiUrl(`/activities/${activity.rowNumber}`), {
    method: "PUT",
    body: JSON.stringify(activity),
  });

  const body = await res.text();
  if (!res.ok) {
    console.warn(`Failed to PUT activity: ${res.status} ${body}`);
    return;
  }

  await updateActivityInIndexedDB(database, { ...activity, synchronized: true });
};
