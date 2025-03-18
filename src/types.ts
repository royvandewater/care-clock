import { DateTime, Str, Uuid } from "chanfana";
import { z } from "zod";

export const Activity = z.object({
  id: Uuid(),
  therapistName: Str(),
  camperName: Str(),
  groupName: Str().nullish(),
  description: Str(),
  startTime: DateTime(),
  endTime: DateTime().nullish(),
});
