import { z } from "zod";

export const sessionTypes = ["Individual", "Co-Treat", "Group", "Consult", "Training"] as const;
export type SessionType = (typeof sessionTypes)[number];

/**
 * @param {string} sessionType
 * @returns {sessionTypes[number]}
 */
export const parseSessionType = (sessionType: string): SessionType => {
  const res = z.enum(sessionTypes).safeParse(sessionType);
  if (res.success) {
    return res.data;
  }
  return sessionTypes[0];
};
