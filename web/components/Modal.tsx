import { cn } from "@/cn";
import { Back } from "@/components/icons/Back";
import type { ComponentChildren } from "preact";

export const Modal = ({
  title,
  children,
  onClose,
  className,
}: {
  title: ComponentChildren;
  children?: ComponentChildren;
  onClose: () => void;
  className?: string;
}) => (
  <div class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm" onClick={onClose}>
    <div
      class="mx-auto max-w-md w-full h-full shadow-lg bg-background rounded-lg flex flex-col"
      onClick={(e: Event) => e.stopPropagation()}
    >
      <header class="text-center relative p-4">
        {title}
        <button
          aria-label="Back"
          class="size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl absolute top-4 left-8"
          onClick={onClose}
        >
          <Back />
        </button>
      </header>
      <div class={cn("flex-1 overflow-y-auto p-4 flex flex-col", className)}>{children}</div>
    </div>
  </div>
);
