export const roundDateToHour = (date: Date) => {
  return new Date(Math.round(date.getTime() / 3600000) * 3600000);
};
