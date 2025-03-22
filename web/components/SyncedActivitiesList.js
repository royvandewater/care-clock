import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { getSyncedActivities } from "../data/database.js";

/**
 * @param {{database: IDBDatabase}} props
 */
export const SyncedActivitiesList = ({ database }) => {
  const activities = useSignal([]);

  useEffect(() => {
    const updateActivities = async () => {
      activities.value = await getSyncedActivities(database);
    };
    updateActivities();

    database.addEventListener("activities:changed", updateActivities);
    return () => database.removeEventListener("activities:changed", updateActivities);
  }, [database]);

  return html`<ul>
    ${activities.value.map((activity) => html`<${Activity} activity=${activity} />`)}
  </ul>`;
};

const Activity = ({ activity }) => {
  return html`<li>
    <div class="flex justify-between items-center py-2">
      <div>
        <h2 class="text-sm">${activity.camperName}</h3>
        <h3 class="text-xs text-foreground-secondary">${new Date(activity.startTime).toLocaleString()}</h2>
      </div>
    </div>
  </li>`;
};
