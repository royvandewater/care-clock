import { upsertActivity } from "./upsertActivity.js";

/**
 * @typedef {import("./sessionTypes.js").sessionTypes} SessionType
 */

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{therapistName: string; camperName: string; groupName: string; description: string; sessionType: SessionType}} activity
 * @returns {Promise<void>}
 */
export const startActivity = async ({ database }, activity) => {
  activity = {
    ...activity,
    id: self.crypto.randomUUID(),
    startTime: new Date(),
    endTime: null,
  };

  // intentionally not awaited so that the function is not blocked on the network request
  upsertActivity({ database }, activity);

  return activity;
};
