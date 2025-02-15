import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Activity, Task } from "../types";
import { v4 as uuid } from "uuid";

export class ActivityUpdate extends OpenAPIRoute {
  schema = {
    tags: ["Activities"],
    summary: "Update an Activity, usually to stop it",
    request: {
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
