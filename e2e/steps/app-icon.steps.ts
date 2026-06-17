import { expect } from "@playwright/test";
import { Then } from "./fixtures";

Then("the page should declare an apple-touch-icon", async ({ page }) => {
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
});

Then("the apple-touch-icon should load successfully", async ({ page }) => {
  const href = await page.locator('link[rel="apple-touch-icon"]').getAttribute("href");
  expect(href, "apple-touch-icon must have an href").toBeTruthy();

  const response = await page.request.get(new URL(href ?? "", page.url()).toString());
  expect(response.ok()).toBe(true);
});
