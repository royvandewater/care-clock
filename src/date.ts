import { parse, format, parseISO } from "date-fns";

const DATE_FORMAT = "MM/dd/yyyy hh:mm:ss aa";

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
 * @param duration - The duration in milliseconds
 * @returns a number that Google Sheets will interpret as the duration in days
 */
export const toDurationString = (duration: number) => {
  return duration / (1000 * 60 * 60 * 24);
};
