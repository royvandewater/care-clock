import { OpenAPIRoute } from "chanfana";
import { Activity } from "../types";
import { z } from "zod";
import { assert } from "../assert";
import type { Context } from "hono";

const BatchItemResult = z.object({
  id: z.uuid(),
  status: z.enum(["success", "error"]),
  message: z.string().nullish(),
});

export class ActivityBatchUpsert extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Upsert many Activities in a single batch, syncing them together",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.array(Activity),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns a per-item result for each Activity in the batch",
        content: {
          "application/json": {
            schema: z.object({
              results: z.array(BatchItemResult),
            }),
          },
        },
      },
    },
  };

  async handle(c: Context<{ Bindings: Env }>) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();
    assert(data.body, "body should be present after validation");

    const activities = data.body;

    const stubId = c.env.ACTIVITY_QUEUE.idFromName("singleton");
    const stub = c.env.ACTIVITY_QUEUE.get(stubId);
    const results = await stub.upsertActivities(activities);

    return Response.json({ results });
  }
}
