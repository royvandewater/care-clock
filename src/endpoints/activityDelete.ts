import { OpenAPIRoute } from "chanfana";
import { z } from "zod";
import type { Context } from "hono";

import { assert } from "../assert";

export class ActivityDelete extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Delete an Activity by id. Leaves a blank row in the spreadsheet.",
    request: {
      params: z.object({
        id: z.uuid(),
      }),
    },
    responses: {
      "204": {
        description: "Returns no content",
      },
    },
  };

  async handle(c: Context<{ Bindings: Env }>) {
    const data = await this.getValidatedData<typeof this.schema>();
    assert(data.params, "params should be present after validation");

    const id = data.params.id;

    const stubId = c.env.ACTIVITY_QUEUE.idFromName("singleton");
    const stub = c.env.ACTIVITY_QUEUE.get(stubId);
    await stub.deleteActivity(id);

    return new Response(null, { status: 204 });
  }
}
