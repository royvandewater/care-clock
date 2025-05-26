import { upsertActivity } from "./upsertActivity.js";

/**
 * @typedef {import("./sessionTypes.js").sessionTypes} SessionType
 */

/**
 * @param {{database: IDBDatabase}} dependencies
 * @param {{therapistName: string; campers: {name: string, id: string}[]; groupName: string; description: string; sessionType: SessionType}} activity
 * @returns {Promise<void>}
 */
export const startActivity = async ({ database }, activity) => {
  return await upsertActivity(
    { database },
    {
      ...activity,
      startTime: new Date(),
      endTime: null,
    },
  );
};
