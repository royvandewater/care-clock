import { OpenAPIRoute } from "chanfana";
import { Activity } from "../types";
import { z } from "zod";
import { getSheetFromEnv } from "sheets";
import { fromISOString, fromLocaleString, toDurationString, toLocaleString } from "../date";

export class ActivityUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Update an Activity, usually to stop it",
    request: {
      params: z.object({
        rowNumber: z.number(),
      }),
      body: {
        content: {
          "application/json": {
            schema: Activity.pick({ description: true, endTime: true }),
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

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    const rowNumber = data.params.rowNumber; // -2 because the first row is the header and sheets are 1-indexed
    const activityToUpdate = data.body;

    const sheet = await getSheetFromEnv(c.env);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.rowNumber === rowNumber);
    if (!row) {
      return Response.json(
        {
          success: false,
          message: "Row not found",
        },
        { status: 404 }
      );
    }
    row.set("Description", activityToUpdate.description);
    if (activityToUpdate.endTime) {
      const startTime = fromLocaleString(row.get("Start"));
      const endTime = fromISOString(activityToUpdate.endTime);
      const duration = endTime.getTime() - startTime.getTime();

      row.set("End", toLocaleString(endTime));
      row.set("Duration", toDurationString(duration));
    }
    await row.save();

    return new Response(null, { status: 204 });
  }
}
