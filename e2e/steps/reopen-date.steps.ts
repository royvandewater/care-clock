import { expect } from "@playwright/test";
import { Given, When, Then } from "./fixtures";

const todayStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

Given("I set the start date to {string}", async ({ page }, date: string) => {
  await page.getByLabel("Start Date").fill(date);
});

When("I reopen the app", async ({ page }) => {
  await page.goto("/");
});

Then("the start date should be today", async ({ page }) => {
  await expect(page.getByLabel("Start Date")).toHaveValue(todayStr());
});

Then("the end date should be today", async ({ page }) => {
  await expect(page.getByLabel("End Date")).toHaveValue(todayStr());
});
