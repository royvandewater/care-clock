import { html } from "htm/preact";
import { cva } from "class-variance-authority";

import { cn } from "../cn.js";

const labelVariants = cva("text-xs text-foreground-secondary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col gap-y-2");

const Label = (props) => html` <label ...${props} class=${cn(labelVariants(), props.class)} /> `;

Label.displayName = "Label";

/**
 * div styled to look like a label
 */
const LabelLike = (props) => html` <div ...${props} class=${cn(labelVariants(), props.class)} /> `;

LabelLike.displayName = "LabelLike";

export { Label, LabelLike };
