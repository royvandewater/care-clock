import { signal } from "@preact/signals";

export const toastMessage = signal<string | null>(null);

let timeoutId: ReturnType<typeof setTimeout> | undefined;

export const showToast = (message: string) => {
  toastMessage.value = message;

  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => (toastMessage.value = null), 3000);
};
