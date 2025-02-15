import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Activity, Task } from "../types";
import { v4 as uuid } from "uuid";

export class ActivityCreate extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Start a new Activity",
    request: {
      body: {
        content: {
          "application/json": {
            schema: Activity.omit({ id: true }),
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

    // Retrieve the validated request body
    const activityToCreate = {
      ...data.body,
      id: uuid(),
    };

    // Implement your own object insertion here

    // return the new task
    return {
      success: true,
      activity: {
        id: activityToCreate.id,
        camperName: activityToCreate.camperName,
        description: activityToCreate.description,
        startTime: activityToCreate.startTime,
      },
    };
  }
}
