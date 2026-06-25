import { fromHono } from "chanfana";
import { Hono } from "hono";

import { ActivityUpsert } from "./endpoints/activityUpsert";
import { ActivityDelete } from "./endpoints/activityDelete";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/docs",
});

// Register OpenAPI endpoints
openapi.put("/activities/:id", ActivityUpsert);
openapi.delete("/activities/:id", ActivityDelete);

// Export the Hono app
export default app;
