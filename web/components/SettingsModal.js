import { html } from "htm/preact";
import { Modal } from "./Modal.js";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { Input } from "./Input";

/**
 * @param {{onClose: () => void, activity: Signal<{therapistName: string}>, theme: Signal<"light" | "dark" | "system">}} props
 */
export const SettingsModal = ({ onClose, activity, theme }) => {
  return html`
    <${Modal} title="Settings" onClose=${onClose}>
      <form class="px-4 flex flex-col gap-4" onSubmit=${(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}>
        <${Label} >Therapist
          <${Input} 
            id="therapistName" 
            value=${activity.value.therapistName} 
            onInput=${(e) => (activity.value = { ...activity.value, therapistName: e.target.value })} 
            autoFocus=${!Boolean(activity.value.therapistName)}
            placeholder="Jane"  
          />
        </${Label}>

        <${Label}>Interface Theme
          <div class="flex">
            <${Button} 
              type="button"
              variant=${theme.value === "light" ? "default" : "outline"} 
              onClick=${() => (theme.value = "light")} 
              className="border-r-0 rounded-r-none">Light</${Button}>
            <${Button} 
              type="button"
              variant=${theme.value === "dark" ? "default" : "outline"} 
              onClick=${() => (theme.value = "dark")} 
              className="rounded-none">Dark</${Button}>
            <${Button} 
              type="button"
              variant=${theme.value === "system" ? "default" : "outline"} 
              onClick=${() => (theme.value = "system")} 
              className="border-l-0 rounded-l-none">System</${Button}>
          </div>
        </${Label}>
      </form>
    </${Modal}>
  `;
};
