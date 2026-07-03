import { DurableObject } from "cloudflare:workers";
import type { z } from "zod";

import { Activity } from "./types";
import { fromISOString, toDurationString, toLocaleString } from "./date";
import { getSheetFromEnv } from "./sheets";

type ActivityInput = Omit<z.infer<typeof Activity>, "id">;

/**
 * Serializes all reads/writes against the Google Sheet through a single Durable Object
 * instance, so concurrent upserts/deletes (e.g. from multi-camper group activities) can't
 * race each other and clobber rows.
 */
export class ActivityQueueDO extends DurableObject<Env> {
  private queue: Promise<unknown> = Promise.resolve();

  async upsertActivity(id: string, activity: ActivityInput): Promise<void> {
    return this.enqueue(() => this.doUpsertActivity(id, activity));
  }

  async deleteActivity(id: string): Promise<void> {
    return this.enqueue(() => this.doDeleteActivity(id));
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task, task);
    this.queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private async doUpsertActivity(id: string, activity: ActivityInput): Promise<void> {
    const sheet = await getSheetFromEnv(this.env as unknown as Record<string, string>);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("Id") === id);
    if (!row) {
      const newRow: Record<string, string | number> = {
        Therapist: activity.therapistName.trim(),
        Camper: activity.camperName.trim(),
        Type: activity.sessionType,
        Description: activity.description.trim(),
        Start: toLocaleString(fromISOString(activity.startTime)),
        Id: id,
      };

      if (activity.endTime) {
        newRow.End = toLocaleString(fromISOString(activity.endTime));
        newRow.Duration = getDuration(activity.startTime, activity.endTime);
      }

      if (activity.groupName) {
        newRow.Group = activity.groupName;
      }

      if (activity.withWho) {
        newRow["With Who"] = activity.withWho.trim();
      }

      await sheet.addRow(newRow);
      return;
    }

    row.set("Therapist", activity.therapistName.trim());
    row.set("Camper", activity.camperName.trim());
    row.set("Type", activity.sessionType);
    row.set("Group", activity.groupName || null);
    row.set("With Who", activity.withWho?.trim() || null);
    row.set("Description", activity.description.trim());
    row.set("Start", toLocaleString(fromISOString(activity.startTime)));
    row.set("End", activity.endTime ? toLocaleString(fromISOString(activity.endTime)) : null);
    row.set("Duration", activity.endTime ? getDuration(activity.startTime, activity.endTime) : null);
    await row.save();
  }

  private async doDeleteActivity(id: string): Promise<void> {
    const sheet = await getSheetFromEnv(this.env as unknown as Record<string, string>);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    const row = rows.find((r) => r.get("Id") === id);
    if (row) {
      await sheet.clearRows({ start: row.rowNumber, end: row.rowNumber });
    }
  }
}

const getDuration = (startTime: string, endTime: string) => {
  const startTimeDate = fromISOString(startTime);
  const endTimeDate = fromISOString(endTime);
  const duration = endTimeDate.getTime() - startTimeDate.getTime();
  return toDurationString(duration);
};
