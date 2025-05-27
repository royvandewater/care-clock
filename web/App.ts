import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label, LabelLike } from "@/components/Label";
import { TextArea } from "@/components/TextArea";
import { Settings } from "@/components/icons/Settings";
import { HistoryButton } from "@/components/HistoryButton";
import { HistoryModal } from "@/components/HistoryModal";
import { CamperModal } from "@/components/CampersModal";
import { SessionTypeModal } from "@/components/SessionTypeModal";
import { SettingsModal } from "@/components/SettingsModal";

import { startActivity } from "@/data/startActivity";
import { upsertActivity } from "@/data/upsertActivity";
import { hasUnsynchronizedActivities } from "@/data/hasUnsynchronizedActivities";
import { useActivity } from "@/data/useActivity";
import type { SessionType } from "@/data/sessionTypes";
import { useTheme } from "./data/useTheme.js";

import { formatElapsedTime } from "./formatElapsedTime.js";
import { cn } from "./cn.js";
import { assert } from "./assert.js";

export const App = ({ database }: { database: IDBDatabase }) => {
  const activity = useActivity();
  const theme = useTheme();
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

  useEffect(() => {
    const updateHasNotifications = async () => {
      hasNotifications.value = await hasUnsynchronizedActivities({ database });
    };
    updateHasNotifications();

    database.addEventListener("activities:changed", updateHasNotifications);
    return () => database.removeEventListener("activities:changed", updateHasNotifications);
  }, [database]);

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRunning) return stopTimer();
    startTimer();
  };

  if (showSettingsModal.value) {
    return html`
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <${SettingsModal} onClose=${() => (showSettingsModal.value = false)} activity=${activity} theme=${theme} />
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
          onSelectCampers=${(campers: string[]) => {
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
          onSelect=${(sessionType: SessionType) => {
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
    <form class="h-full max-w-md shadow-lg mx-auto p-4 space-y-6 flex flex-col gap-4 z-0" onSubmit=${onSubmit}>
      <header class="text-center relative">
        <${SettingsButton} 
          onClick=${() => (showSettingsModal.value = true)} 
          class="absolute top-0 left-4" 
        />
        <h1 class="text-2xl font-bold text-primary">Care Clock</h1>
        <${HistoryButton} class="absolute top-0 right-4" hasNotifications=${hasNotifications} onClick=${() => (showHistoryModal.value = true)}/>
      </header>

      <${Card} class="flex-1">
        <${CardContent} class="p-4 space-y-4 h-full flex flex-col">
          <div class="flex flex-col gap-4">
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
            onChangeGroupName=${(groupName: string) => (activity.value = { ...activity.value, groupName })}
            withWho=${activity.value.withWho}
            onChangeWithWho=${(withWho: string) => (activity.value = { ...activity.value, withWho })}
          />

          <${Label} class="flex flex-col">Activity Description
            <${TextArea} 
              value=${activity.value.description}
              class="h-40"
              onInput=${(e: InputEvent) => {
                assert(e.target instanceof HTMLTextAreaElement, "this onInput was not called on a textarea");
                return (activity.value = { ...activity.value, description: e.target.value });
              }}
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
              ${
                !activity.value.therapistName &&
                html`<div class="text-center text-secondary">
                  Cannot start timer without a therapist name. The therapist name is configured using the settings button on the top left.
                </div>`
              }
              ${!activity.value.campers.length && html`<div class="text-center text-secondary">Cannot start timer without campers</div>`}
            </div>
          </div>
        </${CardContent}>
      </${Card}>
    </form>
  `;
};

const shouldClearGroup = (oldSessionType: SessionType, newSessionType: SessionType) => {
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
    <button aria-label="Settings" class=${cn("size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl", props.class)} type="button" onClick=${onClick}>
      <${Settings} />
    </button>
  `;
};

const AdditionalSessionInfo = ({
  sessionType,
  groupName,
  onChangeGroupName,
  withWho,
  onChangeWithWho,
}: {
  sessionType: SessionType;
  groupName: string;
  onChangeGroupName: (name: string) => void;
  withWho: string;
  onChangeWithWho: (name: string) => void;
}) => {
  if (sessionType === "Individual") {
    return null;
  }

  if (sessionType === "Group") {
    return html`
      <${Label} >Group
        <${Input} 
          id="groupName" 
          value=${groupName} 
          onInput=${(e: InputEvent) => {
            assert(e.target instanceof HTMLInputElement);
            onChangeGroupName(e.target.value);
          }}
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
        onInput=${(e: InputEvent) => {
          assert(e.target instanceof HTMLInputElement);
          onChangeWithWho(e.target.value);
        }}
        placeholder="Mr. John"  
      />
    </${Label}>
  `;
};
