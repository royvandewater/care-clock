import { z } from "zod";

export const syncStates = ["synced", "unsynced", "syncing"] as const;
export type SyncState = (typeof syncStates)[number];

export const parseSyncState = (syncState: string): SyncState => {
  const res = z.enum(syncStates).safeParse(syncState);
  if (res.success) {
    return res.data;
  }
  return "unsynced";
};
