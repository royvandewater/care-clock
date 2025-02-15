import { html } from "htm/preact";
import { cva } from "class-variance-authority";

import { cn } from "../cn.js";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = ({ className, ...props }) => html`
  <div className=${cn(labelVariants(), className)} ...${props} />
`;

Label.displayName = "Label";

export { Label };
