import { dateToLocalIsoString } from "./dateToLocalIsoString";

export const dateStrFromDate = (date: Date | null) => {
  date ??= new Date();

  return dateToLocalIsoString(date).slice(0, 10);
};
