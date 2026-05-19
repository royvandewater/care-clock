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
    },
  };

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>();

    const id = data.params.id;

    const sheet = await getSheetFromEnv(c.env);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("Id") === id);
    if (row) {
      await sheet.clearRows({ start: row.rowNumber, end: row.rowNumber });
    }

    return new Response(null, { status: 204 });
  }
}
