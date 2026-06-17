import { expect } from "@playwright/test";
import { When, Then } from "./fixtures";

When("I open the settings", async ({ page }) => {
  await page.getByLabel("Settings").click();
});

Then(
  "the therapist options should be in the order:",
  async ({ page }, table: { raw: () => string[][] }) => {
    const expected = table.raw().map(([name]) => name);
    const options = page.getByLabel("Therapist").locator("option");
    await expect(options).toHaveText(["Select a therapist", ...expected]);
  },
);
