const unsortedTherapists = [
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
export type Therapist = (typeof unsortedTherapists)[number];

const nameWithoutHonorific = (therapist: Therapist): string => therapist.replace(/^\S+\s+/, "");

export const therapists: readonly Therapist[] = [...unsortedTherapists].sort((a, b) =>
  nameWithoutHonorific(a).localeCompare(nameWithoutHonorific(b)),
);
