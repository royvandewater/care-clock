import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";

/**
 * Manages the available campers state and synchronizes it with the local storage. It
 * does not keep it in sync with other instances of useAvailableCampers rendered in the
 * same tab.
 *
 * @returns {Signal<string[]>}
 */
export const useAvailableCampers = () => {
  const campers = useSignal(JSON.parse(localStorage.getItem("campers") ?? "[]"));
  useSignalEffect(() => localStorage.setItem("campers", JSON.stringify(campers.value)));

  useEffect(() => {
    const updateCampers = (event: StorageEvent) => {
      if (event.key !== "campers") return;
      campers.value = JSON.parse(event.newValue ?? "[]");
    };
    window.addEventListener("storage", updateCampers);
  }, []);

  return campers;
};
