import { html } from "htm/preact";
import { useSignal, useSignalEffect, batch, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label, LabelLike } from "./components/Label.js";
import { TextArea } from "./components/TextArea.js";
import { HistoryButton } from "./components/HistoryButton.js";
import { HistoryModal } from "./components/HistoryModal.js";
import { CamperModal } from "./components/CampersModal.js";
import { SessionTypeModal } from "./components/SessionTypeModal.js";

import { sessionTypes, parseSessionType } from "./data/sessionTypes.js";
import { startActivity } from "./data/startActivity.js";
import { upsertActivity } from "./data/upsertActivity.js";
import { hasUnsynchronizedActivities } from "./data/hasUnsynchronizedActivities.js";

import { formatElapsedTime } from "./formatElapsedTime.js";
import { cn } from "./cn.js";

/**
 * @param {{database: IDBDatabase}} props
 */
export const App = ({ database }) => {
  const activity = useSignal(parseLocalStorageActivity(window.localStorage.getItem("activity")));
  const isRunning = Boolean(activity.value.startTime);

  const showCamperModal = useSignal(false);
  const showSessionTypeModal = useSignal(false);
  const showHistoryModal = useSignal(false);
  const hasNotifications = useSignal(false);

  useSignalEffect(() => window.localStorage.setItem("activity", formatActivityForLocalStorage(activity.value)));

  useEffect(() => {
    const interval = setInterval(() => (activity.value = { ...activity.value, endTime: new Date() }), 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = async () => {
    activity.value = await startActivity({ database }, activity.value);
  };

  const stopTimer = async () => {
    await upsertActivity({ database }, activity.value);

    activity.value = {
      ...activity.value,
      id: null,
      startTime: null,
    };
  };

  useEffect(async () => {
    const updateHasNotifications = async () => {
      hasNotifications.value = await hasUnsynchronizedActivities({ database });
    };
    updateHasNotifications();

    database.addEventListener("activities:changed", updateHasNotifications);
    return () => database.removeEventListener("activities:changed", updateHasNotifications);
  }, [database]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (isRunning) return stopTimer();
    startTimer();
  };

  return html`
    <form class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0" onSubmit=${onSubmit}>
      <header class="text-center relative">
        <h1 class="text-2xl font-bold text-primary">Care Clock</h1>
        <${HistoryButton} class="absolute top-0 right-4" hasNotifications=${hasNotifications} onClick=${() => (showHistoryModal.value = true)}/>
      </header>

      ${showHistoryModal.value && html`<${HistoryModal} database=${database} onClose=${() => (showHistoryModal.value = false)} />`}
      ${
        showCamperModal.value &&
        html`<${CamperModal}
          onClose=${() => (showCamperModal.value = false)}
          onSelect=${(camper) => {
            activity.value = { ...activity.value, camperName: camper };
          }}
        />`
      }

      ${
        showSessionTypeModal.value &&
        html`<${SessionTypeModal}
          onClose=${() => (showSessionTypeModal.value = false)}
          onSelect=${(sessionType) => {
            activity.value = { ...activity.value, sessionType };
          }}
        />`
      }

      <${Card} class="flex-1">
        <${CardContent} class="p-4 space-y-4 h-full flex flex-col">
          <div class="flex flex-col gap-4">
            <${Label} >Therapist
              <${Input} 
                id="therapistName" 
                value=${activity.value.therapistName} 
                onInput=${(e) => (activity.value = { ...activity.value, therapistName: e.target.value })} 
                autoFocus=${!Boolean(activity.value.therapistName)}
                placeholder="Jane"  
              />
            </${Label}>

            <${LabelLike} onClick=${() => (showCamperModal.value = true)}>Camper
              <div class="flex justify-between items-center font-medium">
                ${activity.value.camperName || html`<span />`}
                <${Button} type="button" variant="outline" size="sm">
                  ${activity.value.camperName ? "Change" : "Select"}
                </${Button}>
              </div>
            </${LabelLike}>

            <${LabelLike} onClick=${() => (showSessionTypeModal.value = true)}>Session Type
              <div class="flex justify-between items-center font-medium">
                ${activity.value.sessionType}
                <${Button} type="button" variant="outline" size="sm">
                  Change
                </${Button}>
              </div>
            </${LabelLike}>
          </div>

          <${Label} >Group
            <${Input} 
              id="groupName" 
              value=${activity.value.groupName} 
              onInput=${(e) => (activity.value = { ...activity.value, groupName: e.target.value })} 
              placeholder="Triathlon"  
            />
          </${Label}>

          <${Label} class="flex flex-col">Activity Description
            <${TextArea} 
              value=${activity.value.description}
              class="h-25"
              onInput=${(e) => (activity.value = { ...activity.value, description: e.target.value })}
              placeholder="Describe the current activity" />
          </${Label}>

          <div class="text-center">
            <div class=${cn("text-4xl font-mono font-bold mb-2", isRunning ? "" : "opacity-50")}>${formatElapsedTime(activity.value.startTime, activity.value.endTime)}</div>
            <div class="space-x-2">
              <${Button} disabled=${isRunning || !activity.value.camperName || !activity.value.therapistName}>
                Start
              </${Button}>
              <${Button} disabled=${!isRunning} variant="secondary">
                Stop
              </${Button}>
            </div>
            <div class="pt-4">
              ${!activity.value.therapistName && html`<div class="text-center text-secondary">Cannot start timer without a therapist name</div>`}
              ${!activity.value.camperName && html`<div class="text-center text-secondary">Cannot start timer without a camper</div>`}
            </div>
          </div>
        </${CardContent}>
      </${Card}>
    </form>
  `;
};

/**
 * @param {string | null} activityJSON
 * @returns {{id: string, therapistName: string, camperName: string, description: string, startTime: Date | null, endTime: Date | null}}
 */
const parseLocalStorageActivity = (activityJSON) => {
  if (!activityJSON) {
    return {
      id: null,
      therapistName: "",
      camperName: "",
      groupName: "",
      sessionType: sessionTypes[0],
      description: "",
      startTime: null,
      endTime: null,
    };
  }

  const activity = JSON.parse(activityJSON);

  return {
    id: activity.id,
    therapistName: activity.therapistName,
    groupName: activity.groupName,
    sessionType: parseSessionType(activity.sessionType),
    camperName: activity.camperName,
    description: activity.description,
    startTime: activity.startTime ? new Date(activity.startTime) : null,
    endTime: activity.endTime ? new Date(activity.endTime) : null,
  };
};

/**
 * @param {{id: string, therapistName: string, groupName: string, camperName: string, description: string, startTime: Date | null, endTime: Date | null}} activity
 * @returns {string}
 */
const formatActivityForLocalStorage = (activity) => {
  return JSON.stringify({
    id: activity.id,
    therapistName: activity.therapistName,
    groupName: activity.groupName,
    sessionType: activity.sessionType,
    camperName: activity.camperName,
    description: activity.description,
    startTime: activity.startTime?.toISOString() ?? null,
    endTime: activity.endTime?.toISOString() ?? null,
  });
};
