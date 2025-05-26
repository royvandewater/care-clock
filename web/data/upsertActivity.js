import { upsertActivityInIndexedDB } from "./database";
import { formatActivity } from "@/data/serialization";
import { apiUrl } from "./apiUrl.js";
import { assert } from "@/assert";

/**
 * @typedef {import("./sessionTypes.js").SessionType} SessionType
 */

/**
 * Marks the activity as syncing and sends it to the server to be updated.
 * If the server returns an error, the activity is marked as unsynced. If the
 * server returns a 204, the activity is marked as synced.
 *
 * @param {{database: IDBDatabase}} dependencies
 * @param {{
 *   therapistName: string,
 *   campers: {name: string, id: string}[],
 *   sessionType: SessionType,
 *   groupName: string,
 *   withWho: string,
 *   description: string,
 *   startTime: Date,
 *   endTime: Date,
 * }} activity
 */
export const upsertActivity = async ({ database }, activity) => {
  const camperActivities = activity.campers.map((camper) => ({
    ...activity,
    camperName: camper.name,
    id: camper.id ?? self.crypto.randomUUID(),
  }));

  await Promise.all(
    camperActivities.map(async (camperActivity) => {
      const updatedActivity = { ...camperActivity, syncState: "syncing" };
      await upsertActivityInIndexedDB(database, updatedActivity);

      // intentionally not awaited so that the function is not blocked on the network request
      putActivity({ database }, updatedActivity);
    }),
  );

  return {
    ...activity,
    campers: camperActivities.map((camperActivity) => ({ name: camperActivity.camperName, id: camperActivity.id })),
  };
};

/**
 *
 * @param {{database: IDBDatabase}} dependencies
 * @param {{
 *   id: string,
 *   camperName: string,
 *   therapistName: string,
 *   sessionType: SessionType,
 *   groupName: string,
 *   withWho: string,
 *   description: string,
 *   startTime: string,
 *   endTime: string
 * }} activity
 */
const putActivity = async ({ database }, activity) => {
  try {
    const res = await fetch(apiUrl(`/activities/${activity.id}`), {
      method: "PUT",
      body: JSON.stringify(formatActivity(activity)),
    });

    const body = await res.text();
    assert(res.ok, `Received non-2xx response from PUT activity: ${res.status} ${body}`);

    await upsertActivityInIndexedDB(database, { ...activity, syncState: "synced" });
  } catch (error) {
    console.warn("Failed to update remote activity", error.message);
    await upsertActivityInIndexedDB(database, { ...activity, syncState: "unsynced" });
  }
};
