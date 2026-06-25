import { z } from "zod";

export const Activity = z.object({
  id: z.uuid(),
  therapistName: z.string(),
  camperName: z.string(),
  sessionType: z.enum(["Individual", "Co-Treat", "Group", "Consult", "Training"]),
  groupName: z.string().nullish(),
  withWho: z.string().nullish(),
  description: z.string().max(25000),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime().nullish(),
});
