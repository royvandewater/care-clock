import { html } from "htm/preact";
import { useSignal, useSignalEffect } from "@preact/signals";

import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label } from "./components/Label.js";

import { startActivity } from "./data/startActivity.js";
import { stopActivity } from "./data/stopActivity.js";

import { formatElapsedTime } from "./formatElapsedTime.js";
import { fromISOString } from "./date.js";

export const App = () => {
  const therapistName = useSignal(JSON.parse(window.localStorage.getItem("therapistName")) ?? "");
  const camperName = useSignal(JSON.parse(window.localStorage.getItem("camperName")) ?? "");
  const description = useSignal(JSON.parse(window.localStorage.getItem("description")) ?? "");

  const rowNumber = useSignal(JSON.parse(window.localStorage.getItem("rowNumber")));
  const startTime = useSignal(fromISOString(JSON.parse(window.localStorage.getItem("startTime"))));
  const endTime = useSignal(new Date());
  const interval = useSignal(null);
  const isRunning = Boolean(interval.value);

  useSignalEffect(() => {
    console.log("useSignalEffect", interval.value, startTime.value);
    if (interval.value) return;
    if (!startTime.value) return;

    interval.value = setInterval(() => (endTime.value = new Date()), 1000);
  });

  useSignalEffect(() => window.localStorage.setItem("therapistName", JSON.stringify(therapistName.value)));
  useSignalEffect(() => window.localStorage.setItem("camperName", JSON.stringify(camperName.value)));
  useSignalEffect(() => window.localStorage.setItem("description", JSON.stringify(description.value)));
  useSignalEffect(() => window.localStorage.setItem("rowNumber", JSON.stringify(rowNumber.value)));
  useSignalEffect(() => window.localStorage.setItem("startTime", JSON.stringify(startTime.value?.toISOString() ?? null)));

  const startTimer = async () => {
    if (interval.value) clearInterval(interval.value);
    const activity = await startActivity({
      therapistName: therapistName.value,
      camperName: camperName.value,
      description: description.value,
    });
    rowNumber.value = activity.rowNumber;
    startTime.value = activity.startTime;
  };

  const stopTimer = async () => {
    clearInterval(interval.value);
    interval.value = null;
    await stopActivity({
      rowNumber: rowNumber.value,
      description: description.value,
      endTime: new Date(),
    });
    startTime.value = null;
    endTime.value = null;
    rowNumber.value = null;
  };

  return html`
    <div class="max-w-md mx-auto p-4 space-y-6">
      <header class="text-center relative">
        <h1 class="text-2xl font-bold text-primary">
          CareClock
        </h1>
      </header>

      <${Card}>
        <${CardContent} class="p-4 space-y-4">
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
            <div class="text-4xl font-mono font-bold mb-2">${formatElapsedTime(startTime.value, endTime.value)}</div>
            <div class="space-x-2">
              <${Button}
                onClick=${() => startTimer()}
                disabled=${isRunning || !camperName.value.length || !therapistName.value.length}
              >
                Start
              </${Button}>
              <${Button}
                onClick=${stopTimer}
                disabled=${!isRunning}
                variant="destructive"
              >
                Stop
              </${Button}>
            </div>
          </div>

          <div>
            <${Label} >Activity Description
              <${Input} 
                value=${description}
                onInput=${(e) => (description.value = e.target.value)}
                disabled=${!therapistName.value.length || !camperName.value.length}
                placeholder="Describe the current activity" />
            </${Label}>
          </div>
        </${CardContent}>
      </${Card}>
    </div>
  `;
};
