import { DateTime, Enumeration, Str, Uuid } from "chanfana";
import { z } from "zod";

export const Activity = z.object({
  id: Uuid(),
  therapistName: Str(),
  camperName: Str(),
  sessionType: Enumeration({ values: ["Individual", "Co-Treat", "Group", "Consult", "Training"] }),
  groupName: Str().nullish(),
  description: Str(),
  startTime: DateTime(),
  endTime: DateTime().nullish(),
});
