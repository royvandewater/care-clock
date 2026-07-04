import { expect } from "@playwright/test";
import { Given, Then } from "./fixtures";

// The real backend isn't reachable from the test environment, so batch requests
// would fail and the activities would stay unsynced. Stub the endpoint so we can
// exercise the sync flow, and record each batch request to assert on it.
let batchRequests: unknown[][] = [];

Given("the batch sync request will fail", async ({ page }) => {
  batchRequests = [];
  await page.route("**/activities/batch", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "nope" }) });
  });
});

Given("the batch sync request will succeed", async ({ page }) => {
  batchRequests = [];
  // Registered last, so this handler wins over any earlier failure stub.
  await page.route("**/activities/batch", async (route) => {
    const activities = route.request().postDataJSON() as { id: string }[];
    batchRequests.push(activities);
    const results = activities.map((activity) => ({ id: activity.id, status: "success" }));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ results }) });
  });
});

Then("exactly one batch sync request should have been made", async () => {
  // batchUpsertActivities is fire-and-forget, so poll rather than checking instantly.
  await expect.poll(() => batchRequests.length).toBe(1);
});

Then("the batch sync request should have contained {int} activities", async ({}, count: number) => {
  expect(batchRequests[0]).toHaveLength(count);
});
