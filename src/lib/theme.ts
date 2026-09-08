/**
 * Theme source of truth. PennPromise supports Light / Dark / System.
 *
 * - The user's explicit choice is persisted in `localStorage` under
 *   `THEME_STORAGE_KEY`. "system" means "follow the OS" and stores no
 *   `data-theme` attribute so the CSS `prefers-color-scheme` fallback applies.
 * - `themeInitScript` runs before first paint (injected in the root layout
 *   `<head>`) to stamp `data-theme` + `color-scheme` and avoid a flash.
 * - `ThemeProvider` re-syncs React state on mount and keeps the DOM in step
 *   afterwards.
 *
 * Design source has no theme toggle affordance; the control lives in the
 * sidebar profile menu (see CLAUDE.md audit → decision 4).
 */

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "pp-theme";
export const THEMES: Theme[] = ["light", "dark", "system"];

const isBrowser = () => typeof window !== "undefined";

export function getSystemTheme(): ResolvedTheme {
  if (!isBrowser()) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

export function getStoredTheme(): Theme {
  if (!isBrowser()) return "system";
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" || value === "system"
      ? value
      : "system";
  } catch {
    return "system";
  }
}

/** Stamp the resolved theme onto <html>. "system" clears the attribute. */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  root.style.colorScheme = resolveTheme(theme);
}

/* --- reactive stores for `useSyncExternalStore` (see ThemeProvider) --- */

const preferenceListeners = new Set<() => void>();

/** Subscribe to preference changes: this tab's `setStoredTheme` and other tabs. */
export function subscribeThemePreference(callback: () => void): () => void {
  preferenceListeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === THEME_STORAGE_KEY) callback();
  };
  if (isBrowser()) window.addEventListener("storage", onStorage);
  return () => {
    preferenceListeners.delete(callback);
    if (isBrowser()) window.removeEventListener("storage", onStorage);
  };
}

/** Persist the preference, apply it to <html>, and notify subscribers. */
export function setStoredTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — still apply for this session */
  }
  applyTheme(theme);
  preferenceListeners.forEach((listener) => listener());
}

/** Subscribe to OS light/dark changes. */
export function subscribeSystemTheme(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/**
 * Synchronous, self-contained, no-dependency snippet. Injected as a raw
 * <script> in the root layout so the correct theme is on <html> before the
 * first paint. Keep it tiny and defensive — storage can throw.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=(s==="light"||s==="dark")?s:null;var r=document.documentElement;if(t){r.setAttribute("data-theme",t);}r.style.colorScheme=t||(d?"dark":"light");}catch(e){}})();`;
