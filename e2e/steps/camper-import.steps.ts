import { expect } from "@playwright/test";
import { Given, When, Then } from "./fixtures";

const parseCampers = (list: string): string[] => list.split(",").map((name) => name.trim());

When("I open the camper import page for campers {string}", async ({ page }, list: string) => {
  const query = parseCampers(list)
    .map((name) => `camper=${encodeURIComponent(name)}`)
    .join("&");
  await page.goto(`/camper-import?${query}`);
});

Given("the stored campers are {string}", async ({ page }, list: string) => {
  await page.evaluate((campers) => localStorage.setItem("campers", JSON.stringify(campers)), parseCampers(list));
});

Then("the stored campers should be {string}", async ({ page }, list: string) => {
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("campers") ?? "[]")))
    .toEqual(parseCampers(list));
});

Then("the stored campers should be empty", async ({ page }) => {
  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("campers") ?? "[]")))
    .toEqual([]);
});
