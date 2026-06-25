import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import { When, Then } from "./fixtures";

let response: APIResponse;

// An empty body fails request validation with a 400 before the handler touches
// the spreadsheet, so this exercises the CORS middleware without external deps.
When("I request the activities API from another origin", async ({ request }) => {
  response = await request.fetch("/activities/00000000-0000-0000-0000-000000000000", {
    method: "PUT",
    headers: {
      Origin: "https://evil.example.com",
      "Content-Type": "application/json",
    },
    data: {},
  });
});

Then("the response should not include an Access-Control-Allow-Origin header", () => {
  expect(response.headers()["access-control-allow-origin"]).toBeUndefined();
});
