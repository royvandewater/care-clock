import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";
import { createActivityInIndexedDB, updateActivityInIndexedDB } from "./database.js";

/**
 * @param {{database: IDBDatabase; channel: BroadcastChannel}} dependencies
 * @param {{therapistName: string; camperName: string; description: string}} activity
 */
export const startActivity = async ({ database, channel }, { therapistName, camperName, description, startTime }) => {
  const activity = {
    id: self.crypto.randomUUID(),
    therapistName,
    camperName,
    description,
    startTime,
  };

  await createActivityInIndexedDB(database, activity);

  channel.postMessage({ action: "activity.setId", data: { id: activity.id } });

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

  /** @type {{success: boolean; activity: {rowNumber: number}}} */
  const data = JSON.parse(body);
  await updateActivityInIndexedDB(database, { ...activity, rowNumber: data.activity.rowNumber });
};
