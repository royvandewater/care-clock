import { expect } from "@playwright/test";
import { When, Then } from "./fixtures";

Then("the page title should contain {string}", async ({ page }, title: string) => {
  await expect(page).toHaveTitle(new RegExp(title));
});

When("I change the start date to {string}", async ({ page }, value: string) => {
  await page.getByLabel("Start Date").fill(value);
});

const todayStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

Then("the start date should be today", async ({ page }) => {
  await expect(page.getByLabel("Start Date")).toHaveValue(todayStr());
});

Then("the end date should be today", async ({ page }) => {
  await expect(page.getByLabel("End Date")).toHaveValue(todayStr());
});

Then("the start time should be on the hour", async ({ page }) => {
  await expect(page.getByLabel("Start Time")).toHaveValue(/:00:00$/);
});

Then("the end time should be on the hour", async ({ page }) => {
  await expect(page.getByLabel("End Time")).toHaveValue(/:00:00$/);
});

When("I enter the start time as the end time", async ({ page }) => {
  const startTime = await page.getByLabel("Start Time").inputValue();
  await page.getByLabel("End Time").fill(startTime);
});

When("I save the activity anyway", async ({ page }) => {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Save anyway" }).click();
});

When("I select the {string} session type", async ({ page }, sessionType: string) => {
  await page.getByLabel("Select Session Type").click();
  await page.getByRole("button", { name: `Select ${sessionType}` }).click();
});

When("I fill in the group with {string}", async ({ page }, group: string) => {
  await page.getByLabel("Group").fill(group);
});

When("I fill in {string} with {string}", async ({ page }, label: string, value: string) => {
  await page.getByLabel(label).selectOption(value);
});

When("I fill in the description with {string}", async ({ page }, description: string) => {
  await page.getByLabel("Description").fill(description);
});

Then("the {string} field should not be present", async ({ page }, label: string) => {
  await expect(page.getByLabel(label)).not.toBeAttached();
});
