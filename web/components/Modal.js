import { html } from "htm/preact";

import { cn } from "@/cn";
import { Back } from "@/components/icons/Back";

/**
 * @typedef {import("preact").ComponentChildren} ComponentChildren
 */

/**
 * @param {{title: ComponentChildren, children: ComponentChildren, onClose: () => void}} props
 */
export const Modal = ({ title, children, onClose, ...props }) => {
  return html`<div class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm" onClick=${onClose}>
    <div class="mx-auto max-w-md w-full h-full shadow-lg bg-background rounded-lg flex flex-col" onClick=${(e) => e.stopPropagation()}>
      <header class="text-center relative p-4">
        ${title}
        <button aria-label="Back" class="size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl absolute top-4 left-8" onClick=${onClose}>
          <${Back} />
        </button>
      </header>
      <div class=${cn("flex-1 overflow-y-auto p-4 flex flex-col", props.class)}>${children}</div>
    </div>
  </div>`;
};
