import { expect } from "@playwright/test";
import { Given, When, Then } from "./fixtures";

Given("I open the home page", async ({ page }) => {
  await page.goto("/");
});

Given("the therapist is set to {string}", async ({ page }, therapist: string) => {
  await page.getByLabel("Settings").click();
  await page.getByLabel("Therapist").selectOption(therapist);
  await page.getByLabel("Back").click();
});

Given("the camper {string} has been added and selected", async ({ page }, name: string) => {
  await page.getByLabel("Select Campers").click();
  await page.getByRole("button", { name: "Edit Campers" }).click();
  await page.getByLabel("Camper Name").fill(name);
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Back" }).click(); // back to campers modal
  await page.getByText(name).click();
  await page.getByRole("button", { name: "Back" }).click(); // back to home
});

When("I click the {string} button", async ({ page }, name: string) => {
  await page.getByRole("button", { name }).click();
});

When("I click the {string} button exactly", async ({ page }, name: string) => {
  await page.getByRole("button", { name, exact: true }).click();
});

When("I open the camper selector", async ({ page }) => {
  await page.getByLabel("Select Campers").click();
});

When("I enter camper edit mode", async ({ page }) => {
  await page.getByRole("button", { name: "Edit Campers" }).click();
});

When("I add the camper {string}", async ({ page }, name: string) => {
  await page.getByLabel("Camper Name").fill(name);
  await page.getByRole("button", { name: "Add" }).click();
});

Then("I should not see the {string} button", async ({ page }, name: string) => {
  await expect(page.getByRole("button", { name })).not.toBeVisible();
});

Then("the {string} button should be disabled", async ({ page }, name: string) => {
  await expect(page.getByRole("button", { name })).toBeDisabled();
});

Then("the {string} button should be enabled", async ({ page }, name: string) => {
  await expect(page.getByRole("button", { name })).toBeEnabled();
});

Then("I should see the {string} heading", async ({ page }, name: string) => {
  await expect(page.getByRole("heading", { name })).toBeVisible();
});

Then("I should see {string}", async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible();
});

Then("I should not see {string}", async ({ page }, text: string) => {
  await expect(page.getByText(text)).not.toBeVisible();
});
