import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { ActivityCreate } from "endpoints/activityCreate";
import { ActivityUpdate } from "endpoints/activityUpdate";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/docs",
});

openapi.use(cors());

// Register OpenAPI endpoints
openapi.post("/activities", ActivityCreate);
openapi.put("/activities/:rowNumber", ActivityUpdate);

// Export the Hono app
export default app;
