import { html } from "htm/preact";
import { useSignal } from "@preact/signals";

import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label } from "./components/Label.js";

import { startActivity } from "./data/startActivity.js";
import { stopActivity } from "./data/stopActivity.js";

import { formatElapsedTime } from "./formatElapsedTime.js";

export const App = () => {
  const therapistName = useSignal("");
  const camperName = useSignal("");
  const description = useSignal("");

  const rowNumber = useSignal(null);
  const startTime = useSignal(null);
  const endTime = useSignal(null);
  const interval = useSignal(null);
  const isRunning = Boolean(interval.value);
  const showSettings = useSignal(!Boolean(therapistName.value));

  const toggleSettings = () => {
    showSettings.value = !showSettings.value;
  };

  const startTimer = async () => {
    if (interval.value) clearInterval(interval.value);
    const activity = await startActivity({
      therapistName: therapistName.value,
      camperName: camperName.value,
      description: description.value,
    });
    rowNumber.value = activity.rowNumber;
    startTime.value = activity.startTime;
    interval.value = setInterval(() => (endTime.value = new Date()), 1000);
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
            <div class="text-4xl font-mono font-bold mb-2">${formatElapsedTime(endTime.value, startTime.value)}</div>
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
