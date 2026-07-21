import type { SessionType } from "@/data/sessionTypes";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { assert } from "@/assert";
import { therapists } from "@/data/therapists";
import { combineWithWho, splitWithWho } from "@/data/withWhoTherapists";
import { cn } from "@/cn";

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input-border bg-input-background px-3 py-2 text-sm ring-offset-background text-foreground font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-input-border-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:border-gray-200",
);

const TherapistSelect = ({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (name: string) => void;
}) => (
  <select
    id={id}
    value={value}
    onChange={(e: Event) => {
      assert(e.target instanceof HTMLSelectElement);
      onChange(e.target.value);
    }}
    className={selectClassName}
  >
    <option value="" disabled>
      Select a therapist
    </option>
    {therapists.map((therapist) => (
      <option value={therapist}>{therapist}</option>
    ))}
  </select>
);

export const GroupOrWithWho = ({
  sessionType,
  groupName,
  onChangeGroupName,
  withWho,
  onChangeWithWho,
}: {
  sessionType: SessionType;
  groupName: string;
  onChangeGroupName: (name: string) => void;
  withWho: string;
  onChangeWithWho: (name: string) => void;
}) => {
  if (sessionType === "Individual") {
    return null;
  }

  if (sessionType === "Group") {
    return (
      <Label>
        Group
        <Input
          id="groupName"
          value={groupName}
          onInput={(e: InputEvent) => {
            assert(e.target instanceof HTMLInputElement);
            onChangeGroupName(e.target.value);
          }}
          placeholder="Triathlon"
        />
      </Label>
    );
  }

  if (sessionType === "Co-Treat") {
    return (
      <Label>
        With Who
        <TherapistSelect id="withWho" value={withWho} onChange={onChangeWithWho} />
      </Label>
    );
  }

  if (sessionType === "Tri-Treat") {
    const [first, second] = splitWithWho(withWho);

    return (
      <>
        <Label>
          With Who
          <TherapistSelect
            id="withWho"
            value={first}
            onChange={(name: string) => onChangeWithWho(combineWithWho(name, second))}
          />
        </Label>
        <Label>
          And Who
          <TherapistSelect
            id="withWho2"
            value={second}
            onChange={(name: string) => onChangeWithWho(combineWithWho(first, name))}
          />
        </Label>
      </>
    );
  }

  return (
    <Label>
      With Who
      <Input
        id="withWho"
        value={withWho}
        onInput={(e: InputEvent) => {
          assert(e.target instanceof HTMLInputElement);
          onChangeWithWho(e.target.value);
        }}
      />
    </Label>
  );
};
