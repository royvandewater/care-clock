import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";

import { settleBatch, type BatchItemResult } from "../../../src/batch.ts";

let items: { id: string }[] = [];
let results: BatchItemResult[] = [];
let ran: string[] = [];

Given("a batch of items {string}", function (ids: string) {
  items = ids
    .split(",")
    .map((id) => id.trim())
    .map((id) => ({ id }));
  results = [];
  ran = [];
});

When("I settle the batch with a worker that always succeeds", async function () {
  results = await settleBatch(items, async (item) => {
    ran.push(item.id);
  });
});

When("I settle the batch with a worker that fails item {string}", async function (failId: string) {
  results = await settleBatch(items, async (item) => {
    ran.push(item.id);
    if (item.id === failId) {
      throw new Error(`boom:${failId}`);
    }
  });
});

Then("the results should be {string}", function (expected: string) {
  const actual = results.map((r) => `${r.id}:${r.status}`).join(",");
  assert.equal(actual, expected);
});

Then("the results should run in order {string}", function (expected: string) {
  assert.equal(ran.join(","), expected);
});

Then("item {string} should carry the message {string}", function (id: string, message: string) {
  const result = results.find((r) => r.id === id);
  assert.ok(result, `expected a result for item ${id}`);
  assert.equal(result.message, message);
});
