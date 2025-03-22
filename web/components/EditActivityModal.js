import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { getActivityFromIndexedDB } from "../data/database.js";
import { upsertActivity } from "../data/upsertActivity.js";

import { Modal } from "./Modal.js";
import { Label, LabelLike } from "./Label.js";
import { Input } from "./Input.js";
import { Button } from "./Button.js";
import { CamperModal } from "./CampersModal.js";
import { SessionTypeModal } from "./SessionTypeModal.js";
import { TextArea } from "./TextArea.js";

export const EditActivityModal = ({ database, activityId, onClose }) => {
  const activity = useSignal(null);
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
    await upsertActivity({ database }, activity.value);
    onClose();
  };

  const header = html`<h1 class="text-2xl font-bold">Edit Activity</h1>`;

  if (!activity.value) return html`<${Modal} title=${header} onClose=${onClose} class="gap-y-10" />`;

  if (showCamperModal.value) {
    return html`<${CamperModal} onClose=${() => (showCamperModal.value = false)} onSelect=${(camper) => (activity.value = { ...activity.value, camperName: camper })} />`;
  }

  if (showSessionTypeModal.value) {
    return html`<${SessionTypeModal} onClose=${() => (showSessionTypeModal.value = false)} onSelect=${(sessionType) => (activity.value = { ...activity.value, sessionType })} />`;
  }

  return html`<${Modal} title=${header} onClose=${onClose} class="gap-y-10" >
    <form onSubmit=${onSubmit} class="flex flex-col gap-4">
      <${Label} >Therapist
        <${Input} 
          id="therapistName" 
          value=${activity.value.therapistName} 
          onInput=${(e) => (activity.value = { ...activity.value, therapistName: e.target.value })} 
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
          onInput=${(e) => (activity.value = { ...activity.value, groupName: e.target.value })} 
          placeholder="Triathlon"  
        />
      </${Label}>

      <${Label} class="flex flex-col">Activity Description
        <${TextArea} 
          value=${activity.value.description}
          class="h-25"
          onInput=${(e) => (activity.value = { ...activity.value, description: e.target.value })}
          placeholder="Describe the current activity" />
      </${Label}>

      <${Button} tyep="submit" disabled=${!activity.value.camperName || !activity.value.therapistName}>
        Save
      </${Button}>
    </form>
  </${Modal}>`;
};
