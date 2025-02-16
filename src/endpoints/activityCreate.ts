import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Activity } from "../types";
import { getSheetFromEnv } from "sheets";

export class ActivityCreate extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Start a new Activity",
    request: {
      body: {
        content: {
          "application/json": {
            schema: Activity.omit({ rowNumber: true }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the created task",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  activity: Activity,
                }),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    const activityToCreate = {
      ...data.body,
    };

    const sheet = await getSheetFromEnv(c.env);
    await sheet.loadHeaderRow();

    const row = await sheet.addRow({
      Therapist: activityToCreate.therapistName,
      Camper: activityToCreate.camperName,
      Description: activityToCreate.description,
      Start: new Date(activityToCreate.startTime).toLocaleString(),
    });

    // return the new task
    return {
      success: true,
      activity: {
        rowNumber: row.rowNumber,
        ...activityToCreate,
      },
    };
  }
}
