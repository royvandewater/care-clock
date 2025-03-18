export const sessionTypes = /** @type {const} */ (["Individual", "Co-Treat", "Group", "Consult", "Training"]);

/**
 * @param {string} sessionType
 * @returns {sessionTypes[number]}
 */
export const parseSessionType = (sessionType) => {
  if (sessionTypes.includes(sessionType)) {
    return sessionType;
  }
  return sessionTypes[0];
};
