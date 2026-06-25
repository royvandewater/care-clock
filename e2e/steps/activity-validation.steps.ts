import { expect } from "@playwright/test";
import { When, Then } from "./fixtures";

// Validation runs before any Google Sheets access, so an over-limit
// description is rejected without needing real backend credentials.
let lastStatus: number;

When("I PUT an activity with a description of {int} characters", async ({ request }, length: number) => {
  const response = await request.put("/activities/11111111-1111-4111-8111-111111111111", {
    data: {
      therapistName: "Miss Amanda",
      camperName: "Alice",
      sessionType: "Individual",
      description: "x".repeat(length),
      startTime: "2026-06-25T10:00:00.000Z",
    },
  });
  lastStatus = response.status();
});

Then("the response status should be in the 4xx range", async () => {
  expect(lastStatus).toBeGreaterThanOrEqual(400);
  expect(lastStatus).toBeLessThan(500);
});
