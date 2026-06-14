import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import type { VariantProps } from "class-variance-authority";
import type { buttonVariants } from "@/components/Button";

export const ConfirmModal = ({
  title = "Are you sure?",
  message,
  confirmLabel,
  confirmVariant = "default",
  disabled = false,
  onConfirm,
  onClose,
}: {
  title?: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: VariantProps<typeof buttonVariants>["variant"];
  disabled?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => (
  <Modal title={<h1 class="text-2xl font-bold">{title}</h1>} onClose={disabled ? () => {} : onClose} className="gap-y-6">
    <p class="text-warning">{message}</p>
    <fieldset disabled={disabled} class="flex flex-col gap-4 mt-auto">
      <Button type="button" variant={confirmVariant} onClick={onConfirm}>
        {confirmLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
    </fieldset>
  </Modal>
);
