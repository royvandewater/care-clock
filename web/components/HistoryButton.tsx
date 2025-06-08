import { History } from "@/components/icons/History";
import { cn } from "@/cn";
import type { Signal } from "@preact/signals";

export const HistoryButton = ({
  hasNotifications,
  className,
  ...props
}: {
  className?: string;
  hasNotifications: Signal<boolean>;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label="History"
    class={cn("size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl", className)}
    onClick={props.onClick}
  >
    {hasNotifications.value && <span class="absolute top-0.5 right-0.5 size-2 rounded-full bg-danger"></span>}
    <History className="text-danger" />
  </button>
);
