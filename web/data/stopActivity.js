import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";

/**
 * @param {{id: string; description: string, endTime: Date}} props
 * @returns {Promise<void>}
 */
export const stopActivity = async ({ id, description, endTime }) => {
  const url = new URL(`/activities/${id}`, apiUrl);
  const res = await fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      description,
      endTime: endTime.toISOString(),
    }),
  });

  const body = await res.text();
  assert(res.ok, `Failed to stop activity: ${res.status} ${body}`);
};
