import type { Activity } from "./serialization.js";
import { upsertActivity } from "./upsertActivity.js";

interface MultiCamperActivity extends Omit<Activity, "camperName" | "id"> {
  campers: { name: string; id: string }[];
}

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
