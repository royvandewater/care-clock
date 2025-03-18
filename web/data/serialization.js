/**
 * @param {{id: string; therapistName: string; camperName: string; groupName: string; description: string; startTime: Date | null; endTime: Date | null; syncState: string; rowNumber: number}} activity
 * @returns {{id: string; therapistName: string; camperName: string; groupName: string; description: string; startTime: string | null; endTime: string | null; syncState: string; rowNumber: number}}
 */
export const formatActivity = (activity) => {
  return {
    id: activity.id,
    therapistName: activity.therapistName,
    camperName: activity.camperName,
    groupName: activity.groupName,
    description: activity.description,
    startTime: activity.startTime?.toISOString() ?? null,
    endTime: activity.endTime?.toISOString() ?? null,
    syncState: activity.syncState,
    rowNumber: activity.rowNumber,
  };
};

/**
 * @param {{id: string; therapistName: string; camperName: string; groupName: string; description: string; startTime: string | null; endTime: string | null; syncState: string; rowNumber: number}} activity
 * @returns {{id: string; therapistName: string; camperName: string; groupName: string; description: string; startTime: Date | null; endTime: Date | null; syncState: string; rowNumber: number}}
 */
export const parseActivity = (activity) => {
  return {
    id: activity.id,
    therapistName: activity.therapistName,
    camperName: activity.camperName,
    groupName: activity.groupName,
    description: activity.description,
    startTime: activity.startTime ? new Date(activity.startTime) : null,
    endTime: activity.endTime ? new Date(activity.endTime) : null,
    syncState: activity.syncState,
    rowNumber: activity.rowNumber,
  };
};
