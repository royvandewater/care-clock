import { html } from "htm/preact";
import { useSignal, useSignalEffect, batch, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Card, CardContent } from "./components/Card.js";
import { Button } from "./components/Button.js";
import { Input } from "./components/Input.js";
import { Label, LabelLike } from "./components/Label.js";
import { TextArea } from "./components/TextArea.js";
import { Settings } from "./components/icons/Settings.js";
import { HistoryButton } from "./components/HistoryButton.js";
import { HistoryModal } from "./components/HistoryModal.js";
import { CamperModal } from "./components/CampersModal.js";
import { SessionTypeModal } from "./components/SessionTypeModal.js";
import { SettingsModal } from "./components/SettingsModal.js";

import { startActivity } from "./data/startActivity.js";
import { upsertActivity } from "./data/upsertActivity.js";
import { hasUnsynchronizedActivities } from "./data/hasUnsynchronizedActivities.js";
import { useActivity } from "./data/useActivity.js";

import { formatElapsedTime } from "./formatElapsedTime.js";
import { cn } from "./cn.js";

/**
 * @param {{database: IDBDatabase}} props
 */
export const App = ({ database }) => {
  const activity = useActivity();
  const isRunning = Boolean(activity.value.startTime);

  const showSettingsModal = useSignal(false);
  const showCamperModal = useSignal(false);
  const showSessionTypeModal = useSignal(false);
  const showHistoryModal = useSignal(false);
  const hasNotifications = useSignal(false);

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
      campers: activity.value.campers.map((camper) => ({ ...camper, id: null })),
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
    e.stopPropagation();
    if (isRunning) return stopTimer();
    startTimer();
  };

  if (showSettingsModal.value) {
    return html`
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <${SettingsModal} onClose=${() => (showSettingsModal.value = false)} />
      </div>
    `;
  }

  if (showHistoryModal.value) {
    return html`
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <${HistoryModal} database=${database} onClose=${() => (showHistoryModal.value = false)} />
      </div>
    `;
  }

  if (showCamperModal.value) {
    return html`
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <${CamperModal}
          selectedCampers=${activity.value.campers.map((camper) => camper.name)}
          onClose=${() => (showCamperModal.value = false)}
          onSelectCampers=${(campers) => {
            activity.value = {
              ...activity.value,
              campers: campers.sort().map((camper) => {
                // TODO: There's a problem here where if a camper is removed while a timer is running, that camper's session will never
                // be stopped. Maybe we should flag that on the history modal?
                const existingCamper = activity.value.campers.find((c) => c.name === camper);
                return { name: camper, id: existingCamper?.id ?? null };
              }),
            };
          }}
        />
      </div>
    `;
  }

  if (showSessionTypeModal.value) {
    return html`
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <${SessionTypeModal}
          onClose=${() => (showSessionTypeModal.value = false)}
          onSelect=${(sessionType) => {
            if (shouldClearGroup(activity.value.sessionType, sessionType)) {
              activity.value = { ...activity.value, groupName: "" };
            }
            if (shouldClearWithWho(activity.value.sessionType, sessionType)) {
              activity.value = { ...activity.value, withWho: "" };
            }

            activity.value = { ...activity.value, sessionType };
          }}
        />
      </div>
    `;
  }

  return html`
    <form class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0" onSubmit=${onSubmit}>
      <header class="text-center relative">
        <${SettingsButton} onClick=${() => (showSettingsModal.value = true)} class="absolute top-0 left-4" />
        <h1 class="text-2xl font-bold text-primary">Care Clock</h1>
        <${HistoryButton} class="absolute top-0 right-4" hasNotifications=${hasNotifications} onClick=${() => (showHistoryModal.value = true)}/>
      </header>

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

            <${LabelLike} onClick=${() => (showCamperModal.value = true)}>Campers
              <div class="flex justify-between items-center font-medium">
                <span class="text-sm font-medium text-foreground px-3">${activity.value.campers.map((camper) => camper.name).join(", ") || "No campers selected"}</span>
                <${Button} type="button" variant="outline" size="sm" aria-label="Select Campers">
                  Select
                </${Button}>
              </div>
            </${LabelLike}>

            <${LabelLike} onClick=${() => (showSessionTypeModal.value = true)}>Session Type
              <div class="flex justify-between items-center font-medium">
                <span class="text-sm font-medium text-foreground px-3">${activity.value.sessionType}</span>
                <${Button} type="button" variant="outline" size="sm" aria-label="Select Session Type">
                  Select
                </${Button}>
              </div>
            </${LabelLike}>
          </div>

          <${AdditionalSessionInfo}
            sessionType=${activity.value.sessionType}
            groupName=${activity.value.groupName}
            onChangeGroupName=${(e) => (activity.value = { ...activity.value, groupName: e.target.value })}
            withWho=${activity.value.withWho}
            onChangeWithWho=${(e) => (activity.value = { ...activity.value, withWho: e.target.value })}
          />

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
              <${Button} disabled=${isRunning || !activity.value.campers.length || !activity.value.therapistName} aria-label="Start Timer">
                Start
              </${Button}>
              <${Button} disabled=${!isRunning} variant="secondary" aria-label="Stop Timer">
                Stop
              </${Button}>
            </div>
            <div class="pt-4">
              ${!activity.value.therapistName && html`<div class="text-center text-secondary">Cannot start timer without a therapist name</div>`}
              ${!activity.value.campers.length && html`<div class="text-center text-secondary">Cannot start timer without campers</div>`}
            </div>
          </div>
        </${CardContent}>
      </${Card}>
    </form>
  `;
};

const shouldClearGroup = (oldSessionType, newSessionType) => {
  if (oldSessionType === newSessionType) return false;
  return oldSessionType === "Group";
};

const shouldClearWithWho = (oldSessionType, newSessionType) => {
  if (oldSessionType === newSessionType) return false;
  if (newSessionType === "Individual") return true;
  if (newSessionType === "Group") return true;
  return false;
};

/**
 * @param {{onClick: () => void, class: string}} props
 */
const SettingsButton = ({ onClick, ...props }) => {
  return html`
    <button class=${cn("size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl", props.class)} type="button" onClick=${onClick}>
      <${Settings} />
    </button>
  `;
};

/**
 * @param {{
 *   sessionType: string,
 *   groupName: string,
 *   onChangeGroupName: (e: Event) => void,
 *   withWho: string,
 *   onChangeWithWho: (e: Event) => void,
 * }} props
 */
const AdditionalSessionInfo = ({ sessionType, groupName, onChangeGroupName, withWho, onChangeWithWho }) => {
  if (sessionType === "Individual") {
    return null;
  }

  if (sessionType === "Group") {
    return html`
      <${Label} >Group
        <${Input} 
          id="groupName" 
          value=${groupName} 
          onInput=${onChangeGroupName} 
          placeholder="Triathlon"  
        />
      </${Label}>
    `;
  }

  return html`
    <${Label} >With Who
      <${Input} 
        id="withWho" 
        value=${withWho} 
        onInput=${onChangeWithWho} 
        placeholder="Mr. John"  
      />
    </${Label}>
  `;
};
