import { html } from "htm/preact";

import { Close } from "./icons/Close.js";

/**
 * @typedef {import("preact").ComponentChildren} ComponentChildren
 */

/**
 * @param {{title: ComponentChildren, children: ComponentChildren, onClose: () => void}} props
 */
export const Modal = ({ title, children, onClose }) => {
  return html`<div class="fixed top-0 left-0 w-full h-full z-10 backdrop-blur-sm p-4" onClick=${onClose}>
    <div class="mx-auto max-w-md w-full h-full shadow-lg bg-background p-4 rounded-lg flex flex-col gap-4" onClick=${(e) => e.stopPropagation()}>
      <header class="text-center relative">
        <h1 class="text-2xl font-bold">${title}</h1>
        <button class="size-8 flex items-center justify-center hover:bg-tertiary-hover rounded-xl absolute top-0 right-0" onClick=${onClose}>
          <${Close} />
        </button>
      </header>
      ${children}
    </div>
  </div>`;
};
