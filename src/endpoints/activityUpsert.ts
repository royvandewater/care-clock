import { OpenAPIRoute } from "chanfana";
import { Activity } from "../types";
import { z } from "zod";
import { assert } from "../assert";
import type { Context } from "hono";

export class ActivityUpsert extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Update an Activity, usually to start or stop it",
    request: {
      params: z.object({
        id: z.uuid(),
      }),
      body: {
        content: {
          "application/json": {
            schema: Activity.omit({ id: true }),
          },
        },
      },
    },
    responses: {
      "204": {
        description: "Returns no content",
      },
      "404": {
        description: "Returns a 404 status code if the row number is not found",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: Context<{ Bindings: Env }>) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();
    assert(data.params, "params should be present after validation");
    assert(data.body, "body should be present after validation");

    const id = data.params.id;
    const activity = data.body;

    const stubId = c.env.ACTIVITY_QUEUE.idFromName("singleton");
    const stub = c.env.ACTIVITY_QUEUE.get(stubId);
    await stub.upsertActivity(id, activity);

    return new Response(null, { status: 204 });
  }
}
