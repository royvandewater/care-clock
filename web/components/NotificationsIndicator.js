import { html } from "htm/preact";
import { Bell } from "./icons/Bell.js";
import { BellAlert } from "./icons/BellAlert.js";
import { cn } from "../cn.js";

/**
 * @param {{class: string, hasNotifications: Signal<boolean>}} props
 */
export const NotificationsIndicator = ({ hasNotifications, ...props }) => {
  const Icon = hasNotifications.value ? BellAlert : Bell;

  return html` <div class=${cn("size-8 flex items-center justify-center", props.class)}>
    <${Icon} />
  </div>`;
};
