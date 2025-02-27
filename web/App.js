import { html } from "htm/preact";
import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label } from "./components/Label.js";
import { TextArea } from "./components/TextArea.js";

import { startActivity } from "./data/startActivity.js";
import { stopActivity } from "./data/stopActivity.js";

import { formatElapsedTime } from "./formatElapsedTime.js";
import { fromISOString } from "./date.js";
import { cn } from "./cn.js";

/**
 * @param {{service: ServiceWorker}} props
 */
export const App = ({ service }) => {
  const therapistName = useSignal(JSON.parse(window.localStorage.getItem("therapistName")) ?? "");
  const camperName = useSignal(JSON.parse(window.localStorage.getItem("camperName")) ?? "");
  const description = useSignal(JSON.parse(window.localStorage.getItem("description")) ?? "");

  const activityId = useSignal(JSON.parse(window.localStorage.getItem("activityId")));
  const startTime = useSignal(fromISOString(JSON.parse(window.localStorage.getItem("startTime"))));
  const endTime = useSignal(new Date());
  const isRunning = Boolean(startTime.value);

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel("sw-broadcast");

    broadcastChannel.onmessage = (event) => {
      switch (event.data.action) {
        case "activity.setId":
          activityId.value = event.data.data.id;
          break;
        case "activity.new":
          activityId.value = null;
          startTime.value = null;
          break;
        default:
          console.warn("unknown action", event.data);
          break;
      }
    };

    return () => broadcastChannel.close();
  }, [service]);

  useEffect(() => {
    const interval = setInterval(() => (endTime.value = new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  useSignalEffect(() => window.localStorage.setItem("therapistName", JSON.stringify(therapistName.value)));
  useSignalEffect(() => window.localStorage.setItem("camperName", JSON.stringify(camperName.value)));
  useSignalEffect(() => window.localStorage.setItem("description", JSON.stringify(description.value)));
  useSignalEffect(() => window.localStorage.setItem("activityId", JSON.stringify(activityId.value)));
  useSignalEffect(() => window.localStorage.setItem("startTime", JSON.stringify(startTime.value?.toISOString() ?? null)));

  const startTimer = async () => {
    startTime.value = new Date();

    service.postMessage({
      action: "activity.start",
      therapistName: therapistName.value,
      camperName: camperName.value,
      description: description.value,
      startTime: startTime.value.toISOString(),
    });
  };

  const stopTimer = async () => {
    service.postMessage({
      action: "activity.stop",
      id: activityId.value,
      therapistName: therapistName.value,
      camperName: camperName.value,
      description: description.value,
      startTime: startTime.value.toISOString(),
      endTime: endTime.value.toISOString(),
    });

    // await stopActivity({
    //   rowNumber: activityId.value,
    //   description: description.value,
    //   endTime: new Date(),
    // });
    // startTime.value = null;
    // activityId.value = null;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isRunning) return stopTimer();
    startTimer();
  };

  return html`
    <form class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4" onSubmit=${onSubmit}>
      <header class="text-center relative">
        <h1 class="text-2xl font-bold text-primary">
          Care Clock
        </h1>
      </header>

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
