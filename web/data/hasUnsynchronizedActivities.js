import { getUnsynchronizedActivities } from "./database.js";

/**
 * @param {{ database: IDBDatabase }} props
 */
export const hasUnsynchronizedActivities = async ({ database }) => {
  const activities = await getUnsynchronizedActivities(database);
  return activities.length > 0;
};
