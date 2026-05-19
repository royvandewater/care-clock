import { OpenAPIRoute, Uuid } from "chanfana";
import { z } from "zod";
import type { Context } from "hono";

import { getSheetFromEnv } from "../sheets";

export class ActivityDelete extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Delete an Activity by id. Leaves a blank row in the spreadsheet.",
    request: {
      params: z.object({
        id: Uuid(),
      }),
    },
    responses: {
      "204": {
        description: "Returns no content",
      },
      "404": {
        description: "Returns a 404 status code if the id is not found",
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

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>();

    const id = data.params.id;

    const sheet = await getSheetFromEnv(c.env);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("Id") === id);
    if (!row) {
      return c.json({ success: false, message: `Activity with id ${id} not found` }, 404);
    }

    await row.delete();

    return new Response(null, { status: 204 });
  }
}
