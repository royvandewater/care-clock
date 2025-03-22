import { html } from "htm/preact";
import { Modal } from "./Modal.js";
import { UnsyncedActivities } from "./UnsyncedActivities.js";
import { SyncedActivitiesList } from "./SyncedActivitiesList.js";

/**
 * @param {{database: IDBDatabase, onClose: () => void}} props
 */
export const HistoryModal = ({ database, onClose }) => {
  return html`<${Modal} title=${html`<h1 class="text-2xl font-bold">History</h1>`} onClose=${onClose} class="gap-y-10">
    <${UnsyncedActivities} database=${database} />
    <${SyncedActivitiesList} database=${database} />
  </${Modal}>`;
};
