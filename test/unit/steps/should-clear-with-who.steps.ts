import assert from "node:assert/strict";
import { When, Then } from "@cucumber/cucumber";

import { shouldClearWithWho } from "../../../web/data/shouldClearWithWho.ts";
import type { SessionType } from "../../../web/data/sessionTypes.ts";

let cleared = false;

When(
  "I change the session type from {string} to {string}",
  function (oldType: string, newType: string) {
    cleared = shouldClearWithWho(oldType as SessionType, newType as SessionType);
  },
);

Then("{string} should be cleared", function (_field: string) {
  assert.equal(cleared, true);
});

Then("{string} should not be cleared", function (_field: string) {
  assert.equal(cleared, false);
});
