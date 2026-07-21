import assert from "node:assert/strict";
import { When, Then } from "@cucumber/cucumber";

import { parseSessionType, type SessionType } from "../../../web/data/sessionTypes.ts";
import { shouldClearWithWho } from "../../../web/data/shouldClearWithWho.ts";

interface SessionTypesWorld {
  parsed: SessionType;
  cleared: boolean;
}

When("I parse the session type {string}", function (this: SessionTypesWorld, sessionType: string) {
  this.parsed = parseSessionType(sessionType);
});

Then("the parsed session type should be {string}", function (this: SessionTypesWorld, expected: string) {
  assert.equal(this.parsed, expected);
});

When(
  "I check whether switching from {string} to {string} clears With Who",
  function (this: SessionTypesWorld, oldSessionType: string, newSessionType: string) {
    this.cleared = shouldClearWithWho(parseSessionType(oldSessionType), parseSessionType(newSessionType));
  },
);

Then("With Who should not be cleared", function (this: SessionTypesWorld) {
  assert.equal(this.cleared, false);
});
