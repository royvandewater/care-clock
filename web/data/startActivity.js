import { apiUrl } from "./apiUrl.js";
import { createActivityInIndexedDB, updateActivityInIndexedDB } from "./database.js";

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{therapistName: string; camperName: string; description: string; startTime: string}} activity
 * @returns {Promise<{id: string}>}
 */
export const startActivity = async ({ database }, activity) => {
  activity = structuredClone({ ...activity, id: self.crypto.randomUUID() });

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
  const res = await fetch(apiUrl("/activities"), {
    method: "POST",
    body: JSON.stringify(activity),
  });

  const body = await res.text();
  if (!res.ok) {
    console.warn(`Failed to POST activity: ${res.status} ${body}`);
    return;
  }

  /** @type {{success: boolean; activity: {rowNumber: number}}} */
  const data = JSON.parse(body);
  await updateActivityInIndexedDB(database, { ...activity, rowNumber: data.activity.rowNumber });
};
