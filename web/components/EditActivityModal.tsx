import { useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";

import { getActivityFromIndexedDB } from "@/data/database";
import { upsertActivity } from "@/data/upsertActivity";
import { deleteActivity } from "@/data/deleteActivity";

import { Modal } from "@/components/Modal";
import { Label, LabelLike } from "@/components/Label";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SessionTypeModal } from "@/components/SessionTypeModal";
import { TextArea } from "@/components/TextArea";
import { CharCounter } from "@/components/CharCounter";
import type { Activity } from "@/data/serialization";
import { assert } from "@/assert";
import type { SessionType } from "@/data/sessionTypes";
import { shouldClearGroup } from "@/data/shouldClearGroup";
import { shouldClearWithWho } from "@/data/shouldClearWithWho";
import { GroupOrWithWho } from "@/components/GroupOrWithWho";
import { therapists } from "@/data/therapists";
import { cn } from "@/cn";
import { dateStrFromDate } from "@/data/dateStrFromDate";
import { timeStrFromDate } from "@/data/timeStrFromDate";
import { combineDateAndTime } from "@/data/combineDateAndTime";
import { getDatetimeWarning } from "@/data/getDatetimeWarning";
import { ConfirmModal } from "@/components/ConfirmModal";

export const EditActivityModal = ({
  database,
  activityId,
  onClose,
}: {
  database: IDBDatabase;
  activityId: string;
  onClose: () => void;
}) => {
  const activity = useSignal<Activity | null>(null);
  const showSessionTypeModal = useSignal(false);
  const showConfirmWarningModal = useSignal(false);
  const showConfirmDeleteModal = useSignal(false);
  const [controlsDisabled, setControlsDisabled] = useState(false);

  useEffect(() => {
    const refreshActivity = async () => {
      activity.value = await getActivityFromIndexedDB(database, activityId);
    };
    refreshActivity();
    database.addEventListener("activities:changed", refreshActivity);
    return () => database.removeEventListener("activities:changed", refreshActivity);
  }, [activityId]);

  const saveActivity = async () => {
    assert(activity.value);

    setControlsDisabled(true);
    await upsertActivity(
      { database },
      {
        ...activity.value,
        campers: [{ name: activity.value.camperName, id: activity.value.id }],
      },
    );
    setControlsDisabled(false);
    onClose();
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    assert(activity.value);

    const submitWarning = getDatetimeWarning(activity.value.startTime, activity.value.endTime);
    if (submitWarning) {
      showConfirmWarningModal.value = true;
      return;
    }

    await saveActivity();
  };

  const header = <h1 class="text-2xl font-bold">Edit Activity</h1>;

  if (!activity.value) return <Modal title={header} onClose={onClose} className="gap-y-10" />;

  assert(activity.value.startTime);

  const warning = getDatetimeWarning(activity.value.startTime, activity.value.endTime);

  if (showConfirmDeleteModal.value) {
    return (
      <ConfirmModal
        message="Delete this activity? This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        disabled={controlsDisabled}
        onClose={() => (showConfirmDeleteModal.value = false)}
        onConfirm={async () => {
          setControlsDisabled(true);
          try {
            await deleteActivity({ database }, activityId);
          } catch (error) {
            setControlsDisabled(false);
            console.warn("Failed to delete activity", String(error));
            self.alert("Failed to delete activity. Please try again.");
            return;
          }
          showConfirmDeleteModal.value = false;
          onClose();
        }}
      />
    );
  }

  if (showConfirmWarningModal.value && warning) {
    return (
      <ConfirmModal
        message={`${warning}. Save anyway?`}
        confirmLabel="Save anyway"
        onClose={() => (showConfirmWarningModal.value = false)}
        onConfirm={async () => {
          showConfirmWarningModal.value = false;
          await saveActivity();
        }}
      />
    );
  }

  if (showSessionTypeModal.value) {
    return (
      <SessionTypeModal
        onClose={() => (showSessionTypeModal.value = false)}
        onSelect={(sessionType: SessionType) => {
          assert(activity.value, "Activity was not defined in onSelect SessionType");

          if (shouldClearGroup(activity.value.sessionType, sessionType)) {
            activity.value = { ...activity.value, groupName: "" };
          }
          if (shouldClearWithWho(activity.value.sessionType, sessionType)) {
            activity.value = { ...activity.value, withWho: "" };
          }

          activity.value = { ...activity.value, sessionType };
        }}
      />
    );
  }

  return (
    <Modal title={header} onClose={onClose} className="gap-y-10">
      <form onSubmit={onSubmit} class="flex flex-col gap-4">
        <fieldset disabled={controlsDisabled} className="flex flex-col gap-4">
          <Label>
            Therapist
            <select
              id="therapistName"
              value={activity.value.therapistName}
              onChange={(e: Event) => {
                assert(e.target instanceof HTMLSelectElement);
                assert(activity.value);
                activity.value = { ...activity.value, therapistName: e.target.value };
              }}
              autoFocus={!Boolean(activity.value.therapistName)}
              className={cn(
                "flex h-10 w-full rounded-md border border-input-border bg-input-background px-3 py-2 text-sm ring-offset-background text-foreground font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-input-border-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:border-gray-200",
              )}
            >
              <option value="" disabled>
                Select a therapist
              </option>
              {therapists.map((therapist) => (
                <option value={therapist}>{therapist}</option>
              ))}
            </select>
          </Label>

          <Label>
            Camper
            <Input
              value={activity.value.camperName}
              onInput={(e: InputEvent) => {
                assert(activity.value, "Activity was undefined in Camper onInput");
                assert(e.target instanceof HTMLInputElement);
                activity.value = { ...activity.value, camperName: e.target.value };
              }}
            />
          </Label>

          <LabelLike onClick={() => (showSessionTypeModal.value = true)}>
            Session Type
            <div class="flex justify-between items-center font-medium">
              {activity.value.sessionType}
              <Button type="button" variant="outline" size="sm">
                Change
              </Button>
            </div>
          </LabelLike>

          <GroupOrWithWho
            sessionType={activity.value.sessionType}
            groupName={activity.value.groupName}
            onChangeGroupName={(groupName: string) => {
              assert(activity.value, "Activity was not defined in onChangeGroupName");
              activity.value = { ...activity.value, groupName };
            }}
            withWho={activity.value.withWho}
            onChangeWithWho={(withWho: string) => {
              assert(activity.value, "Activity was not defined in onChangeWithWho");
              activity.value = { ...activity.value, withWho };
            }}
          />

          <Label className="flex flex-col">
            Activity Description
            <TextArea
              value={activity.value.description}
              className="h-40"
              onInput={(e: InputEvent) => {
                assert(e.target instanceof HTMLTextAreaElement);
                assert(activity.value);
                activity.value = { ...activity.value, description: e.target.value };
              }}
              placeholder="Describe the current activity"
            />
            <CharCounter value={activity.value.description} max={140} />
          </Label>

          <div class="flex gap-4">
            <Label class="flex-1">
              Start Date
              <Input
                id="startDate"
                type="date"
                value={dateStrFromDate(activity.value.startTime)}
                onInput={(e: InputEvent) => {
                  assert(e.target instanceof HTMLInputElement);
                  assert(activity.value?.startTime);
                  const time = timeStrFromDate(activity.value.startTime);
                  const startTime = combineDateAndTime(e.target.value, time);

                  if (!startTime) return;

                  activity.value = { ...activity.value, startTime };
                }}
              />
            </Label>

            <Label class="flex-1">
              Start Time
              <Input
                id="startTime"
                type="time"
                value={timeStrFromDate(activity.value.startTime)}
                step="1"
                onInput={(e: InputEvent) => {
                  assert(e.target instanceof HTMLInputElement);
                  assert(activity.value?.startTime);
                  const date = dateStrFromDate(activity.value.startTime);
                  const startTime = combineDateAndTime(date, e.target.value);

                  if (!startTime) return;

                  activity.value = { ...activity.value, startTime };
                }}
              />
            </Label>
          </div>

          <div class="flex gap-4">
            <Label className="flex-1">
              End Date
              <Input
                id="endDate"
                type="date"
                value={dateStrFromDate(activity.value.endTime)}
                onInput={(e: InputEvent) => {
                  assert(e.target instanceof HTMLInputElement);
                  assert(activity.value);
                  const time = timeStrFromDate(activity.value.endTime);
                  const endTime = combineDateAndTime(e.target.value, time);

                  if (!endTime) return;

                  activity.value = { ...activity.value, endTime };
                }}
              />
            </Label>

            <Label className="flex-1">
              End Time
              <Input
                id="endTime"
                type="time"
                value={timeStrFromDate(activity.value.endTime)}
                step="1"
                onInput={(e: InputEvent) => {
                  assert(e.target instanceof HTMLInputElement);
                  assert(activity.value);
                  const date = dateStrFromDate(activity.value.endTime);
                  const endTime = combineDateAndTime(date, e.target.value);

                  if (!endTime) return;

                  activity.value = { ...activity.value, endTime };
                }}
              />
            </Label>
          </div>

          {warning && <div class="text-red-500">{warning}</div>}

          <Button type="submit" disabled={!activity.value.camperName || !activity.value.therapistName}>
            Save
          </Button>

          <Button type="button" variant="danger" onClick={() => (showConfirmDeleteModal.value = true)}>
            Delete
          </Button>
        </fieldset>
      </form>
    </Modal>
  );
};
