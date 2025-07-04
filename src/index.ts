import { fromHono } from "chanfana";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { ActivityUpsert } from "./endpoints/activityUpsert";

// Start a Hono app
const app = new Hono<Cloudflare.Env>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/docs",
});

openapi.use(cors());

// Register OpenAPI endpoints
openapi.put("/activities/:id", ActivityUpsert);

app.get("/*", async (c) => {
  const env = c.env as { ASSETS: any };
  return await env.ASSETS.fetch(c.req);
});

// Export the Hono app
export default app;
