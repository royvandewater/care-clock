import { cn } from "@/cn";
import type { JSX } from "preact";

const TextArea = ({ className, ...props }: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    class={cn(
      "flex w-full rounded-md border border-input-border bg-input-background px-3 py-2 text-sm ring-offset-background text-foreground font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-input-border-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:border-gray-200",
      className,
    )}
  ></textarea>
);

TextArea.displayName = "TextArea";

export { TextArea };
