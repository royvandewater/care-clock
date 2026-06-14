import { expect } from "@playwright/test";
import { When, Then } from "./fixtures";

// The default start/end are both rounded down to the current hour, which trips
// the "less than 1 minute" warning. Pushing the end out by an hour lets the
// save proceed without the confirm-warning modal. The end is derived from a
// real Date so the hour rolls the date forward correctly: at 23:00 a naive
// `(hours + 1) % 24` would produce a same-day 00:00, landing *before* the
// start and tripping the "End date/time is before start date/time" warning.
When("I set the end time to one hour after the start time", async ({ page }) => {
  const startDate = await page.getByLabel("Start Date").inputValue();
  const startTime = await page.getByLabel("Start Time").inputValue();
  const end = new Date(`${startDate}T${startTime}`);
  end.setHours(end.getHours() + 1);

  const pad = (n: number) => String(n).padStart(2, "0");
  await page.getByLabel("End Date").fill(`${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`);
  await page.getByLabel("End Time").fill(`${pad(end.getHours())}:${pad(end.getMinutes())}:${pad(end.getSeconds())}`);
});

Then("the {string} field should have value {string}", async ({ page }, label: string, value: string) => {
  await expect(page.getByLabel(label)).toHaveValue(value);
});

Then("the status message should be {string}", async ({ page }, message: string) => {
  await expect(page.getByRole("status")).toHaveText(message);
});
