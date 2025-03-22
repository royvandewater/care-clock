import { html } from "htm/preact";
import { useSignal, useSignalEffect } from "@preact/signals";

import { Modal } from "./Modal.js";
import { Label } from "./Label.js";
import { Input } from "./Input.js";
import { Button } from "./Button.js";
import { Trash } from "./icons/Trash.js";
import { Edit } from "./icons/Edit.js";

/**
 * @param {{onClose: () => void, onSelect: (camper: string) => void}} props
 */
export const CamperModal = ({ onClose, onSelect }) => {
  const campers = useSignal(JSON.parse(localStorage.getItem("campers") ?? "[]"));
  useSignalEffect(() => localStorage.setItem("campers", JSON.stringify(campers.value)));

  const editMode = useSignal(false);

  return html`<${Modal} title=${html`<${Header} onClickEdit=${() => (editMode.value = !editMode.value)} />`} onClose=${onClose}>
    ${editMode.value && html`<${NewCamperForm} onAdd=${(name) => (campers.value = [...campers.value, name].sort())} />`}

    <ul class="flex flex-col divide-y-1 divide-secondary/40">
      ${campers.value.length === 0 && html`<li class="text-center text-secondary pt-10">Use the edit button on the top left to add a camper</li>`}
      ${campers.value.map((camper, i) => {
        return html`<${Camper}
          camper=${camper}
          editMode=${editMode}
          onSelect=${() => {
            onSelect(camper);
            onClose();
          }}
          onRemove=${() => (campers.value = campers.value.toSpliced(i, 1))}
        />`;
      })}
    </ul>
  </${Modal}>`;
};

const Header = ({ onClickEdit }) => {
  return html`<button type="button" class="size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl absolute top-4 right-6" onClick=${onClickEdit}>
      <${Edit} />
    </button>
    <h1 class="text-2xl font-bold">Campers</h1> `;
};

const Camper = ({ camper, editMode, onRemove, onSelect }) => {
  const onClickRemove = (e) => {
    e.stopPropagation();
    onRemove();
  };

  const onClickSelect = (e) => {
    if (editMode.value) return;
    e.stopPropagation();
    onSelect();
  };

  return html`<li>
    <div class="flex justify-between items-center p-2" onClick=${onClickSelect}>
      <span>${camper}</span>
      <div class="flex gap-2">${editMode.value ? html`<${RemoveButton} onClick=${onClickRemove} />` : html`<${SelectButton} />`}</div>
    </div>
  </li>`;
};

const RemoveButton = ({ onClick }) => {
  return html`<${Button} type="button" onClick=${onClick} variant="danger" size="xs">
    <${Trash} class="size-4" />
  </${Button}>`;
};

const SelectButton = ({ onClick }) => {
  return html`<${Button} type="button" onClick=${onClick} size="xs">Select</${Button}>`;
};

const NewCamperForm = ({ onAdd }) => {
  const name = useSignal("");

  const onSubmit = (e) => {
    e.preventDefault();
    onAdd(name.value);
    name.value = "";
  };

  return html`<form onSubmit=${onSubmit} class="flex items-end gap-4 pb-8">
    <${Label} class="flex-1">Camper Name
      <${Input} type="text" name="name" value=${name} onInput=${(e) => (name.value = e.target.value)} />
    </${Label}>
    <${Button} type="submit">Add</${Button}>
  </form>`;
};
