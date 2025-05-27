import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { Modal } from "./Modal.js";
import { UnsyncedActivities } from "./UnsyncedActivities.js";
import { SyncedActivitiesList } from "@/components/SyncedActivitiesList";
import { EditActivityModal } from "./EditActivityModal.js";

export const HistoryModal = ({ database, onClose }: { database: IDBDatabase; onClose: () => void }) => {
  const editActivityId = useSignal<string | null>(null);

  if (editActivityId.value) {
    return html`<${EditActivityModal} database=${database} activityId=${editActivityId.value} onClose=${() => (editActivityId.value = null)} />`;
  }

  return html`<${Modal} title=${html`<h1 class="text-2xl font-bold">History</h1>`} onClose=${onClose} class="gap-y-10">
    <${UnsyncedActivities} database=${database} onEditActivity=${(id: string) => (editActivityId.value = id)} />
    <${SyncedActivitiesList} database=${database} onEditActivity=${(id: string) => (editActivityId.value = id)} />
  </${Modal}>`;
};
