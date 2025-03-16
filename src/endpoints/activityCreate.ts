import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Activity } from "../types";
import { getSheetFromEnv } from "sheets";
import { fromISOString, toDurationString, toLocaleString } from "../date";

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
      Start: toLocaleString(fromISOString(activityToCreate.startTime)),
      End: activityToCreate.endTime ? toLocaleString(fromISOString(activityToCreate.endTime)) : null,
      Duration: getDuration(activityToCreate.startTime, activityToCreate.endTime),
      Id: activityToCreate.id,
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

const getDuration = (startTime: string, endTime?: string) => {
  if (!endTime) return null;

  const startTimeDate = fromISOString(startTime);
  const endTimeDate = fromISOString(endTime);
  const duration = endTimeDate.getTime() - startTimeDate.getTime();
  return toDurationString(duration);
};
