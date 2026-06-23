import { useLocation } from "preact-iso";
import { useEffect } from "preact/hooks";

import { blankActivity, formatActivityForLocalStorage, useActivity } from "@/data/useActivity";

/**
 * Consumes a group-session prefill link (e.g. from a QR code) and lands the
 * therapist directly on a form prefilled for a "Group" session. The campers in
 * the link are pre-selected but intentionally NOT added to the stored camper
 * list, so off-caseload campers stay temporary.
 */
export const GroupSession = () => {
  const { url, route } = useLocation();
  const activity = useActivity();

  useEffect(() => {
    const search = url.includes("?") ? url.slice(url.indexOf("?")) : "";
    const params = new URLSearchParams(search);
    const groupName = params.get("group") ?? "";
    const campers = params.getAll("camper").map((name) => ({ name, id: null }));

    const prefilled = {
      ...blankActivity,
      therapistName: activity.value.therapistName,
      sessionType: "Group" as const,
      groupName,
      campers,
    };

    activity.value = prefilled;
    // Persist directly so the write lands before route("/") unmounts us, mirroring
    // CamperImport. Home reads the activity from localStorage on mount.
    localStorage.setItem("activity", formatActivityForLocalStorage(prefilled));
    route("/");
  }, []);

  return null;
};
