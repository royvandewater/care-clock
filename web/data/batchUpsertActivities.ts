import { upsertActivityInIndexedDB } from "@/data/database";
import { formatActivity } from "@/data/serialization";
import { apiUrl } from "@/data/apiUrl";
import { assert } from "@/assert";
import type { Activity } from "@/data/serialization";

interface BatchItemResult {
  id: string;
  status: "success" | "error";
  message?: string;
}

/**
 * Marks every activity as syncing, then sends them all to the server in a
 * single POST /activities/batch request. Each activity's syncState is then set
 * from its per-item result: "success" -> synced, anything else -> unsynced. If
 * the whole request fails, every activity is marked unsynced.
 */
export const batchUpsertActivities = async ({ database }: { database: IDBDatabase }, activities: Activity[]) => {
  if (activities.length === 0) {
    return;
  }

  await Promise.all(
    activities.map((activity) => upsertActivityInIndexedDB(database, { ...activity, syncState: "syncing" })),
  );

  try {
    const res = await fetch(apiUrl("/activities/batch"), {
      method: "POST",
      body: JSON.stringify(activities.map(formatActivity)),
    });

    const text = await res.text();
    assert(res.ok, `Received non-2xx response from POST batch activities: ${res.status} ${text}`);

    const { results } = JSON.parse(text) as { results: BatchItemResult[] };
    const resultById = new Map(results.map((result) => [result.id, result]));

    await Promise.all(
      activities.map((activity) => {
        const syncState = resultById.get(activity.id)?.status === "success" ? "synced" : "unsynced";
        return upsertActivityInIndexedDB(database, { ...activity, syncState });
      }),
    );
  } catch (error) {
    console.warn("Failed to batch update remote activities", String(error));
    await Promise.all(
      activities.map((activity) => upsertActivityInIndexedDB(database, { ...activity, syncState: "unsynced" })),
    );
  }
};
