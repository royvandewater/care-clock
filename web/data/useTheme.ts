import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { z } from "zod";

export const useTheme = () => {
  const theme = useSignal(themeSchema.parse(window.localStorage.getItem("theme") ?? undefined));

  useSignalEffect(() => {
    window.localStorage.setItem("theme", theme.value);

    // Remove existing theme classes
    document.documentElement.classList.remove("light", "dark");

    // Apply the appropriate class based on theme selection
    if (theme.value === "light") {
      document.documentElement.classList.add("light");
    } else if (theme.value === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme.value === "system") {
      // Let system preference handle it via CSS media query
      // Don't add any class, let :root:not(.light):not(.dark) handle it
    }
  });

  useEffect(() => {
    const updateTheme = (event: StorageEvent) => {
      if (event.key !== "theme") return;
      theme.value = themeSchema.parse(event.newValue);
    };

    window.addEventListener("storage", updateTheme);

    return () => {
      window.removeEventListener("storage", updateTheme);
    };
  }, []);

  return theme;
};

const themeSchema = z.enum(["light", "dark", "system"]).default("system");
