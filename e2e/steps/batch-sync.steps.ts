import { expect } from "@playwright/test";
import { Given, Then } from "./fixtures";

// The real backend isn't reachable from the test environment, so the batch
// request would fail and the activities would stay unsynced. Stub it to
// succeed (echoing a per-item success for each activity) so we can exercise
// the Upload All flow, and record each batch request to assert on it.
const batchRequests: unknown[][] = [];

Given("the batch sync request will succeed", async ({ page }) => {
  batchRequests.length = 0;
  await page.route("**/activities/batch", async (route) => {
    const activities = route.request().postDataJSON() as { id: string }[];
    batchRequests.push(activities);
    const results = activities.map((activity) => ({ id: activity.id, status: "success" }));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results }),
    });
  });
});

Then("exactly one batch sync request should have been made", async () => {
  expect(batchRequests).toHaveLength(1);
});

Then("the batch sync request should have contained {int} activities", async ({}, count: number) => {
  expect(batchRequests[0]).toHaveLength(count);
});
