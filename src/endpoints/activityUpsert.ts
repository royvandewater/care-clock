import { OpenAPIRoute, Uuid } from "chanfana";
import { Activity } from "../types";
import { z } from "zod";
import { getSheetFromEnv } from "sheets";
import { fromISOString, toDurationString, toLocaleString } from "../date";

export class ActivityUpsert extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Update an Activity, usually to start or stop it",
    request: {
      params: z.object({
        id: Uuid(),
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

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    const id = data.params.id;
    const activity = data.body;

    const sheet = await getSheetFromEnv(c.env);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("Id") === id);
    if (!row) {
      await sheet.addRow({
        Therapist: activity.therapistName,
        Camper: activity.camperName,
        Type: activity.sessionType,
        Group: activity.groupName || null,
        "With Who": activity.withWho || null,
        Description: activity.description,
        Start: toLocaleString(fromISOString(activity.startTime)),
        End: activity.endTime ? toLocaleString(fromISOString(activity.endTime)) : null,
        Duration: getDuration(activity.startTime, activity.endTime),
        Id: id,
      });
      return new Response(null, { status: 204 });
    }

    row.set("Therapist", activity.therapistName);
    row.set("Camper", activity.camperName);
    row.set("Type", activity.sessionType);
    row.set("Group", activity.groupName || null);
    row.set("With Who", activity.withWho || null);
    row.set("Description", activity.description);
    row.set("Start", toLocaleString(fromISOString(activity.startTime)));
    row.set("End", activity.endTime ? toLocaleString(fromISOString(activity.endTime)) : null);
    row.set("Duration", getDuration(activity.startTime, activity.endTime));
    await row.save();

    return new Response(null, { status: 204 });
  }
}

const getDuration = (startTime: string, endTime?: string) => {
  if (!endTime) return null;

  const startTimeDate = fromISOString(startTime);
  const endTimeDate = fromISOString(endTime);
  const duration = endTimeDate.getTime() - startTimeDate.getTime();
  return toDurationString(duration);
};
