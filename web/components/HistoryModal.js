import { html } from "htm/preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { upsertActivity } from "../data/upsertActivity.js";
import { getActivitesThatAreNotSynced } from "../data/database.js";
import { Syncing } from "./icons/Syncing.js";
import { Unsynced } from "./icons/Unsynced.js";
import { Modal } from "./Modal.js";

/**
 * @param {{database: IDBDatabase, onClose: () => void}} props
 */
export const HistoryModal = ({ database, onClose }) => {
  const activities = useSignal([]);

  useEffect(() => {
    getActivitesThatAreNotSynced(database).then((a) => (activities.value = a));
    const interval = setInterval(async () => (activities.value = await getActivitesThatAreNotSynced(database)), 1000);

    return () => clearInterval(interval);
  }, []);

  const onSyncAll = () => {
    activities.value.forEach((activity) => {
      upsertActivity({ database }, activity);
    });
  };

  return html`<${Modal} title=${html`<h1 class="text-2xl font-bold">History</h1>`} onClose=${onClose}>
    <ul class="divide-solid divide-y-1 divide-background-secondary p-4">
      ${activities.value.map((activity) => html`<${Activity} activity=${activity} />`)}
      ${activities.value.length === 0 && html`<li class="text-foreground-secondary text-center">All activities are uploaded.</li>`}
    </ul>
    <button
      class="bg-primary text-primary-foreground p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      onClick=${onSyncAll}
      disabled=${activities.value.length === 0}
    >
      Upload All
    </button>
  </${Modal}>`;
};

const Activity = ({ activity }) => {
  return html`<li>
    <div class="flex justify-between items-center py-2">
      <div>
        <h2 class="text-sm">${activity.camperName}</h3>
        <h3 class="text-xs text-foreground-secondary">${new Date(activity.startTime).toLocaleString()}</h2>
      </div>
      <${SyncState} syncState=${activity.syncState} />
    </div>
  </li>`;
};

const SyncState = ({ syncState }) => {
  if (syncState === "syncing") {
    return html`<${Syncing} />`;
  }

  if (syncState === "unsynced") {
    return html`<${Unsynced} />`;
  }

  throw new Error(`Unhandled sync state: ${syncState}`);
};
