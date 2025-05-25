import { useSignal, useSignalEffect } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { z } from "zod";

export const useTheme = () => {
  const theme = useSignal(themeSchema.parse(window.localStorage.getItem("theme") ?? undefined));

  useSignalEffect(() => {
    window.localStorage.setItem("theme", theme.value);
    document.documentElement.classList.toggle("dark", theme.value === "dark");
  });

  useEffect(() => {
    const updateTheme = (event) => {
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
