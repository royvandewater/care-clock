import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const fillActivity = async (page: Page, { description }: { description: string }) => {
  await page.goto("/");

  await page.getByLabel("Settings").click();
  await page.getByLabel("Therapist").selectOption("Tori");
  await page.getByLabel("Back").click();

  await page.getByLabel("Select Campers").click();
  await page.getByRole("button", { name: "Edit Campers" }).click();
  await page.getByLabel("Camper Name").fill("Alice");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByText("Alice").click();
  await page.getByRole("button", { name: "Back" }).click();

  await page.getByLabel("Select Session Type").click();
  await page.getByRole("button", { name: "Select Individual" }).click();

  await page.getByLabel("Description").fill(description);

  // Push the end out by an hour so the save proceeds without the
  // confirm-warning modal (see edit-activity.spec.ts for the rationale).
  const startDate = await page.getByLabel("Start Date").inputValue();
  const startTime = await page.getByLabel("Start Time").inputValue();
  const end = new Date(`${startDate}T${startTime}`);
  end.setHours(end.getHours() + 1);

  const pad = (n: number) => String(n).padStart(2, "0");
  await page.getByLabel("End Date").fill(`${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`);
  await page.getByLabel("End Time").fill(`${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`);
};

test("saving an activity shows a confirmation toast", async ({ page }) => {
  await fillActivity(page, { description: "A saved activity" });

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByRole("status")).toHaveText("Activity saved");
});
