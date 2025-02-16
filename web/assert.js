/**
 * @param {any} condition
 * @param {Error | string | undefined} error
 * @returns {asserts condition}
 */
export const assert = (condition, error = new Error("Assertion failed")) => {
  if (condition) return;
  if (typeof error === "string") throw new Error(error);
  if (error instanceof Error) throw error;
  throw new Error("Assertion failed");
};
