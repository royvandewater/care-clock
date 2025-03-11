import { html } from "htm/preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { upsertActivity } from "../data/upsertActivity.js";
import { getActivitesThatAreNotSynced } from "../data/database.js";
import { Close } from "./icons/Close.js";
import { Syncing } from "./icons/Syncing.js";
import { Unsynced } from "./icons/Unsynced.js";

/**
 * @param {{database: IDBDatabase, onClose: () => void}} props
 */
export const NotificationsModal = ({ database, onClose }) => {
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

  return html`<div class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm p-4" onClick=${onClose}>
    <div class="mx-auto max-w-md w-full h-full shadow-lg bg-background p-4 rounded-lg flex flex-col gap-4" onClick=${(e) => e.stopPropagation()}>
      <header class="text-center relative">
        <h1 class="text-2xl font-bold">Unsynchronized</h1>
        <button class="size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl absolute top-0 right-0" onClick=${onClose}>
          <${Close} />
        </button>
      </header>
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
    </div>
  </div>`;
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
