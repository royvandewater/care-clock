/**
 * A Tri-Treat session has two therapist dropdowns, but the selection is stored
 * in the single comma-separated "With Who" field so downstream code keeps
 * treating it as one string (the same shape Co-Treat produces).
 */
export const combineWithWho = (first: string, second: string): string => [first, second].filter(Boolean).join(", ");

export const splitWithWho = (withWho: string): [string, string] => {
  const [first = "", second = ""] = withWho.split(", ");
  return [first, second];
};
