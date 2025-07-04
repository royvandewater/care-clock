import { cn } from "@/cn";
import { Settings } from "@/components/icons/Settings";
import type { JSX } from "preact";

export const SettingsButton = ({ onClick, className, ...props }: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    aria-label="Settings"
    class={cn("size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl", className)}
    type="button"
    onClick={onClick}
    {...props}
  >
    <Settings />
  </button>
);
