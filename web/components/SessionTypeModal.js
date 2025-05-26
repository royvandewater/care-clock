import { html } from "htm/preact";

import { Modal } from "./Modal.js";
import { Button } from "@/components/Button";
import { Edit } from "./icons/Edit.js";

import { sessionTypes } from "../data/sessionTypes.js";

export const SessionTypeModal = ({ onClose, onSelect }) => {
  const onSelectSessionType = (sessionType) => {
    onSelect(sessionType);
    onClose();
  };

  return html`<${Modal} title=${html`<${Header} onClickEdit=${() => (editMode.value = !editMode.value)} />`} onClose=${onClose}>
    <ul class="flex flex-col divide-y-1 divide-secondary/40">
      ${sessionTypes.map(
        (sessionType) => html`<li>
          <div class="flex justify-between items-center p-2" onClick=${() => onSelectSessionType(sessionType)}>
            <span>${sessionType}</span>
            <${SelectButton} sessionType=${sessionType} />
          </div>
        </li>`
      )}
    </ul>
  </${Modal}>`;
};

const Header = ({ onClickEdit }) => {
  return html` <h1 class="text-2xl font-bold">Session Type</h1> `;
};

const SelectButton = ({ onClick, sessionType }) => {
  return html`<${Button} type="button" onClick=${onClick} size="xs" aria-label=${`Select ${sessionType}`}>Select</${Button}>`;
};
