import { html } from "htm/preact";
import { cva } from "class-variance-authority";

import { cn } from "../cn.js";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col gap-y-1");

const Label = (props) => html` <label ...${props} class=${cn(labelVariants(), props.class)} /> `;

Label.displayName = "Label";

export { Label };
