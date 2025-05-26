import { parseSessionType, type SessionType } from "@/data/sessionTypes";

export interface Activity {
  id: string;
  therapistName: string;
  camperName: string;
  sessionType: SessionType;
  groupName: string;
  withWho: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
  syncState: string;
}

export interface SerializableActivity {
  id: string;
  therapistName: string;
  camperName: string;
  sessionType: string;
  groupName: string;
  withWho: string;
  description: string;
  startTime: string | null;
  endTime: string | null;
  syncState: string;
}

export const formatActivity = (activity: Activity): SerializableActivity => {
  return {
    id: activity.id,
    therapistName: activity.therapistName,
    camperName: activity.camperName,
    sessionType: activity.sessionType,
    groupName: activity.groupName,
    withWho: activity.withWho,
    description: activity.description || "",
    startTime: activity.startTime?.toISOString() ?? null,
    endTime: activity.endTime?.toISOString() ?? null,
    syncState: activity.syncState,
  };
};

export const parseActivity = (activity: SerializableActivity): Activity => {
  return {
    id: activity.id,
    therapistName: activity.therapistName,
    camperName: activity.camperName,
    sessionType: parseSessionType(activity.sessionType),
    groupName: activity.groupName,
    withWho: activity.withWho,
    description: activity.description || "",
    startTime: activity.startTime ? new Date(activity.startTime) : null,
    endTime: activity.endTime ? new Date(activity.endTime) : null,
    syncState: activity.syncState,
  };
};
