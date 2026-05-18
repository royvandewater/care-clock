export const therapists = ["Tori", "Valerie", "Stephanie"] as const;
export type Therapist = (typeof therapists)[number];
