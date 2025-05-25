import { useSignal, useSignalEffect, batch, useComputed } from "@preact/signals";
import { parseSessionType, sessionTypes } from "./sessionTypes.js";

export const useLocalStorageActivity = () => {
  const activity = useSignal(parseLocalStorageActivity(window.localStorage.getItem("activity")));

  useSignalEffect(() => window.localStorage.setItem("activity", formatActivityForLocalStorage(activity.value)));

  return activity;
};

/**
 * @param {string | null} activityJSON
 * @returns {{
 *   therapistName: string,
 *   campers: {name: string, id: string | null}[],
 *   groupName: string,
 *   withWho: string,
 *   description: string,
 *   startTime: Date | null,
 *   endTime: Date | null,
 * }}
 */
const parseLocalStorageActivity = (activityJSON) => {
  if (!activityJSON) {
    return {
      therapistName: "",
      campers: [],
      groupName: "",
      withWho: "",
      sessionType: sessionTypes[0],
      description: "",
      startTime: null,
      endTime: null,
    };
  }

  const activity = JSON.parse(activityJSON);

  return {
    therapistName: activity.therapistName,
    campers: activity.campers ?? [],
    sessionType: parseSessionType(activity.sessionType),
    groupName: activity.groupName,
    withWho: activity.withWho,
    description: activity.description,
    startTime: activity.startTime ? new Date(activity.startTime) : null,
    endTime: activity.endTime ? new Date(activity.endTime) : null,
  };
};

/**
 * @param {{
 *   therapistName: string,
 *   campers: {name: string, id: string | null}[],
 *   sessionType: string,
 *   groupName: string,
 *   withWho: string,
 *   description: string,
 *   startTime: Date | null,
 *   endTime: Date | null,
 * }} activity
 */
const formatActivityForLocalStorage = (activity) => {
  return JSON.stringify({
    therapistName: activity.therapistName,
    campers: activity.campers,
    sessionType: activity.sessionType,
    groupName: activity.groupName,
    withWho: activity.withWho,
    description: activity.description,
    startTime: activity.startTime?.toISOString() ?? null,
    endTime: activity.endTime?.toISOString() ?? null,
  });
};
