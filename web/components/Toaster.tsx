import { toastMessage } from "@/data/toast";

export const Toaster = () => {
  if (!toastMessage.value) return null;

  return (
    <div
      role="status"
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium shadow-lg"
    >
      {toastMessage.value}
    </div>
  );
};
