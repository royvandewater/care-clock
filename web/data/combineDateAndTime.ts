export const combineDateAndTime = (date: string, time: string) => {
  let d = new Date(`${date}T${time}`);

  if (isNaN(d.getTime())) return;
  return d;
};
