import { html } from "htm/preact";
import { useSignal, useSignalEffect, batch, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label, LabelLike } from "./components/Label.js";
import { TextArea } from "./components/TextArea.js";
import { NotificationsIndicator } from "./components/NotificationsIndicator.js";
import { NotificationsModal } from "./components/NotificationsModal.js";
import { CamperModal } from "./components/CampersModal.js";

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
  const showNotificationsModal = useSignal(false);
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

  useSignalEffect(async () => {
    activity.value; // read this to trigger the effect
    hasNotifications.value = await hasUnsynchronizedActivities({ database });
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (isRunning) return stopTimer();
    startTimer();
  };

  return html`
    <form class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0" onSubmit=${onSubmit}>
      <header class="text-center relative">
        <h1 class="text-2xl font-bold text-primary">Care Clock</h1>
        <${NotificationsIndicator} class="absolute top-0 right-4" hasNotifications=${hasNotifications} onClick=${() => (showNotificationsModal.value = true)}/>
      </header>

      ${showNotificationsModal.value && html`<${NotificationsModal} database=${database} onClose=${() => (showNotificationsModal.value = false)} />`}
      ${
        showCamperModal.value &&
        html`<${CamperModal}
          database=${database}
          onClose=${() => (showCamperModal.value = false)}
          onSelect=${(camper) => {
            activity.value = { ...activity.value, camperName: camper };
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
                disabled=${isRunning}
                autoFocus=${!Boolean(activity.value.therapistName)}
                placeholder="Jane"  
              />
            </${Label}>

            <${LabelLike} >Camper
              <div class="flex justify-between items-center font-medium">
                ${activity.value.camperName ?? ""}
                <${Button} type="button" onClick=${() => (showCamperModal.value = true)} variant="outline" size="sm">
                  Change
                </${Button}>
              </div>
            </${LabelLike}>
          </div>

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
          </div>

          <${Label} class="flex-1 flex flex-col">Activity Description
            <${TextArea} 
              value=${activity.value.description}
              class="h-25"
              onInput=${(e) => (activity.value = { ...activity.value, description: e.target.value })}
              placeholder="Describe the current activity" />
          </${Label}>
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
      description: "",
      startTime: null,
      endTime: null,
    };
  }

  const activity = JSON.parse(activityJSON);

  return {
    id: activity.id,
    therapistName: activity.therapistName,
    camperName: activity.camperName,
    description: activity.description,
    startTime: activity.startTime ? new Date(activity.startTime) : null,
    endTime: activity.endTime ? new Date(activity.endTime) : null,
  };
};

/**
 * @param {{id: string, therapistName: string, camperName: string, description: string, startTime: Date | null, endTime: Date | null}} activity
 * @returns {string}
 */
const formatActivityForLocalStorage = (activity) => {
  return JSON.stringify({
    id: activity.id,
    therapistName: activity.therapistName,
    camperName: activity.camperName,
    description: activity.description,
    startTime: activity.startTime?.toISOString() ?? null,
    endTime: activity.endTime?.toISOString() ?? null,
  });
};
