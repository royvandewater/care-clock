import { DurableObject } from "cloudflare:workers";
import type { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import type { z } from "zod";

import { Activity } from "./types";
import { settleBatch, type BatchItemResult } from "./batch";
import { fromISOString, toDurationString, toEasternLocaleString, toRoundedMinutes } from "./date";
import { getSheetFromEnv } from "./sheets";
import { Serializer } from "./serializer";

type ActivityInput = Omit<z.infer<typeof Activity>, "id">;
type ActivityWithId = z.infer<typeof Activity>;

/**
 * Serializes all reads/writes against the Google Sheet through a single Durable Object
 * instance, so concurrent upserts/deletes (e.g. from multi-camper group activities) can't
 * race each other and clobber rows.
 */
export class ActivityQueueDO extends DurableObject<Env> {
  private serializer = new Serializer();

  async upsertActivity(id: string, activity: ActivityInput): Promise<void> {
    return this.serializer.run(() => this.doUpsertActivity(id, activity));
  }

  async upsertActivities(activities: ActivityWithId[]): Promise<BatchItemResult[]> {
    return this.serializer.run(() => this.doUpsertActivities(activities));
  }

  async deleteActivity(id: string): Promise<void> {
    return this.serializer.run(() => this.doDeleteActivity(id));
  }

  private async doUpsertActivity(id: string, activity: ActivityInput): Promise<void> {
    const sheet = await getSheetFromEnv(this.env as unknown as Record<string, string>);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    await this.applyActivity(sheet, rows, id, activity);
  }

  private async doUpsertActivities(activities: ActivityWithId[]): Promise<BatchItemResult[]> {
    const sheet = await getSheetFromEnv(this.env as unknown as Record<string, string>);
    await sheet.loadHeaderRow();

    const rows = await sheet.getRows();
    return settleBatch(activities, ({ id, ...activity }) => this.applyActivity(sheet, rows, id, activity));
  }

  private async applyActivity(
    sheet: GoogleSpreadsheetWorksheet,
    rows: GoogleSpreadsheetRow[],
    id: string,
    activity: ActivityInput,
  ): Promise<void> {
    const row = rows.find((r) => r.get("Id") === id);
    if (!row) {
      const newRow: Record<string, string | number> = {
        Therapist: activity.therapistName.trim(),
        Camper: activity.camperName.trim(),
        Type: activity.sessionType,
        Description: activity.description.trim(),
        Start: toEasternLocaleString(activity.startTime),
        Id: id,
      };

      if (activity.endTime) {
        newRow.End = toEasternLocaleString(activity.endTime);
        newRow.Duration = getDuration(activity.startTime, activity.endTime);
        newRow.Minutes = getMinutes(activity.startTime, activity.endTime);
      }

      if (activity.groupName) {
        newRow.Group = activity.groupName;
      }

      if (activity.withWho) {
        newRow["With Who"] = activity.withWho.trim();
      }

      const addedRow = await sheet.addRow(newRow);
      rows.push(addedRow);
      return;
    }

    row.set("Therapist", activity.therapistName.trim());
    row.set("Camper", activity.camperName.trim());
    row.set("Type", activity.sessionType);
    row.set("Group", activity.groupName || null);
    row.set("With Who", activity.withWho?.trim() || null);
    row.set("Description", activity.description.trim());
    row.set("Start", toEasternLocaleString(activity.startTime));
    row.set("End", activity.endTime ? toEasternLocaleString(activity.endTime) : null);
    row.set("Duration", activity.endTime ? getDuration(activity.startTime, activity.endTime) : null);
    row.set("Minutes", activity.endTime ? getMinutes(activity.startTime, activity.endTime) : null);
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

const getMinutes = (startTime: string, endTime: string) => {
  const startTimeDate = fromISOString(startTime);
  const endTimeDate = fromISOString(endTime);
  const duration = endTimeDate.getTime() - startTimeDate.getTime();
  return toRoundedMinutes(duration);
};
