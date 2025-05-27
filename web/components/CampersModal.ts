import { html } from "htm/preact";
import { Signal, useSignal } from "@preact/signals";

import { Modal } from "./Modal.js";
import { Label } from "@/components/Label";
import { Input } from "./Input.js";
import { Button } from "@/components/Button";
import { Trash } from "./icons/Trash.js";
import { Edit } from "@/components/icons/Edit";

import { useAvailableCampers } from "../data/useAvailableCampers.js";
import { assert } from "@/assert";

export const CamperModal = ({ onClose, selectedCampers, onSelectCampers }: { onClose: () => void; selectedCampers: string[]; onSelectCampers: (campers: string[]) => void }) => {
  const campers = useAvailableCampers();

  const editMode = useSignal(false);
  const onClickClose = () => {
    if (editMode.value) {
      editMode.value = false;
      return;
    }

    onClose();
  };

  return html`<${Modal} title=${html`<${Header} onClickEdit=${() => (editMode.value = !editMode.value)} />`} onClose=${onClickClose}>
    ${editMode.value && html`<${NewCamperForm} onAdd=${(name) => (campers.value = [...campers.value, name].sort())} />`}

    <ul class="flex flex-col divide-y-1 divide-secondary/40">
      ${campers.value.length === 0 && html`<li class="text-center text-secondary pt-10">Use the edit button on the top right to add a camper</li>`}
      ${campers.value.map((camper, i) => {
        return html`<${Camper}
          camper=${camper}
          editMode=${editMode}
          selected=${selectedCampers.includes(camper)}
          onSelect=${(selected) => {
            if (selected) {
              onSelectCampers([...selectedCampers, camper]);
            } else {
              onSelectCampers(selectedCampers.filter((c) => c !== camper));
            }
          }}
          onRemove=${() => (campers.value = campers.value.toSpliced(i, 1))}
        />`;
      })}
    </ul>
  </${Modal}>`;
};

const Header = ({ onClickEdit }: { onClickEdit: () => void }) => {
  return html`
    <h1 class="text-2xl font-bold">Campers</h1>
    <button
      type="button"
      aria-label="Edit Campers"
      class="size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl absolute top-4 right-6"
      onClick=${onClickEdit}
    >
      <${Edit} />
    </button>
  `;
};

const Camper = ({
  camper,
  editMode,
  selected,
  onRemove,
  onSelect,
}: {
  camper: string;
  editMode: Signal<boolean>;
  selected: boolean;
  onRemove: () => void;
  onSelect: (selected: boolean) => void;
}) => {
  const onClickRemove = (e: Event) => {
    e.stopPropagation();
    onRemove();
  };

  const onClickSelect = (e) => {
    e.stopPropagation();
    onSelect(e.target.checked);
  };

  if (editMode.value) {
    return html`<li>
      <div class="flex justify-between items-center p-2">
        <span>${camper}</span>
        <div class="flex gap-2"><${RemoveButton} onClick=${onClickRemove} /></div>
      </div>
    </li>`;
  }

  return html`<li>
    <label class="flex justify-between items-center py-2 px-4">
      <span>${camper}</span>
      <input
        type="checkbox"
        class="size-4 rounded-md border border-input-border bg-input-background px-3 py-2 text-sm ring-offset-background text-foreground font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-input-border-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:border-gray-200"
        checked=${selected}
        onChange=${onClickSelect}
      />
    </label>
  </li>`;
};

const RemoveButton = ({ onClick }: { onClick: () => void }) => {
  return html`<${Button} type="button" onClick=${onClick} variant="danger" size="xs">
    <${Trash} class="size-4" />
  </${Button}>`;
};

const NewCamperForm = ({ onAdd }: { onAdd: (name: string) => void }) => {
  const name = useSignal("");

  const onSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    onAdd(name.value);
    name.value = "";
  };

  const onInput = (e: InputEvent) => {
    assert(e.target instanceof HTMLInputElement, "Input event target must be an HTMLInputElement");
    name.value = e.target.value;
  };

  return html`<form onSubmit=${onSubmit} class="flex items-end gap-4 pb-8">
    <${Label} class="flex-1">
      Camper Name
      <${Input} type="text" name="name" value=${name} onInput=${onInput} />
    </${Label}>
    <${Button} type="submit">Add</${Button}>
  </form>`;
};
