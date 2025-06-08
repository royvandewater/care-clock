import { cva } from "class-variance-authority";
import type { JSX } from "preact";

import { cn } from "@/cn";

const labelVariants = cva("text-xs text-foreground-secondary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col gap-y-2");

const Label = ({ className, ...props }: JSX.HTMLAttributes<HTMLLabelElement>) => <label {...props} className={cn(labelVariants(), className)} />;
Label.displayName = "Label";

/**
 * div styled to look like a label
 */
const LabelLike = ({ className, ...props }: JSX.HTMLAttributes<HTMLDivElement>) => <div {...props} className={cn(labelVariants(), className)} />;
LabelLike.displayName = "LabelLike";

export { Label, LabelLike };
