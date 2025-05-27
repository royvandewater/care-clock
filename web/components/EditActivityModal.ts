import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { getActivityFromIndexedDB } from "@/data/database";
import { upsertActivity } from "@/data/upsertActivity";

import { Modal } from "@/components/Modal";
import { Label, LabelLike } from "@/components/Label";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { CamperModal } from "@/components/CampersModal";
import { SessionTypeModal } from "@/components/SessionTypeModal";
import { TextArea } from "@/components/TextArea";
import type { Activity } from "@/data/serialization";
import { assert } from "@/assert";
import type { SessionType } from "@/data/sessionTypes";

export const EditActivityModal = ({ database, activityId, onClose }) => {
  const activity = useSignal<Activity | null>(null);
  const showCamperModal = useSignal(false);
  const showSessionTypeModal = useSignal(false);

  useEffect(() => {
    const refreshActivity = async () => {
      activity.value = await getActivityFromIndexedDB(database, activityId);
    };
    refreshActivity();
    database.addEventListener("activities:changed", refreshActivity);
    return () => database.removeEventListener("activities:changed", refreshActivity);
  }, [activityId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    assert(activity.value);

    await upsertActivity(
      { database },
      {
        ...activity.value,
        campers: [{ name: activity.value.camperName, id: activity.value.id }],
      },
    );
    onClose();
  };

  const header = html`<h1 class="text-2xl font-bold">Edit Activity</h1>`;

  if (!activity.value) return html`<${Modal} title=${header} onClose=${onClose} class="gap-y-10" />`;

  assert(activity.value.startTime);

  if (showCamperModal.value) {
    return html`<${CamperModal}
      onClose=${() => (showCamperModal.value = false)}
      onSelect=${(camperName: string) => {
        assert(activity.value);
        activity.value = { ...activity.value, camperName };
      }}
    />`;
  }

  if (showSessionTypeModal.value) {
    return html`<${SessionTypeModal}
      onClose=${() => (showSessionTypeModal.value = false)}
      onSelect=${(sessionType: SessionType) => {
        assert(activity.value);
        activity.value = { ...activity.value, sessionType };
      }}
    />`;
  }

  return html`<${Modal} title=${header} onClose=${onClose} class="gap-y-10" >
    <form onSubmit=${onSubmit} class="flex flex-col gap-4">
      <${Label} >Therapist
        <${Input} 
          id="therapistName" 
          value=${activity.value.therapistName} 
          onInput=${(e: InputEvent) => {
            assert(e.target instanceof HTMLInputElement);
            assert(activity.value);
            activity.value = { ...activity.value, therapistName: e.target.value };
          }} 
          autoFocus=${!Boolean(activity.value.therapistName)}
          placeholder="Jane"  
        />
      </${Label}>

      <${LabelLike} onClick=${() => (showCamperModal.value = true)}>Camper
        <div class="flex justify-between items-center font-medium">
          ${activity.value.camperName ?? ""}
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

      <${Label} >Group
        <${Input} 
          id="groupName" 
          value=${activity.value.groupName} 
          onInput=${(e: InputEvent) => {
            assert(e.target instanceof HTMLInputElement);
            assert(activity.value);
            activity.value = { ...activity.value, groupName: e.target.value };
          }} 
          placeholder="Triathlon"  
        />
      </${Label}>

      <${Label} class="flex flex-col">Activity Description
        <${TextArea} 
          value=${activity.value.description}
          class="h-25"
          onInput=${(e: InputEvent) => {
            assert(e.target instanceof HTMLTextAreaElement);
            assert(activity.value);
            activity.value = { ...activity.value, description: e.target.value };
          }}
          placeholder="Describe the current activity" />
      </${Label}>

      <div class="flex gap-4">
        <${Label} class="flex-1">Start Date
          <${Input} 
            id="startDate" 
            type="date"
            value=${activity.value.startTime.toISOString().slice(0, 10)} 
            onInput=${(e: InputEvent) => {
              assert(e.target instanceof HTMLInputElement);
              assert(activity.value?.startTime);
              const time = activity.value.startTime.toISOString().slice(11);
              activity.value = { ...activity.value, startTime: combineDateAndTime(e.target.value, time) };
            }} 
          />
        </${Label}>

        <${Label} class="flex-1">Start Time
          <${Input} 
            id="startTime" 
            type="time"
            value=${activity.value.startTime.toTimeString().slice(0, 8)} 
            step="1"
            onInput=${(e: InputEvent) => {
              assert(e.target instanceof HTMLInputElement);
              assert(activity.value?.startTime);
              const date = activity.value.startTime.toISOString().slice(0, 10);
              activity.value = { ...activity.value, startTime: combineDateAndTime(date, e.target.value) };
            }} 
          />
        </${Label}>
      </div>

      <div class="flex gap-4">
        <${Label} class="flex-1">End Date
          <${Input} 
            id="endDate" 
            type="date"
            value=${activity.value.endTime?.toISOString().slice(0, 10)} 
            onInput=${(e: InputEvent) => {
              assert(e.target instanceof HTMLInputElement);
              assert(activity.value);
              const time = activity.value.endTime?.toISOString().slice(11) ?? "00:00";
              activity.value = { ...activity.value, endTime: combineDateAndTime(e.target.value, time) };
            }} 
          />
        </${Label}>

        <${Label} class="flex-1">End Time
          <${Input} 
            id="endTime" 
            type="time"
            value=${activity.value.endTime?.toTimeString().slice(0, 8)} 
            step="1"
            onInput=${(e: InputEvent) => {
              assert(e.target instanceof HTMLInputElement);
              assert(activity.value);
              const date = (activity.value.endTime ?? new Date()).toISOString().slice(0, 10);
              activity.value = { ...activity.value, endTime: combineDateAndTime(date, e.target.value) };
            }} 
          />
        </${Label}>
      </div>

      <${Button} type="submit" disabled=${!activity.value.camperName || !activity.value.therapistName}>
        Save
      </${Button}>
    </form>
  </${Modal}>`;
};

const combineDateAndTime = (date, time) => {
  return new Date(`${date}T${time}`);
};
