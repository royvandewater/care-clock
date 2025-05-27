import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { getSyncedActivities } from "@/data/database";
import { Edit } from "@/components/Icons/Edit";
import { Button } from "@/components/Button";
import type { Activity } from "@/data/serialization.js";

export const SyncedActivitiesList = ({ database, onEditActivity }: { database: IDBDatabase; onEditActivity: (id: string) => void }) => {
  const activities = useSignal<Activity[]>([]);

  useEffect(() => {
    const updateActivities = async () => {
      activities.value = await getSyncedActivities(database);
    };
    updateActivities();

    database.addEventListener("activities:changed", updateActivities);
    return () => database.removeEventListener("activities:changed", updateActivities);
  }, [database]);

  return html` <div class="flex flex-col gap-y-4">
    <h2 class="text-center text-lg font-bold">Past Activities</h2>
    <ul class="divide-solid divide-y-1 divide-input-border">
      ${activities.value.map((activity) => html`<${ActivityRow} activity=${activity} onClickEdit=${onEditActivity} />`)}
    </ul>
  </div>`;
};

const ActivityRow = ({ activity, onClickEdit }: { activity: Activity; onClickEdit: (id: string) => void }) => {
  const startTime = activity.startTime ? new Date(activity.startTime).toLocaleString() : "UNKNOWN";

  return html`<li>
    <div class="flex justify-between items-center py-2" onClick=${() => onClickEdit(activity.id)}>
      <div>
        <h2 class="text-sm">${activity.camperName}</h3>
        <h3 class="text-xs text-foreground-secondary">${startTime}</h2>
      </div>
      <${Button} variant="tertiary" size="xs" type="button"><${Edit} /></${Button}>
    </div>
  </li>`;
};
