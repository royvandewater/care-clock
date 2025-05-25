import { html } from "htm/preact";
import { Modal } from "./Modal.js";

/**
 * @param {{onClose: () => void}} props
 */
export const SettingsModal = ({ onClose }) => {
  return html`
    <${Modal} title="Settings" onClose=${onClose}>
    </${Modal}>
  `;
};
