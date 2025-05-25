import { html } from "htm/preact";
import { Modal } from "./Modal.js";
import { Label } from "./Label.js";
import { Input } from "./Input.js";

/**
 * @param {{onClose: () => void, activity: Signal<{therapistName: string}>}} props
 */
export const SettingsModal = ({ onClose, activity }) => {
  return html`
    <${Modal} title="Settings" onClose=${onClose}>
      <div class="px-4 flex flex-col gap-4">
        <${Label} >Therapist
          <${Input} 
            id="therapistName" 
            value=${activity.value.therapistName} 
            onInput=${(e) => (activity.value = { ...activity.value, therapistName: e.target.value })} 
            autoFocus=${!Boolean(activity.value.therapistName)}
            placeholder="Jane"  
          />
        </${Label}>
      </div>
    </${Modal}>
  `;
};
