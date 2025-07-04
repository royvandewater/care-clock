import { Button } from "@/components/Button";
import { CamperModal } from "@/components/CampersModal";
import { Card, CardContent } from "@/components/Card";
import { GroupOrWithWho } from "@/components/GroupOrWithWho";
import { HistoryButton } from "@/components/HistoryButton";
import { HistoryModal } from "@/components/HistoryModal";
import { Label, LabelLike } from "@/components/Label";
import { SessionTypeModal } from "@/components/SessionTypeModal";
import { SettingsButton } from "@/components/SettingsButton";
import { SettingsModal } from "@/components/SettingsModal";
import { TextArea } from "@/components/TextArea";
import type { SessionType } from "@/data/sessionTypes";
import { shouldClearGroup } from "@/data/shouldClearGroup";
import { shouldClearWithWho } from "@/data/shouldClearWithWho";
import { blankActivity, useActivity } from "@/data/useActivity";
import { useTheme } from "@/data/useTheme";
import { useSignal } from "@preact/signals";
import { assert } from "@/assert";
import { Input } from "@/components/Input";
import { dateStrFromDate } from "@/data/dateStrFromDate";
import { timeStrFromDate } from "@/data/timeStrFromDate";
import { combineDateAndTime } from "@/data/combineDateAndTime";
import { getDatetimeWarning } from "@/data/getDatetimeWarning";
import { useEffect } from "preact/hooks";
import { roundDateToHour } from "@/data/roundDateToHour";
import { upsertActivity } from "@/data/upsertActivity";

export const Home = ({ database }: { database: IDBDatabase }) => {
  const activity = useActivity();
  const theme = useTheme();
  const showSettingsModal = useSignal(false);
  const controlsDisabled = useSignal(false);
  const hasNotifications = useSignal(false);
  const showHistoryModal = useSignal(false);
  const showCamperModal = useSignal(false);
  const showSessionTypeModal = useSignal(false);

  useEffect(() => {
    const now = roundDateToHour(new Date());

    activity.value = {
      ...activity.value,
      startTime: activity.value.startTime ?? now,
      endTime: activity.value.endTime ?? now,
    };
  }, []);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    controlsDisabled.value = true;
    await upsertActivity({ database }, activity.value);
    const now = roundDateToHour(new Date());
    activity.value = {
      ...blankActivity,
      therapistName: activity.value.therapistName,
      startTime: now,
      endTime: now,
    };
    controlsDisabled.value = false;
  };

  const warning = getDatetimeWarning(activity.value.startTime, activity.value.endTime);

  if (showSettingsModal.value) {
    return (
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <SettingsModal onClose={() => (showSettingsModal.value = false)} activity={activity} theme={theme} />
      </div>
    );
  }

  if (showHistoryModal.value) {
    return (
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <HistoryModal database={database} onClose={() => (showHistoryModal.value = false)} />
      </div>
    );
  }

  if (showCamperModal.value) {
    return (
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <CamperModal
          selectedCampers={activity.value.campers.map((camper) => camper.name)}
          onClose={() => (showCamperModal.value = false)}
          onSelectCampers={(campers: string[]) => {
            activity.value = {
              ...activity.value,
              campers: campers.sort().map((camper) => {
                const existingCamper = activity.value.campers.find((c) => c.name === camper);
                return { name: camper, id: existingCamper?.id ?? null };
              }),
            };
          }}
        />
      </div>
    );
  }

  if (showSessionTypeModal.value) {
    return (
      <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
        <SessionTypeModal
          onClose={() => (showSessionTypeModal.value = false)}
          onSelect={(sessionType: SessionType) => {
            if (shouldClearGroup(activity.value.sessionType, sessionType)) {
              activity.value = { ...activity.value, groupName: "" };
            }
            if (shouldClearWithWho(activity.value.sessionType, sessionType)) {
              activity.value = { ...activity.value, withWho: "" };
            }

            activity.value = { ...activity.value, sessionType };
          }}
        />
      </div>
    );
  }

  return (
    <form class="h-full max-w-md shadow-lg mx-auto p-4 space-y-6 flex flex-col gap-4 z-0" onSubmit={onSubmit}>
      <fieldset disabled={controlsDisabled} className="flex flex-col gap-4">
        <header class="text-center relative">
          <SettingsButton onClick={() => (showSettingsModal.value = true)} class="absolute top-0 left-4" />
          <h1 class="text-2xl font-bold text-primary">Care Clock</h1>
          <HistoryButton
            className="absolute top-0 right-4"
            hasNotifications={hasNotifications}
            onClick={() => (showHistoryModal.value = true)}
          />
        </header>

        <Card className="flex-1">
          <CardContent className="p-4 space-y-4 h-full flex flex-col">
            <div class="flex flex-col gap-4">
              <LabelLike onClick={() => (showCamperModal.value = true)}>
                Campers
                <div class="flex justify-between items-center font-medium">
                  <span class="text-sm font-medium text-foreground px-3">
                    {activity.value.campers.map((camper) => camper.name).join(", ") || "No campers selected"}
                  </span>
                  <Button type="button" variant="outline" size="sm" aria-label="Select Campers">
                    Select
                  </Button>
                </div>
              </LabelLike>

              <LabelLike onClick={() => (showSessionTypeModal.value = true)}>
                Session Type
                <div class="flex justify-between items-center font-medium">
                  <span class="text-sm font-medium text-foreground px-3">{activity.value.sessionType}</span>
                  <Button type="button" variant="outline" size="sm" aria-label="Select Session Type">
                    Select
                  </Button>
                </div>
              </LabelLike>
            </div>

            <GroupOrWithWho
              sessionType={activity.value.sessionType}
              groupName={activity.value.groupName}
              onChangeGroupName={(groupName: string) => (activity.value = { ...activity.value, groupName })}
              withWho={activity.value.withWho}
              onChangeWithWho={(withWho: string) => (activity.value = { ...activity.value, withWho })}
            />

            <Label className="flex flex-col">
              Activity Description
              <TextArea
                value={activity.value.description}
                className="h-40"
                onInput={(e: InputEvent) => {
                  assert(e.target instanceof HTMLTextAreaElement, "this onInput was not called on a textarea");
                  return (activity.value = { ...activity.value, description: e.target.value });
                }}
                placeholder="Describe the current activity"
              />
            </Label>

            <div class="flex gap-4">
              <Label className="flex-1">
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

              <Label className="flex-1">
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

            <div class="text-center">
              {!activity.value.therapistName && (
                <div class="text-center text-secondary">
                  Cannot save activity without a therapist name. The therapist name is configured using the settings
                  button on the top left.
                </div>
              )}
              {!activity.value.campers.length && (
                <div class="text-center text-secondary">Cannot save activity without campers</div>
              )}

              {warning && <div class="text-warning">{warning}</div>}
            </div>

            <Button type="submit" disabled={!activity.value.campers.length || !activity.value.therapistName}>
              Save
            </Button>
          </CardContent>
        </Card>
      </fieldset>
    </form>
  );
};
