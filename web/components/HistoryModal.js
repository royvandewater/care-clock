import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { Modal } from "./Modal.js";
import { UnsyncedActivities } from "./UnsyncedActivities.js";
import { SyncedActivitiesList } from "./SyncedActivitiesList.js";
import { EditActivityModal } from "./EditActivityModal.js";

/**
 * @param {{database: IDBDatabase, onClose: () => void}} props
 */
export const HistoryModal = ({ database, onClose }) => {
  const editActivityId = useSignal(null);

  if (editActivityId.value) {
    return html`<${EditActivityModal} database=${database} activityId=${editActivityId.value} onClose=${() => (editActivityId.value = null)} />`;
  }

  return html`<${Modal} title=${html`<h1 class="text-2xl font-bold">History</h1>`} onClose=${onClose} class="gap-y-10">
    <${UnsyncedActivities} database=${database} />
    <${SyncedActivitiesList} database=${database} onEditActivity=${(id) => (editActivityId.value = id)} />
  </${Modal}>`;
};
