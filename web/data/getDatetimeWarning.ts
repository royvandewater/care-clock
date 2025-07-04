export const getDatetimeWarning = (start: Date | null, end: Date | null) => {
  if (!start) return;

  const now = new Date();

  if (start > now) {
    return "Start date/time is in the future";
  }

  if (!end) return;

  if (end < start) {
    return "End date/time is before start date/time";
  }

  if (end.getTime() - start.getTime() < 1000 * 60) {
    return "Activity duration is less than 1 minute";
  }

  if (end.getTime() - start.getTime() > 1000 * 60 * 60 * 10) {
    return "Activity is longer than 10 hours";
  }

  return;
};
