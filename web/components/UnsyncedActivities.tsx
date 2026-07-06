import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { batchUpsertActivities } from "@/data/batchUpsertActivities";
import { getActivitesThatAreNotSynced, getAllActivities } from "@/data/database";
import { Syncing } from "@/components/icons/Syncing";
import { Edit } from "@/components/icons/Edit";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Unsynced } from "@/components/icons/Unsynced";
import type { Activity } from "@/data/serialization";
import type { SyncState } from "@/data/syncStates";

export const UnsyncedActivities = ({
  database,
  onEditActivity,
}: {
  database: IDBDatabase;
  onEditActivity: (id: string) => void;
}) => {
  const unSyncedActivities = useSignal<Activity[]>([]);
  const showForceSyncConfirm = useSignal(false);

  useEffect(() => {
    const updateUnsyncedActivities = async () => {
      unSyncedActivities.value = await getActivitesThatAreNotSynced(database);
    };
    updateUnsyncedActivities();

    database.addEventListener("activities:changed", updateUnsyncedActivities);
    return () => database.removeEventListener("activities:changed", updateUnsyncedActivities);
  }, []);

  const onSyncAll = () => {
    batchUpsertActivities({ database }, unSyncedActivities.value);
  };

  const onForceSyncAll = async () => {
    const activities = await getAllActivities(database);
    showForceSyncConfirm.value = false;
    batchUpsertActivities({ database }, activities);
  };

  if (showForceSyncConfirm.value) {
    return (
      <ConfirmModal
        title="Force Sync All Activities"
        message="This re-uploads every activity, even ones already synced. It will OVERWRITE any edits made directly in the spreadsheet and RECREATE any activities that were deleted from it. Continue?"
        confirmLabel="Force Sync All"
        confirmVariant="danger"
        onClose={() => (showForceSyncConfirm.value = false)}
        onConfirm={onForceSyncAll}
      />
    );
  }

  return (
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center text-lg font-bold">Unsynced Activities</h2>
      <ul class="divide-solid divide-y-1 divide-input-border">
        {unSyncedActivities.value.map((activity) => (
          <ActivityRow activity={activity} onEditActivity={onEditActivity} />
        ))}
        {unSyncedActivities.value.length === 0 && (
          <li class="text-foreground-secondary text-center">All activities are uploaded.</li>
        )}
      </ul>
      <button
        class="bg-primary text-primary-foreground p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        onClick={onSyncAll}
        disabled={unSyncedActivities.value.length === 0}
      >
        Upload All Unsynced Activities
      </button>
      <Button type="button" variant="danger" onClick={() => (showForceSyncConfirm.value = true)}>
        Force Sync All Activities
      </Button>
    </div>
  );
};

const ActivityRow = ({ activity, onEditActivity }: { activity: Activity; onEditActivity: (id: string) => void }) => {
  const startTime = activity.startTime ? new Date(activity.startTime).toLocaleString() : "UNKNOWN";

  return (
    <li onClick={() => onEditActivity(activity.id)}>
      <div class="flex justify-between items-center py-2">
        <div>
          <h2 class="text-sm">{activity.camperName}</h2>
          <h3 class="text-xs text-foreground-secondary">{startTime}</h3>
        </div>
        <span class="flex gap-x-2 items-center">
          <SyncState syncState={activity.syncState} />
          <Button variant="tertiary" size="xs" type="button">
            <Edit />
          </Button>
        </span>
      </div>
    </li>
  );
};

const SyncState = ({ syncState }: { syncState: SyncState }) => {
  if (syncState === "syncing") {
    return <Syncing />;
  }

  if (syncState === "unsynced") {
    return <Unsynced />;
  }

  throw new Error(`Unhandled sync state: ${syncState}`);
};
