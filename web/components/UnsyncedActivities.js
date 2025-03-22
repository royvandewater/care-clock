import { html } from "htm/preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { upsertActivity } from "../data/upsertActivity.js";
import { getActivitesThatAreNotSynced } from "../data/database.js";
import { Syncing } from "./icons/Syncing.js";
import { Unsynced } from "./icons/Unsynced.js";

export const UnsyncedActivities = ({ database }) => {
  const unSyncedActivities = useSignal([]);

  useEffect(() => {
    getActivitesThatAreNotSynced(database).then((a) => (unSyncedActivities.value = a));
    const interval = setInterval(async () => (unSyncedActivities.value = await getActivitesThatAreNotSynced(database)), 1000);

    return () => clearInterval(interval);
  }, []);

  const onSyncAll = () => {
    unSyncedActivities.value.forEach((activity) => {
      upsertActivity({ database }, activity);
    });
  };

  return html`
    <ul class="divide-solid divide-y-1 divide-background-secondary p-4">
      ${unSyncedActivities.value.map((activity) => html`<${Activity} activity=${activity} />`)}
      ${unSyncedActivities.value.length === 0 && html`<li class="text-foreground-secondary text-center">All activities are uploaded.</li>`}
    </ul>
    <button
      class="bg-primary text-primary-foreground p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      onClick=${onSyncAll}
      disabled=${unSyncedActivities.value.length === 0}
    >
      Upload All
    </button>
  `;
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
