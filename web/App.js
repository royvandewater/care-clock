import { html } from "htm/preact";
import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label } from "./components/Label.js";

export const App = () => {
  const patientName = "Bob";
  const formatTime = (milliseconds) => {
    return new Date(milliseconds).toISOString();
  };
  const currentActivity = "Dancing";
  const activities = [];
  const time = Date.now();
  const startTimer = () => {};
  const stopTimer = () => {};
  const isRunning = false;

  return html`
    <div class="max-w-md mx-auto p-4 space-y-6">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-primary">
          KidClock Therapy Tracker
        </h1>
      </header>

      <${Card}>
        <${CardContent} class="p-4 space-y-4">
          <div>
            <${Label} htmlFor="patientName">Patient Name</label>
            <${Input} 
              id="patientName" 
              value=${patientName} 
              onChange=${(e) => {
                setPatientName(e.target.value);
              }} 
              placeholder="Enter patient's name"
            />
          </div>

          <div class="text-center">
            <div class="text-4xl font-bold mb-2">${formatTime(time)}</div>
            <div class="space-x-2">
              <${Button}
                onClick=${startTimer}
                disabled=${isRunning || !patientName}
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
            <${Label} htmlFor="activityDescription">Activity Description</label>
            <${Input} 
              id="activityDescription" 
              value=${currentActivity}
              onChange=${(e) => setCurrentActivity(e.target.value)}
              placeholder="Describe the current activity" />
          </div>
        </${CardContent}>
      </${Card}>

      <${Card}>
        <${CardContent} class="p-4">
          <h2 class="text-xl font-semibold mb-2">Recorded Activities</h2>
          ${
            activities.length === 0
              ? html`<p class="text-muted-foreground">
                  No activities recorded yet.
                </p>`
              : html`<ul class="space-y-2">
                  ${activities.map(
                    (activity, index) => html`
                      <li
                        key="{index}"
                        class="flex justify-between items-center"
                      >
                        <span>{activity.description}</span>
                        <span class="text-muted-foreground">
                          {formatTime(activity.duration)}
                        </span>
                      </li>
                    `
                  )}
                </ul>`
          }
        </${CardContent}>
      </${Card}>
    </div>
  `;
};
