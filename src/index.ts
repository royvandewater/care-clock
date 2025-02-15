import { fromHono } from "chanfana";
import { Hono } from "hono";

import { ActivityCreate } from "endpoints/activityCreate";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";
import { cors } from "hono/cors";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/docs",
});

openapi.use(cors());

// Register OpenAPI endpoints
openapi.post("/activities", ActivityCreate);
openapi.put("/activities/:activityId", ActivityUpdate);
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

// Export the Hono app
export default app;
