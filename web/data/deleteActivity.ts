import { apiUrl } from "@/data/apiUrl";
import { assert } from "@/assert";
import { deleteActivityFromIndexedDB } from "@/data/database";

/**
 * Deletes the activity remotely and then removes it from IndexedDB.
 * If the remote returns 404, treat the activity as already gone and still remove it locally.
 */
export const deleteActivity = async ({ database }: { database: IDBDatabase }, id: string) => {
  const res = await fetch(apiUrl(`/activities/${id}`), { method: "DELETE" });
  assert(res.ok || res.status === 404, `Received non-2xx response from DELETE activity: ${res.status}`);

  await deleteActivityFromIndexedDB(database, id);
};
