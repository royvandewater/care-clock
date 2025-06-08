import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";

import { sessionTypes, type SessionType } from "@/data/sessionTypes";

export const SessionTypeModal = ({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (sessionType: SessionType) => void;
}) => {
  const onSelectSessionType = (event: Event, sessionType: SessionType) => {
    event.stopPropagation();
    event.preventDefault();

    onSelect(sessionType);
    onClose();
  };

  return (
    <Modal title={<Header />} onClose={onClose}>
      <ul class="flex flex-col divide-y-1 divide-secondary/40">
        {sessionTypes.map((sessionType) => (
          <li>
            <div
              class="flex justify-between items-center p-2"
              onClick={(event: Event) => onSelectSessionType(event, sessionType)}
            >
              <span>{sessionType}</span>
              <SelectButton
                sessionType={sessionType}
                onClick={(event: Event) => onSelectSessionType(event, sessionType)}
              />
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

const Header = () => {
  return <h1 class="text-2xl font-bold">Session Type</h1>;
};

const SelectButton = ({ onClick, sessionType }: { onClick: (event: Event) => void; sessionType: SessionType }) => {
  return (
    <Button type="button" onClick={onClick} size="xs" aria-label={`Select ${sessionType}`}>
      Select
    </Button>
  );
};
