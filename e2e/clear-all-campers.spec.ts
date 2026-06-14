import { test, expect } from "@playwright/test";

const openEditCampers = async (page) => {
  await page.goto("/");
  await page.getByLabel("Select Campers").click();
  await page.getByRole("button", { name: "Edit Campers" }).click();
};

const addCamper = async (page, name: string) => {
  await page.getByLabel("Camper Name").fill(name);
  await page.getByRole("button", { name: "Add" }).click();
};

test("the Clear All Campers button is hidden until edit mode", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Select Campers").click();

  await expect(page.getByRole("button", { name: "Clear All Campers" })).not.toBeVisible();
});

test("the Clear All Campers button is disabled when there are no campers", async ({ page }) => {
  await openEditCampers(page);

  await expect(page.getByRole("button", { name: "Clear All Campers" })).toBeDisabled();
});

test("the Clear All Campers button is enabled when there are campers", async ({ page }) => {
  await openEditCampers(page);
  await addCamper(page, "Alice");

  await expect(page.getByRole("button", { name: "Clear All Campers" })).toBeEnabled();
});

test("clicking Clear All Campers asks for confirmation before clearing", async ({ page }) => {
  await openEditCampers(page);
  await addCamper(page, "Alice");
  await addCamper(page, "Bob");

  await page.getByRole("button", { name: "Clear All Campers" }).click();

  // confirmation dialog appears; cancelling leaves the campers untouched
  await expect(page.getByRole("heading", { name: "Clear All Campers" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("Alice")).toBeVisible();

  await page.getByRole("button", { name: "Clear All Campers" }).click();
  await page.getByRole("button", { name: "Clear", exact: true }).click();

  await expect(page.getByText("Use the edit button on the top right to add a camper")).toBeVisible();

  await expect
    .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("campers") ?? "[]")))
    .toEqual([]);
});
