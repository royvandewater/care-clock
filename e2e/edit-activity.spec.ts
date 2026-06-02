import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const createActivity = async (page: Page, { description }: { description: string }) => {
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

  // Default start/end are both rounded down to the current hour, which trips
  // the "less than 1 minute" warning. Push end out by an hour so save proceeds
  // without the confirm-warning modal. Derive the end from a real Date so the
  // hour rolls the date forward correctly: at 23:00 the old `(hours + 1) % 24`
  // produced a same-day 00:00, which lands *before* the start and triggers the
  // "End date/time is before start date/time" warning instead.
  const startDate = await page.getByLabel("Start Date").inputValue();
  const startTime = await page.getByLabel("Start Time").inputValue();
  const end = new Date(`${startDate}T${startTime}`);
  end.setHours(end.getHours() + 1);

  const pad = (n: number) => String(n).padStart(2, "0");
  await page.getByLabel("End Date").fill(`${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`);
  await page.getByLabel("End Time").fill(`${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`);

  await page.getByRole("button", { name: "Save" }).click();
};

test("editing an activity persists the new description", async ({ page }) => {
  await createActivity(page, { description: "Initial description" });

  await page.getByLabel("History").click();
  await page.getByText("Alice").click();

  await expect(page.getByLabel("Description")).toHaveValue("Initial description");
  await page.getByLabel("Description").fill("Updated description");
  await page.getByRole("button", { name: "Save" }).click();

  // Back in the History modal — reopen the activity and verify the new value
  await page.getByText("Alice").click();
  await expect(page.getByLabel("Description")).toHaveValue("Updated description");
});

test("deleting an activity removes it from history", async ({ page }) => {
  // The real backend isn't reachable from the test environment, so the DELETE
  // request would 403 and deleteActivity would refuse to remove the local
  // record. Stub it to succeed so we can exercise the UI flow.
  await page.route("**/activities/*", async (route) => {
    if (route.request().method() === "DELETE") {
      await route.fulfill({ status: 204 });
      return;
    }
    await route.continue();
  });

  await createActivity(page, { description: "To be deleted" });

  await page.getByLabel("History").click();
  await expect(page.getByText("Alice")).toBeVisible();

  await page.getByText("Alice").click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(page.getByText("Alice")).not.toBeVisible();
  await expect(page.getByText("All activities are uploaded.")).toBeVisible();
});
