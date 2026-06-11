import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

test("the dev script is aliased to start", async () => {
  const packageJsonUrl = new URL("../package.json", import.meta.url);
  const packageJson = JSON.parse(await readFile(fileURLToPath(packageJsonUrl), "utf8"));

  expect(packageJson.scripts.dev).toBe(packageJson.scripts.start);
});
