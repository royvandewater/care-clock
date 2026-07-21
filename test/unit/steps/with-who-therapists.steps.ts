import assert from "node:assert/strict";
import { When, Then } from "@cucumber/cucumber";

import { combineWithWho, splitWithWho } from "../../../web/data/withWhoTherapists.ts";

let combined = "";
let first = "";
let second = "";

When("I combine the therapists {string} and {string}", function (firstName: string, secondName: string) {
  combined = combineWithWho(firstName, secondName);
});

When("I split the {string} value {string}", function (_field: string, value: string) {
  [first, second] = splitWithWho(value);
});

Then("the combined value should be {string}", function (expected: string) {
  assert.equal(combined, expected);
});

Then("the first therapist should be {string}", function (expected: string) {
  assert.equal(first, expected);
});

Then("the second therapist should be {string}", function (expected: string) {
  assert.equal(second, expected);
});
