import { expect } from "@playwright/test";
import { Given, Then } from "./fixtures";

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

Then("I should see {string}", async ({ page }, text: string) => {
  await expect(page.getByText(text)).toBeVisible();
});

Then("I should not see {string}", async ({ page }, text: string) => {
  await expect(page.getByText(text)).not.toBeVisible();
});
