import { html } from "htm/preact";
import { History } from "./icons/History.js";
import { cn } from "../cn.js";

/**
 * @param {{class: string, hasNotifications: Signal<boolean>, onClick: () => void}} props
 */
export const NotificationsIndicator = ({ hasNotifications, ...props }) => {
  return html` <button class=${cn("size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl", props.class)} type="button" onClick=${props.onClick}>
    ${hasNotifications.value && html`<span class="absolute top-1.25 right-1.25 size-2 rounded-full bg-danger"></span>`}
    <${History} class="text-danger" />
  </button>`;
};
