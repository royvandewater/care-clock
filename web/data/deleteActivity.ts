import { apiUrl } from "@/data/apiUrl";
import { assert } from "@/assert";
import { deleteActivityFromIndexedDB } from "@/data/database";

export const deleteActivity = async ({ database }: { database: IDBDatabase }, id: string) => {
  const res = await fetch(apiUrl(`/activities/${id}`), { method: "DELETE" });
  assert(res.ok, `Received non-2xx response from DELETE activity: ${res.status}`);

  await deleteActivityFromIndexedDB(database, id);
};
