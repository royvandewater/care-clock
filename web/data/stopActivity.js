import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";
import { getActivityFromIndexedDB, updateActivityInIndexedDB } from "./database.js";

/**
 * @param {{database: IDBDatabase; channel: BroadcastChannel}} dependencies
 * @param {{id: string; therapistName: string; camperName: string; description: string; startTime: string; endTime: string}} activity
 */
export const stopActivity = async ({ database, channel }, activity) => {
  const storedActivity = await getActivityFromIndexedDB(database, activity.id);
  assert(storedActivity, `Activity not found: ${activity.id}`);

  const updatedActivity = { ...storedActivity, ...activity };
  await updateActivityInIndexedDB(database, updatedActivity);
  channel.postMessage({ action: "activity.new" });

  const { rowNumber } = updatedActivity;
  if (!rowNumber) {
    console.warn("activity doesn't have a row number, skipping network update", activity);
    return;
  }

  const url = new URL(`/activities/${rowNumber}`, apiUrl);
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(updatedActivity),
  });

  const body = await res.text();
  assert(res.ok, `Failed to stop activity: ${res.status} ${body}`);
};
