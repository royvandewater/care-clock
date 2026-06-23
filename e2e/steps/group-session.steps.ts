import { expect } from "@playwright/test";
import { When, Then } from "./fixtures";

const parseCampers = (list: string): string[] => list.split(",").map((name) => name.trim());

When(
  "I open the group session link for group {string} with campers {string}",
  async ({ page }, group: string, list: string) => {
    const query = [
      `group=${encodeURIComponent(group)}`,
      ...parseCampers(list).map((name) => `camper=${encodeURIComponent(name)}`),
    ].join("&");
    await page.goto(`/group-session?${query}`);
  },
);

When("I toggle the camper {string}", async ({ page }, name: string) => {
  await page.getByText(name, { exact: true }).click();
});

Then("the group name should be {string}", async ({ page }, value: string) => {
  await expect(page.getByLabel("Group")).toHaveValue(value);
});
