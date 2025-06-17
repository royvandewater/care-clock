import { useSignal, useSignalEffect } from "@preact/signals";
import { parseSessionType, sessionTypes } from "@/data/sessionTypes";
import { useEffect } from "preact/hooks";
import type { MultiCamperActivity } from "@/data/upsertActivity";

/**
 * Manages the activity state and synchronizes it with the local storage. It handles
 * keeping the activity in sync with other tabs. It does not keep it in sync with other
 * instances of useActivity rendered in the same tab.
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

export const blankActivity: MultiCamperActivity = {
  therapistName: "",
  campers: [],
  groupName: "",
  withWho: "",
  sessionType: sessionTypes[0],
  syncState: "unsynced",
  description: "",
  startTime: null,
  endTime: null,
};

const parseLocalStorageActivity = (activityJSON: string | null): MultiCamperActivity => {
  if (!activityJSON) {
    return structuredClone(blankActivity);
  }

  const activity = JSON.parse(activityJSON);

  return {
    therapistName: activity.therapistName,
    campers: activity.campers ?? [],
    sessionType: parseSessionType(activity.sessionType),
    syncState: activity.syncState ?? "unsynced",
    groupName: activity.groupName,
    withWho: activity.withWho,
    description: activity.description,
    startTime: activity.startTime ? new Date(activity.startTime) : null,
    endTime: activity.endTime ? new Date(activity.endTime) : null,
  };
};

const formatActivityForLocalStorage = (activity: MultiCamperActivity) => {
  return JSON.stringify({
    therapistName: activity.therapistName,
    campers: activity.campers,
    sessionType: activity.sessionType,
    groupName: activity.groupName,
    withWho: activity.withWho,
    description: activity.description,
    syncState: activity.syncState,
    startTime: activity.startTime?.toISOString() ?? null,
    endTime: activity.endTime?.toISOString() ?? null,
  });
};
