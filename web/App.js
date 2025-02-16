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
  const therapistName = useSignal("Jane");
  const camperName = useSignal("Bob");
  const description = useSignal("");

  const activityId = useSignal(null);
  const startTime = useSignal(null);
  const endTime = useSignal(null);
  const interval = useSignal(null);
  const isRunning = Boolean(interval.value);

  const startTimer = async () => {
    if (interval.value) clearInterval(interval.value);
    const activity = await startActivity({
      therapistName: therapistName.value,
      camperName: camperName.value,
      description: description.value,
    });
    activityId.value = activity.id;
    startTime.value = activity.startTime;
    interval.value = setInterval(() => (endTime.value = new Date()), 1000);
  };
  const stopTimer = async () => {
    clearInterval(interval.value);
    interval.value = null;
    await stopActivity({
      id: activityId.value,
      description: description.value,
      endTime: new Date(),
    });
    startTime.value = null;
    endTime.value = null;
    activityId.value = null;
  };

  return html`
    <div class="max-w-md mx-auto p-4 space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-primary">
          CareClock
        </h1>
      </header>

      <${Card}>
        <${CardContent} class="p-4 space-y-4">
          <div>
            <${Label} >Camper
              <${Input} 
                id="camperName" 
                value=${camperName} 
                onInput=${(e) => (camperName.value = e.target.value)} 
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
                placeholder="Describe the current activity" />
            </${Label}>
          </div>
        </${CardContent}>
      </${Card}>
    </div>
  `;
};
