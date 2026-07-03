import { parse, format, parseISO } from "date-fns";

import { assert } from "./assert";

const DATE_FORMAT = "MM/dd/yyyy hh:mm:ss aa";
const ISO_LOCAL_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
const ISO_LOCAL_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

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
 * Formats the wall-clock date/time embedded in an ISO string (e.g. what the
 * browser sent, including its local UTC offset) without converting it
 * through the server's local timezone. The server (Cloudflare Workers) runs
 * in UTC, so round-tripping through `fromISOString`/`toLocaleString` would
 * shift the displayed time by the browser's UTC offset.
 */
export const toLocaleStringFromISOString = (isoString: string) => {
  const match = ISO_LOCAL_DATE_TIME_PATTERN.exec(isoString);
  assert(match, `Expected an ISO date-time string, got: ${isoString}`);

  return format(parse(match[0], ISO_LOCAL_DATE_TIME_FORMAT, new Date()), DATE_FORMAT);
};

/**
 * @param duration - The duration in milliseconds
 * @returns a number that Google Sheets will interpret as the duration in days
 */
export const toDurationString = (duration: number) => {
  return duration / (1000 * 60 * 60 * 24);
};
