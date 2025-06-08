import { type SessionType } from "@/data/sessionTypes";

export const shouldClearGroup = (oldSessionType: SessionType, newSessionType: SessionType) => {
  if (oldSessionType === newSessionType) return false;
  return oldSessionType === "Group";
};
