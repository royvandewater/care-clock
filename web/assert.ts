export function assert(condition: unknown, error: Error | string | undefined = new Error("Assertion failed")): asserts condition {
  if (condition) return;
  if (typeof error === "string") throw new Error(error);
  if (error instanceof Error) throw error;
  throw new Error("Assertion failed");
}
