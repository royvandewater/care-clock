import type { SessionType } from "@/data/sessionTypes";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { assert } from "@/assert";

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
        placeholder="Mr. John"
      />
    </Label>
  );
};
