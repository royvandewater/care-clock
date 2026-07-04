import { parse, format, parseISO } from "date-fns";

import { assert } from "./assert";

const DATE_FORMAT = "MM/dd/yyyy hh:mm:ss aa";
const SHEET_TIME_ZONE = "America/New_York";

const easternDateTimeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: SHEET_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

export const fromLocaleString = (dateString: string) => {
  return parse(dateString, DATE_FORMAT, new Date());
};

export const toLocaleString = (date: Date) => {
  return format(date, DATE_FORMAT);
};

export const fromISOString = (isoString: string) => {
  return parseISO(isoString);
};

/**
 * Formats a UTC ISO string as an Eastern-time wall-clock string for Google
 * Sheets. The browser sends times as UTC ISO strings and the server
 * (Cloudflare Workers) runs in UTC, so we convert the instant into
 * America/New_York (EDT/EST, DST-aware) before formatting.
 */
export const toEasternLocaleString = (isoString: string) => {
  const date = parseISO(isoString);
  assert(!isNaN(date.getTime()), `Expected an ISO date-time string, got: ${isoString}`);

  const parts: Record<string, string> = {};
  for (const part of easternDateTimeFormat.formatToParts(date)) {
    parts[part.type] = part.value;
  }

  return `${parts.month}/${parts.day}/${parts.year} ${parts.hour}:${parts.minute}:${parts.second} ${parts.dayPeriod}`;
};

/**
 * @param duration - The duration in milliseconds
 * @returns a number that Google Sheets will interpret as the duration in days
 */
export const toDurationString = (duration: number) => {
  return duration / (1000 * 60 * 60 * 24);
};
