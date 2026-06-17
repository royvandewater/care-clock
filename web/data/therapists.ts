export const therapists = [
  "Miss Amanda",
  "Miss Ashlea",
  "Miss Carolyn",
  "Miss Danielle",
  "Miss Kaitie",
  "Miss Katie",
  "Miss Kourtney",
  "Miss Valerie",
  "Mr. Marty",
  "Mr. Rob",
  "Mrs. Stephanie",
  "Ms. Denise",
] as const;
export type Therapist = (typeof therapists)[number];
