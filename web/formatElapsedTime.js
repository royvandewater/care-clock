/**
 * @param {Date | null} endTime
 * @param {Date | null} startTime
 * @returns {String}
 */
export const formatElapsedTime = (endTime, startTime) => {
  if (!endTime || !startTime) return "00:00:00";

  const elapsedTime = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60))
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
