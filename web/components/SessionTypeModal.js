import { html } from "htm/preact";

import { Modal } from "./Modal.js";
import { Button } from "./Button.js";
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
            <${SelectButton} />
          </div>
        </li>`
      )}
    </ul>
  </${Modal}>`;
};

const Header = ({ onClickEdit }) => {
  return html`<button type="button" class="size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl absolute top-0 left-0" onClick=${onClickEdit}>
      <${Edit} />
    </button>
    <h1 class="text-2xl font-bold">Campers</h1> `;
};

const SelectButton = ({ onClick }) => {
  return html`<${Button} type="button" onClick=${onClick} size="xs">Select</${Button}>`;
};
