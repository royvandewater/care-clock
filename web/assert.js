/**
 * @param {any} condition
 * @param {Error | string | undefined} error
 * @returns {asserts condition}
 */
export const assert = (condition, error = new Error("Assertion failed")) => {
  if (condition) return;
  if (error instanceof Error) throw error;
  throw new Error(message);
};
