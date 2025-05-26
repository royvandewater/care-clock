import { assert } from "@/assert";

export const registerServiceWorker = async () => {
  const errorElement = document.getElementById("service-worker-errors");
  assert(errorElement, "Error element not found");

  if (!("serviceWorker" in navigator)) {
    errorElement.textContent = "This application requires a browser that supports service workers";
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(`serviceWorker.js`, { type: "module" });
    await navigator.serviceWorker.ready;
    return registration.active;
  } catch (error: unknown) {
    errorElement.textContent = String(error);
  }
};
