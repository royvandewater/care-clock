import { test, expect } from "@playwright/test";

test("that the page loads", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Care Clock/);
});

test("hides the duration warning until a date/time field is interacted with", async ({ page }) => {
  await page.goto("/");

  // The default start/end are both the current hour, a zero-length duration —
  // but the warning should stay hidden until the user touches a field.
  await expect(page.getByText("Activity duration is less than 1 minute")).not.toBeVisible();

  // Re-entering the start time as the end time keeps the zero-length duration,
  // now surfacing the warning because a field was interacted with.
  const startTime = await page.getByLabel("Start Time").inputValue();
  await page.getByLabel("End Time").fill(startTime);

  await expect(page.getByText("Activity duration is less than 1 minute")).toBeVisible();
});

test("hides the duration warning again after saving", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Settings").click();
  await page.getByLabel("Therapist").selectOption("Tori");
  await page.getByLabel("Back").click();

  await page.getByLabel("Select Campers").click();
  await page.getByRole("button", { name: "Edit Campers" }).click();
  await page.getByLabel("Camper Name").fill("Alice");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Back" }).click(); // back to campers modal
  await page.getByText("Alice").click();
  await page.getByRole("button", { name: "Back" }).click(); // back to home

  const startTime = await page.getByLabel("Start Time").inputValue();
  await page.getByLabel("End Time").fill(startTime);
  await expect(page.getByText("Activity duration is less than 1 minute")).toBeVisible();

  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Save anyway" }).click();

  // The form resets after saving, so the warning is hidden until the next interaction.
  await expect(page.getByText("Activity duration is less than 1 minute")).not.toBeVisible();
});

test("Filling out the form for a group session", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Settings").click();
  await page.getByLabel("Therapist").selectOption("Tori");
  await page.getByLabel("Back").click();

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

  await page.getByLabel("Settings").click();
  await page.getByLabel("Therapist").selectOption("Tori");
  await page.getByLabel("Back").click();

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

  await page.getByLabel("With Who").selectOption("Valerie");
  await page.getByLabel("Description").fill("Running automated tests");
});

test("Filling out the form for an individual session", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Settings").click();
  await page.getByLabel("Therapist").selectOption("Tori");
  await page.getByLabel("Back").click();

  // select a camper
  await page.getByLabel("Select Campers").click();
  await page.getByRole("button", { name: "Edit Campers" }).click();
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
