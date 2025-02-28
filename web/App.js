import { html } from "htm/preact";
import { useSignal, useSignalEffect, batch } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label } from "./components/Label.js";
import { TextArea } from "./components/TextArea.js";
import { NotificationsIndicator } from "./components/NotificationsIndicator.js";
import { NotificationsModal } from "./components/NotificationsModal.js";

import { startActivity } from "./data/startActivity.js";
import { stopActivity } from "./data/stopActivity.js";
import { hasUnsynchronizedActivities } from "./data/hasUnsynchronizedActivities.js";

import { formatElapsedTime } from "./formatElapsedTime.js";
import { fromISOString } from "./date.js";
import { cn } from "./cn.js";

/**
 * @param {{database: IDBDatabase}} props
 */
export const App = ({ database }) => {
  const therapistName = useSignal(JSON.parse(window.localStorage.getItem("therapistName")) ?? "");
  const camperName = useSignal(JSON.parse(window.localStorage.getItem("camperName")) ?? "");
  const description = useSignal(JSON.parse(window.localStorage.getItem("description")) ?? "");

  const activityId = useSignal(JSON.parse(window.localStorage.getItem("activityId")));
  const startTime = useSignal(fromISOString(JSON.parse(window.localStorage.getItem("startTime"))));
  const endTime = useSignal(new Date());
  const isRunning = Boolean(startTime.value);
  const showNotificationsModal = useSignal(false);

  const hasNotifications = useSignal(false);

  useSignalEffect(() => window.localStorage.setItem("therapistName", JSON.stringify(therapistName.value)));
  useSignalEffect(() => window.localStorage.setItem("camperName", JSON.stringify(camperName.value)));
  useSignalEffect(() => window.localStorage.setItem("description", JSON.stringify(description.value)));
  useSignalEffect(() => window.localStorage.setItem("activityId", JSON.stringify(activityId.value)));
  useSignalEffect(() => window.localStorage.setItem("startTime", JSON.stringify(startTime.value?.toISOString() ?? null)));

  useEffect(() => {
    const interval = setInterval(() => (endTime.value = new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = async () => {
    startTime.value = new Date();

    const activity = {
      therapistName: therapistName.value,
      camperName: camperName.value,
      description: description.value,
      startTime: startTime.value.toISOString(),
    };

    const { id } = await startActivity({ database }, activity);

    activityId.value = id;
  };

  const stopTimer = async () => {
    const activity = {
      id: activityId.value,
      therapistName: therapistName.value,
      camperName: camperName.value,
      description: description.value,
      startTime: startTime.value.toISOString(),
      endTime: endTime.value.toISOString(),
    };

    await stopActivity({ database }, activity);

    batch(() => {
      startTime.value = null;
      activityId.value = null;
    });
  };

  useSignalEffect(async () => {
    endTime.value; // read this to trigger the effect
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

      <${Card} class="flex-1">
        <${CardContent} class="p-4 space-y-4 h-full flex flex-col">
          <div class="flex flex-col gap-2">
            <${Label} >Therapist
              <${Input} 
                id="therapistName" 
                value=${therapistName} 
                onInput=${(e) => (therapistName.value = e.target.value)} 
                disabled=${isRunning}
                autoFocus=${!Boolean(therapistName.value)}
                placeholder="Jane"  
              />
            </${Label}>

            <${Label} >Camper
              <${Input} 
                id="camperName" 
                value=${camperName} 
                onInput=${(e) => (camperName.value = e.target.value)} 
                disabled=${isRunning || !therapistName.value.length}
                autoFocus=${Boolean(therapistName.value)}
                placeholder="Bob"
              />
            </${Label}>
          </div>

          <div class="text-center">
            <div class=${cn("text-4xl font-mono font-bold mb-2", isRunning ? "" : "opacity-50")}>${formatElapsedTime(startTime.value, endTime.value)}</div>
            <div class="space-x-2">
              <${Button} disabled=${isRunning || !camperName.value.length || !therapistName.value.length}>
                Start
              </${Button}>
              <${Button} disabled=${!isRunning} variant="secondary">
                Stop
              </${Button}>
            </div>
          </div>

          <${Label} class="flex-1 flex flex-col">Activity Description
            <${TextArea} 
              value=${description}
              class="h-25"
              onInput=${(e) => (description.value = e.target.value)}
              disabled=${!therapistName.value.length || !camperName.value.length}
              placeholder="Describe the current activity" />
          </${Label}>
        </${CardContent}>
      </${Card}>
    </form>
  `;
};
