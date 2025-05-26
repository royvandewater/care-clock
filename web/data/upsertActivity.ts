import { upsertActivityInIndexedDB } from "@/data/database";
import { formatActivity } from "@/data/serialization";
import { apiUrl } from "@/data/apiUrl";
import { assert } from "@/assert";
import type { Activity } from "@/data/serialization";

export interface MultiCamperActivity extends Omit<Activity, "camperName" | "id"> {
  campers: { name: string; id: string }[];
}

/**
 * Marks the activity as syncing and sends it to the server to be updated.
 * If the server returns an error, the activity is marked as unsynced. If the
 * server returns a 204, the activity is marked as synced.
 */
export const upsertActivity = async ({ database }: { database: IDBDatabase }, activity: MultiCamperActivity) => {
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

const putActivity = async ({ database }: { database: IDBDatabase }, activity: Activity) => {
  try {
    const res = await fetch(apiUrl(`/activities/${activity.id}`), {
      method: "PUT",
      body: JSON.stringify(formatActivity(activity)),
    });

    const body = await res.text();
    assert(res.ok, `Received non-2xx response from PUT activity: ${res.status} ${body}`);

    await upsertActivityInIndexedDB(database, { ...activity, syncState: "synced" });
  } catch (error) {
    console.warn("Failed to update remote activity", String(error));
    await upsertActivityInIndexedDB(database, { ...activity, syncState: "unsynced" });
  }
};
