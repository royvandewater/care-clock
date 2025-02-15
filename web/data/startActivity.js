import { apiUrl } from "./apiUrl.js";
import { assert } from "../assert.js";
import { z } from "zod";

/**
 * @param {{camperName: string; description: string}} props
 * @returns {Promise<{startTime: Date; id: string}>}
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
  const data = responseSchema.parse(JSON.parse(body));

  return { startTime, id: data.activity.id };
};

const responseSchema = z.object({
  success: z.boolean(),
  activity: z.object({
    id: z.string(),
  }),
});
