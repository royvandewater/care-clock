import { html } from "htm/preact";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { upsertActivity } from "@/data/upsertActivity";
import { getActivitesThatAreNotSynced } from "../data/database.js";
import { Syncing } from "./icons/Syncing.js";
import { Edit } from "./icons/Edit.js";
import { Button } from "@/components/Button";
import { Unsynced } from "./icons/Unsynced.js";
import type { Activity } from "@/data/serialization.js";
import type { SyncState } from "@/data/syncStates.js";

export const UnsyncedActivities = ({ database, onEditActivity }: { database: IDBDatabase; onEditActivity: (id: string) => void }) => {
  const unSyncedActivities = useSignal<Activity[]>([]);

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
      upsertActivity(
        { database },
        {
          ...activity,
          campers: [{ name: activity.camperName, id: activity.id }],
        },
      );
    });
  };

  return html`
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center text-lg font-bold">Unsynced Activities</h2>
      <ul class="divide-solid divide-y-1 divide-input-border">
        ${unSyncedActivities.value.map((activity) => html`<${ActivityRow} activity=${activity} onEditActivity=${onEditActivity} />`)}
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

const ActivityRow = ({ activity, onEditActivity }: { activity: Activity; onEditActivity: (id: string) => void }) => {
  const startTime = activity.startTime ? new Date(activity.startTime).toLocaleString() : "UNKNOWN";

  return html`<li onClick=${() => onEditActivity(activity.id)}>
    <div class="flex justify-between items-center py-2">
      <div>
        <h2 class="text-sm">${activity.camperName}</h3>
        <h3 class="text-xs text-foreground-secondary">${startTime}</h2>
      </div>
      <span class="flex gap-x-2 items-center">
        <${SyncState} syncState=${activity.syncState} />
        <${Button} variant="tertiary" size="xs" type="button"><${Edit} /></${Button}>
      </span>
    </div>
  </li>`;
};

const SyncState = ({ syncState }: { syncState: SyncState }) => {
  if (syncState === "syncing") {
    return html`<${Syncing} />`;
  }

  if (syncState === "unsynced") {
    return html`<${Unsynced} />`;
  }

  throw new Error(`Unhandled sync state: ${syncState}`);
};
