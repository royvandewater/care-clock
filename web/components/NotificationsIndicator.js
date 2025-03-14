import { html } from "htm/preact";
import { Bell } from "./icons/Bell.js";
import { BellAlert } from "./icons/BellAlert.js";
import { cn } from "../cn.js";

/**
 * @param {{class: string, hasNotifications: Signal<boolean>, onClick: () => void}} props
 */
export const NotificationsIndicator = ({ hasNotifications, ...props }) => {
  const Icon = hasNotifications.value ? BellAlert : Bell;

  return html` <button class=${cn("size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl", props.class)} type="button" onClick=${props.onClick}>
    ${hasNotifications.value && html`<span class="absolute top-0 right-0 size-2 rounded-full bg-red-500"></span>`}
    <${Icon} />
  </button>`;
};
