import { Signal } from "@preact/signals";
import { Modal } from "@/components/Modal";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import { assert } from "@/assert";
import { therapists } from "@/data/therapists";
import { cn } from "@/cn";

export const SettingsModal = ({
  onClose,
  activity,
  theme,
}: {
  onClose: () => void;
  activity: Signal<{ therapistName: string }>;
  theme: Signal<"light" | "dark" | "system">;
}) => {
  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const onTherapistNameChange = (e: Event) => {
    assert(e.target instanceof HTMLSelectElement, "Change event target must be an HTMLSelectElement");
    activity.value = { ...activity.value, therapistName: e.target.value };
  };

  return (
    <Modal title="Settings" onClose={onClose}>
      <form class="px-4 flex flex-col gap-4" onSubmit={onSubmit}>
        <Label>
          Therapist
          <select
            id="therapistName"
            value={activity.value.therapistName}
            onChange={onTherapistNameChange}
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
          Interface Theme
          <div class="flex">
            <Button
              type="button"
              variant={theme.value === "light" ? "default" : "outline"}
              onClick={() => (theme.value = "light")}
              className="border-r-0 rounded-r-none"
            >
              Light
            </Button>
            <Button
              type="button"
              variant={theme.value === "dark" ? "default" : "outline"}
              onClick={() => (theme.value = "dark")}
              className="rounded-none"
            >
              Dark
            </Button>
            <Button
              type="button"
              variant={theme.value === "system" ? "default" : "outline"}
              onClick={() => (theme.value = "system")}
              className="border-l-0 rounded-l-none"
            >
              System
            </Button>
          </div>
        </Label>
      </form>
    </Modal>
  );
};
