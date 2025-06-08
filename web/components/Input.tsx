import { cn } from "@/cn";
import type { JSX } from "preact";

const Input = ({ className, ...props }: JSX.HTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "flex h-10 w-full rounded-md border border-input-border bg-input-background px-3 py-2 text-sm ring-offset-background text-foreground font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus:ring-input-border-focus disabled:cursor-not-allowed disabled:opacity-50 disabled:border-gray-200",
      className,
    )}
  />
);

Input.displayName = "Input";

export { Input };
