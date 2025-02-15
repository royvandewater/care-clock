import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";

/**
 * @param {{camperName: string; description: string}} props
 * @returns {Promise<void>}
 */
export const startActivity = async ({ camperName, description }) => {
  const startTime = new Date();
  const url = new URL("/activities", apiUrl);
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      camperName,
      description,
      startTime: startTime.toISOString(),
    }),
  });

  const body = await res.text();
  assert(res.ok, `Failed to start activity: ${res.status} ${body}`);

  return { startTime };
};
