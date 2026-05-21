import { cn } from "@/cn";

export const CharCounter = ({ value, max }: { value: string; max: number }) => (
  <div class={cn("text-xs text-right mt-1", value.length > max ? "text-warning" : "text-muted-foreground")}>
    {value.length} / {max} chars
  </div>
);
