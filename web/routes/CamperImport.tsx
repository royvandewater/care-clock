import { useLocation } from "preact-iso";

import { Button } from "@/components/Button";
import { Card, CardContent } from "@/components/Card";
import { useAvailableCampers } from "@/data/useAvailableCampers";
import { showToast } from "@/data/toast";

export const CamperImport = () => {
  const { url, route } = useLocation();
  const availableCampers = useAvailableCampers();

  const search = url.includes("?") ? url.slice(url.indexOf("?")) : "";
  const campers = new URLSearchParams(search).getAll("camper");

  const onConfirm = () => {
    const merged = [...new Set([...availableCampers.value, ...campers])].sort();
    // Persist directly so the write lands before route("/") unmounts us and the
    // signal effect would otherwise flush.
    localStorage.setItem("campers", JSON.stringify(merged));
    availableCampers.value = merged;
    showToast(`Imported ${campers.length} ${campers.length === 1 ? "camper" : "campers"}`);
    route("/");
  };

  const onCancel = () => route("/");

  return (
    <div class="h-full max-w-md mx-auto p-4 space-y-6 flex flex-col gap-4 z-0">
      <header class="text-center">
        <h1 class="text-2xl font-bold text-primary">Import Campers</h1>
      </header>

      <Card className="flex-1">
        <CardContent className="p-4 space-y-4 h-full flex flex-col">
          <p class="text-secondary">The following campers will be added to your device:</p>

          <ul class="flex flex-col divide-y-1 divide-secondary/40">
            {campers.length === 0 && <li class="text-center text-secondary py-4">No campers to import</li>}
            {campers.map((camper) => (
              <li class="py-2 px-4">{camper}</li>
            ))}
          </ul>

          <div class="flex flex-col gap-4 mt-auto">
            <Button type="button" onClick={onConfirm} disabled={campers.length === 0}>
              Confirm
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
