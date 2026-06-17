export const therapists = [
  "Miss Amanda",
  "Miss Ashlea",
  "Miss Carolyn",
  "Miss Danielle",
  "Ms. Denise",
  "Miss Kaitie",
  "Miss Katie",
  "Miss Kourtney",
  "Mr. Marty",
  "Mr. Rob",
  "Mrs. Stephanie",
  "Miss Valerie",
] as const;
export type Therapist = (typeof therapists)[number];
