import { Given, When } from "./fixtures";

// The real backend isn't reachable from the test environment, so the DELETE
// request would 403 and deleteActivity would refuse to remove the local
// record. Stub it to succeed so we can exercise the UI flow.
Given("the activity delete request will succeed", async ({ page }) => {
  await page.route("**/activities/*", async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 204 });
      return;
    }
    await route.continue();
  });
});

When("I open the activity history", async ({ page }) => {
  await page.getByLabel("History").click();
});

When("I open the activity for {string}", async ({ page }, name: string) => {
  await page.getByText(name).click();
});
