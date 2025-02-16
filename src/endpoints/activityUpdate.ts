import { OpenAPIRoute } from "chanfana";
import { Activity } from "../types";
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

  async handle(c, env) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const activityToUpdate = {
      ...data.body,
      id: uuid(),
    };

    // Implement your own update here
  }
}
