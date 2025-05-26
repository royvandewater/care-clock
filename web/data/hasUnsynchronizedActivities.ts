import { getUnsyncedActivities } from "@/data/database";

export const hasUnsynchronizedActivities = async ({ database }: { database: IDBDatabase }) => {
  const activities = await getUnsyncedActivities(database);
  return activities.length > 0;
};
