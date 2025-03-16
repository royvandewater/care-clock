import { DateTime, Str, Uuid } from "chanfana";
import { z } from "zod";

export const Task = z.object({
  name: Str({ example: "lorem" }),
  slug: Str(),
  description: Str({ required: false }),
  completed: z.boolean().default(false),
  due_date: DateTime(),
});

export const Activity = z.object({
  id: Uuid(),
  rowNumber: z.number(),
  therapistName: Str(),
  camperName: Str(),
  description: Str(),
  startTime: DateTime(),
  endTime: DateTime().nullish(),
});
