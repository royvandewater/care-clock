import { html } from "htm/preact";
import { useSignal, useSignalEffect } from "@preact/signals";

import { Modal } from "./Modal.js";
import { Label } from "./Label.js";
import { Input } from "./Input.js";
import { Button } from "./Button.js";
import { Trash } from "./icons/Trash.js";

export const CamperModal = ({ onClose, onSelect }) => {
  const campers = useSignal(JSON.parse(localStorage.getItem("campers") ?? "[]"));
  useSignalEffect(() => localStorage.setItem("campers", JSON.stringify(campers.value)));

  return html`<${Modal} title="Campers" onClose=${onClose}>
    <ul class="flex flex-col gap-2">
      ${campers.value.map((camper, i) => {
        return html`<${Camper}
          camper=${camper}
          onSelect=${() => {
            onSelect(camper);
            onClose();
          }}
          onRemove=${() => (campers.value = campers.value.toSpliced(i, 1))}
        />`;
      })}
    </ul>

    <${NewCamperForm} onAdd=${(name) => (campers.value = [...campers.value, name].sort())} />
  </${Modal}>`;
};

const Camper = ({ camper, onRemove, onSelect }) => {
  return html`<li>
    <div class="flex justify-between items-center">
      <span>${camper}</span>
      <div class="flex gap-2">
        <${Button} type="button" onClick=${onSelect}  size="xs">
          Select
        </${Button}>
        <${Button} type="button" onClick=${onRemove} variant="danger" size="xs">
          <${Trash} class="size-4" />
        </${Button}>
      </div>
    </div>
  </li>`;
};

const NewCamperForm = ({ onAdd }) => {
  const name = useSignal("");

  const onSubmit = (e) => {
    e.preventDefault();
    onAdd(name.value);
    name.value = "";
  };

  return html`<form onSubmit=${onSubmit} class="flex items-end gap-4">
    <${Label} class="flex-1">Camper Name
      <${Input} type="text" name="name" value=${name} onInput=${(e) => (name.value = e.target.value)} />
    </${Label}>
    <${Button} type="submit">Add</${Button}>
  </form>`;
};
