import { useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";

import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Label, LabelLike } from "@/components/Label";
import { TextArea } from "@/components/TextArea";
import { HistoryButton } from "@/components/HistoryButton";
import { HistoryModal } from "@/components/HistoryModal";
import { CamperModal } from "@/components/CampersModal";
import { SessionTypeModal } from "@/components/SessionTypeModal";
import { SettingsModal } from "@/components/SettingsModal";

import { startActivity } from "@/data/startActivity";
import { upsertActivity } from "@/data/upsertActivity";
import { hasUnsynchronizedActivities } from "@/data/hasUnsynchronizedActivities";
import { blankActivity, useActivity } from "@/data/useActivity";
import type { SessionType } from "@/data/sessionTypes";
import { useTheme } from "@/data/useTheme";
import { shouldClearGroup } from "@/data/shouldClearGroup";
import { shouldClearWithWho } from "@/data/shouldClearWithWho";

import { formatElapsedTime } from "@/formatElapsedTime";
import { cn } from "@/cn";
import { assert } from "@/assert";
import { GroupOrWithWho } from "@/components/GroupOrWithWho";
import { SettingsButton } from "../components/SettingsButton";

export const Timer = ({ database }: { database: IDBDatabase }) => {
  const activity = useActivity();
  const theme = useTheme();
  const isRunning = Boolean(activity.value.startTime);

  const [controlsDisabled, setControlsDisabled] = useState(false);

  const showSettingsModal = useSignal(false);
  const showCamperModal = useSignal(false);
  const showSessionTypeModal = useSignal(false);
  const showHistoryModal = useSignal(false);
  const hasNotifications = useSignal(false);

  useEffect(() => {
    const interval = setInterval(() => (activity.value = { ...activity.value, endTime: new Date() }), 1000);

    return () => clearInterval(interval);
  }, []);

  const startTimer = async () => {
    setControlsDisabled(true);
    activity.value = await startActivity({ database }, activity.value);
    setControlsDisabled(false);
  };

  const stopTimer = async () => {
    setControlsDisabled(true);
    await upsertActivity({ database }, activity.value);

    activity.value = {
      ...blankActivity,
      therapistName: activity.value.therapistName,
    };
    setControlsDisabled(false);
  };

  useEffect(() => {
    const updateHasNotifications = async () => {
      hasNotifications.value = await hasUnsynchronizedActivities({ database });
    };
    updateHasNotifications();

    database.addEventListener("activities:changed", updateHasNotifications);
    return () => database.removeEventListener("activities:changed", updateHasNotifications);
  }, [database]);

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRunning) return stopTimer();
    startTimer();
  };

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
                // TODO: There's a problem here where if a camper is removed while a timer is running, that camper's session will never
                // be stopped. Maybe we should flag that on the history modal?
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

            <div class="text-center">
              <div class={cn("text-4xl font-mono font-bold mb-2", isRunning ? "" : "opacity-50")}>
                {formatElapsedTime(activity.value.startTime, activity.value.endTime)}
              </div>
              <div class="space-x-2">
                <Button
                  disabled={isRunning || !activity.value.campers.length || !activity.value.therapistName}
                  aria-label="Start Timer"
                >
                  Start
                </Button>
                <Button disabled={!isRunning} variant="secondary" aria-label="Stop Timer">
                  Stop
                </Button>
              </div>
              <div class="pt-4">
                {!activity.value.therapistName && (
                  <div class="text-center text-secondary">
                    Cannot start timer without a therapist name. The therapist name is configured using the settings
                    button on the top left.
                  </div>
                )}
                {!activity.value.campers.length && (
                  <div class="text-center text-secondary">Cannot start timer without campers</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </fieldset>
    </form>
  );
};
