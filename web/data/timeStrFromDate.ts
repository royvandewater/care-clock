import { dateToLocalIsoString } from "./dateToLocalIsoString";

export const timeStrFromDate = (date: Date | null) => {
  date ??= new Date();

  return dateToLocalIsoString(date).slice(11, 19);
};
