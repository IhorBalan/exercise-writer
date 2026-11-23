export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

/**
 * Runs before first paint (inlined in <head>) so there is no flash of the
 * wrong theme. Keep it dependency-free.
 */
export const themeInitScript = `(() => {
  try {
    var pref = localStorage.getItem("${THEME_STORAGE_KEY}") || "system";
    var dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();`;

export function applyTheme(pref: ThemePreference) {
  const dark =
    pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}
