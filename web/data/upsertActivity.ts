import { upsertActivityInIndexedDB } from "@/data/database";
import { batchUpsertActivities } from "@/data/batchUpsertActivities";
import type { Activity } from "@/data/serialization";

export interface MultiCamperActivity extends Omit<Activity, "camperName" | "id"> {
  campers: { name: string; id: string | null }[];
}

/**
 * Expands the multi-camper activity into one Activity per camper, marks them all
 * as syncing, and sends them to the server together in a single batch request.
 * Each activity's syncState is updated from its per-item batch result.
 */
export const upsertActivity = async ({ database }: { database: IDBDatabase }, activity: MultiCamperActivity) => {
  const camperActivities: Activity[] = activity.campers.map((camper) => ({
    ...activity,
    camperName: camper.name,
    id: camper.id ?? self.crypto.randomUUID(),
    syncState: "syncing",
  }));

  await Promise.all(camperActivities.map((camperActivity) => upsertActivityInIndexedDB(database, camperActivity)));

  // intentionally not awaited so that the function is not blocked on the network request
  batchUpsertActivities({ database }, camperActivities);

  return {
    ...activity,
    campers: camperActivities.map((camperActivity) => ({ name: camperActivity.camperName, id: camperActivity.id })),
  };
};
