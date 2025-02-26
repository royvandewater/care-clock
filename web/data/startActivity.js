import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";

/**
 * @param {{therapistName: string; camperName: string; description: string}} props
 * @returns {Promise<{startTime: Date; id: string}>}
 */
export const startActivity = async ({ therapistName, camperName, description, startTime }) => {
  const url = new URL("/activities", apiUrl);

  const res = await fetch(url, {
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

  /**
   * @type {{success: boolean; activity: {rowNumber: number}}}
   */
  const data = JSON.parse(body);

  return { rowNumber: data.activity.rowNumber };
};
