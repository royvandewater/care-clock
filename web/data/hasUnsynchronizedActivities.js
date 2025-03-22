import { getUnsyncedActivities } from "./database.js";

/**
 * @param {{ database: IDBDatabase }} props
 */
export const hasUnsynchronizedActivities = async ({ database }) => {
  const activities = await getUnsyncedActivities(database);
  return activities.length > 0;
};
