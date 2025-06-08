import type { SessionType } from "@/data/sessionTypes";

export const shouldClearWithWho = (oldSessionType: SessionType, newSessionType: SessionType) => {
  if (oldSessionType === newSessionType) return false;
  if (newSessionType === "Individual") return true;
  if (newSessionType === "Group") return true;
  return false;
};
