export const fromISOString = (isoString) => {
  if (!isoString) return null;
  return new Date(Date.parse(isoString));
};
