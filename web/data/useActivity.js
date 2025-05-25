import { useSignal, useSignalEffect, batch, useComputed } from "@preact/signals";
import { parseSessionType, sessionTypes } from "./sessionTypes.js";
import { useEffect } from "preact/hooks";

/**
 * Manages the activity state and synchronizes it with the local storage. It handles
 * keeping the activity in sync with other tabs. It does not keep it in sync with other
 * instances of useActivity rendered in the same tab.
 *
 * @returns {Signal<{
 *   therapistName: string,
 *   campers: {name: string, id: string | null}[],
 *   groupName: string,
 *   withWho: string,
 *   description: string,
 *   startTime: Date | null,
 *   endTime: Date | null,
 * }>}
 */
export const useActivity = () => {
  const activity = useSignal(parseLocalStorageActivity(window.localStorage.getItem("activity")));

  useSignalEffect(() => window.localStorage.setItem("activity", formatActivityForLocalStorage(activity.value)));

  useEffect(() => {
    const updateActivity = (event) => {
      if (event.key !== "activity") return;
      activity.value = parseLocalStorageActivity(event.newValue);
    };

    window.addEventListener("storage", updateActivity);
    return () => {
      window.removeEventListener("storage", updateActivity);
    };
  }, []);

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
