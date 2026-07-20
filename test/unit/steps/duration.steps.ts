import assert from "node:assert/strict";
import { Given, When, Then, setWorldConstructor } from "@cucumber/cucumber";

import { toRoundedMinutes } from "../../../src/date.ts";

class DurationWorld {
  ms!: number;
  result!: number;
}

setWorldConstructor(DurationWorld);

Given("a duration of {int} milliseconds", function (this: DurationWorld, ms: number) {
  this.ms = ms;
});

When("I convert it to rounded minutes", function (this: DurationWorld) {
  this.result = toRoundedMinutes(this.ms);
});

Then("the result should be {int}", function (this: DurationWorld, expected: number) {
  assert.equal(this.result, expected);
});
