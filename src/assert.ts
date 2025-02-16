export function assert(condition: any, message?: string | Error): asserts condition {
  if (condition) return;

  if (typeof message === "string") throw new Error(message);
  if (message instanceof Error) throw message;

  throw new Error("Assertion failed");
}
