"use client";

import * as React from "react";

import {
  applyTheme,
  getStoredTheme,
  getSystemTheme,
  setStoredTheme,
  subscribeSystemTheme,
  subscribeThemePreference,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

interface ThemeContextValue {
  /** The user's stored preference: light | dark | system. */
  theme: Theme;
  /** What "system" currently resolves to — always light or dark. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const serverTheme = (): Theme => "system";
const serverSystemTheme = (): ResolvedTheme => "light";

/**
 * Exposes theme state to the tree. The no-flash script in the root layout has
 * already stamped <html> before hydration; this provider reads the same
 * sources via `useSyncExternalStore` (the pattern this repo uses for auth
 * state) and keeps `<html>` in step afterwards.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribeThemePreference,
    getStoredTheme,
    serverTheme,
  );
  const systemTheme = React.useSyncExternalStore(
    subscribeSystemTheme,
    getSystemTheme,
    serverSystemTheme,
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  // DOM-only: re-stamp <html> when the preference changes or, in "system"
  // mode, when the OS flips. No React state is set here.
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, resolvedTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme: setStoredTheme }),
    [theme, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
