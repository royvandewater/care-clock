import { test, expect } from "@playwright/test";

test("lists the campers from the query params", async ({ page }) => {
  await page.goto("/camper-import?camper=Fred+W.&camper=Bob+F.");

  await expect(page.getByText("Fred W.")).toBeVisible();
  await expect(page.getByText("Bob F.")).toBeVisible();
});

test("confirming stores the campers and returns home", async ({ page }) => {
  await page.goto("/camper-import?camper=Fred+W.&camper=Bob+F.");

  await page.getByRole("button", { name: "Confirm" }).click();

  // back on the home page
  await expect(page.getByRole("heading", { name: "Care Clock" })).toBeVisible();

  // the imported campers are now available to select
  await page.getByLabel("Select Campers").click();
  await expect(page.getByText("Fred W.")).toBeVisible();
  await expect(page.getByText("Bob F.")).toBeVisible();
});

test("confirming merges with existing campers without duplicating", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("campers", JSON.stringify(["Bob F.", "Zoe Q."])));

  await page.goto("/camper-import?camper=Fred+W.&camper=Bob+F.");
  await page.getByRole("button", { name: "Confirm" }).click();

  const campers = await page.evaluate(() => JSON.parse(localStorage.getItem("campers") ?? "[]"));
  expect(campers).toEqual(["Bob F.", "Fred W.", "Zoe Q."]);
});

test("cancelling discards the campers and returns home", async ({ page }) => {
  await page.goto("/camper-import?camper=Fred+W.&camper=Bob+F.");

  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(page.getByRole("heading", { name: "Care Clock" })).toBeVisible();

  const campers = await page.evaluate(() => JSON.parse(localStorage.getItem("campers") ?? "[]"));
  expect(campers).toEqual([]);
});
