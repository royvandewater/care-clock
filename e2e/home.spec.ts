import { test, expect } from "@playwright/test";

test("that the page loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Care Clock/);
});

test("Filling out the form for a group session", async ({ page }) => {
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
});

test("Filling out the form for a co-treat session", async ({ page }) => {
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
  await page.getByLabel("Select Co-Treat").click();

  await page.getByLabel("With Who").fill("Bob");
  await page.getByLabel("Description").fill("Running automated tests");
});

test("Filling out the form for an individual session", async ({ page }) => {
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
  await page.getByRole("button", { name: "Select Individual" }).click();

  await page.getByLabel("Description").fill("Running automated tests");
  // it should not show a with who or group name field
  await expect(page.getByLabel("Group")).not.toBeAttached();
  await expect(page.getByLabel("With Who")).not.toBeAttached();
});
