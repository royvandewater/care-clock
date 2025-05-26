import { upsertActivity, type MultiCamperActivity } from "@/data/upsertActivity";

export const startActivity = async ({ database }: { database: IDBDatabase }, activity: MultiCamperActivity) => {
  return await upsertActivity(
    { database },
    {
      ...activity,
      startTime: new Date(),
      endTime: null,
    },
  );
};
