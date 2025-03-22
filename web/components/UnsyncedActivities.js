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
    const updateUnsyncedActivities = async () => {
      unSyncedActivities.value = await getActivitesThatAreNotSynced(database);
    };
    updateUnsyncedActivities();

    database.addEventListener("activities:changed", updateUnsyncedActivities);
    return () => database.removeEventListener("activities:changed", updateUnsyncedActivities);
  }, []);

  const onSyncAll = () => {
    unSyncedActivities.value.forEach((activity) => {
      upsertActivity({ database }, activity);
    });
  };

  return html`
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center text-lg font-bold">Unsynced Activities</h2>
      <ul class="divide-solid divide-y-1 divide-input-border">
        ${unSyncedActivities.value.map((activity) => html`<${Activity} activity=${activity} />`)}
        ${unSyncedActivities.value.length === 0 && html`<li class="text-foreground-secondary text-center">All activities are uploaded.</li>`}
      </ul>
      <button
        class="bg-primary text-primary-foreground p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        onClick=${onSyncAll}
        disabled=${unSyncedActivities.value.length === 0}
      >
        Upload All Unsynced Activities
      </button>
    </div>
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
