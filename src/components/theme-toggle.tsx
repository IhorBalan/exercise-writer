"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { applyTheme, THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";

const ORDER: ThemePreference[] = ["system", "light", "dark"];
const LABEL: Record<ThemePreference, string> = {
  system: "Theme: follows your device",
  light: "Theme: light",
  dark: "Theme: dark",
};

function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePreference | null>(null);

  useEffect(() => {
    // Sync with what the inline head script applied before hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPref(readPreference());
  }, []);

  useEffect(() => {
    if (pref !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [pref]);

  const current = pref ?? "system";
  const Icon = current === "dark" ? Moon : current === "light" ? Sun : Monitor;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`${LABEL[current]}. Tap to change.`}
      title={LABEL[current]}
      onClick={() => {
        const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
        try {
          if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
          else localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {}
        applyTheme(next);
        setPref(next);
      }}
    >
      <Icon />
    </Button>
  );
}
