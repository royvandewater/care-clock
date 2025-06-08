import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { Modal } from "@/components/Modal";
import { UnsyncedActivities } from "@/components/UnsyncedActivities";
import { SyncedActivitiesList } from "@/components/SyncedActivitiesList";
import { EditActivityModal } from "@/components/EditActivityModal";

export const HistoryModal = ({ database, onClose }: { database: IDBDatabase; onClose: () => void }) => {
  const editActivityId = useSignal<string | null>(null);

  if (editActivityId.value) {
    return html`<${EditActivityModal} database=${database} activityId=${editActivityId.value} onClose=${() => (editActivityId.value = null)} />`;
  }

  return html`<${Modal} title=${html`<h1 class="text-2xl font-bold">History</h1>`} onClose=${onClose} className="gap-y-10">
    <${UnsyncedActivities} database=${database} onEditActivity=${(id: string) => (editActivityId.value = id)} />
    <${SyncedActivitiesList} database=${database} onEditActivity=${(id: string) => (editActivityId.value = id)} />
  </${Modal}>`;
};
