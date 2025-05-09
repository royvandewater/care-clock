import { test, expect } from "@playwright/test";

test("that the page loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Care Clock/);
});

test("starting an activity", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Therapist").fill("Integration Test");

  // select a camper
  await page.getByLabel("Select Campers").click();
  await page.getByLabel("Edit Campers").click();
  await page.getByLabel("Camper Name").fill("Alice");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Back" }).click(); // back to campers modal
  await page.getByText("Alice").click();
  await page.getByRole("button", { name: "Back" }).click(); // back to home

  // select a session type
  await page.getByText("Session Type").click();
  await page.getByLabel("Select Group").click();

  await page.getByLabel("Group").fill("Automated Tests");
  await page.getByLabel("Description").fill("Running automated tests");

  // await page.getByLabel("Start Timer").click();
  // await page.getByLabel("Stop Timer").click();
});
