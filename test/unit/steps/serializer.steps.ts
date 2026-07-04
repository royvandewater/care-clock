import assert from "node:assert/strict";
import { Given, When, Then, setWorldConstructor } from "@cucumber/cucumber";

import { Serializer } from "../../../src/serializer.ts";

const delay = (ms = 5): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

class SerializerWorld {
  serializer!: Serializer;
  log: string[] = [];
  errors: Record<string, unknown> = {};
}

setWorldConstructor(SerializerWorld);

Given("a serializer", function (this: SerializerWorld) {
  this.serializer = new Serializer();
});

When("I enqueue overlapping tasks {string}", async function (this: SerializerWorld, names: string) {
  const promises = names
    .split(",")
    .map((name) => name.trim())
    .map((name) =>
      this.serializer.run(async () => {
        this.log.push(`start:${name}`);
        await delay();
        this.log.push(`end:${name}`);
      }),
    );

  await Promise.allSettled(promises);
});

When(
  "I enqueue a failing task {string} then a task {string}",
  async function (this: SerializerWorld, failName: string, okName: string) {
    const failing = this.serializer.run(async () => {
      await delay();
      throw new Error(`boom:${failName}`);
    });
    failing.catch((error) => {
      this.errors[failName] = error;
    });

    const ok = this.serializer.run(async () => {
      this.log.push(`ran:${okName}`);
    });

    await Promise.allSettled([failing, ok]);
  },
);

Then("the event log should be {string}", function (this: SerializerWorld, expected: string) {
  assert.equal(this.log.join(","), expected);
});

Then("task {string} should have run", function (this: SerializerWorld, name: string) {
  assert.ok(this.log.includes(`ran:${name}`), `expected task ${name} to have run; log=[${this.log}]`);
});

Then("task {string} should have rejected", function (this: SerializerWorld, name: string) {
  assert.ok(this.errors[name] instanceof Error, `expected task ${name} to have rejected`);
});
