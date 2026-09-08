"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  AUTH_DISABLED,
  getAccessToken,
  isSessionExpired,
} from "@/lib/auth-utils";
import { AUTH_ROUTES } from "@/constants/routes";

/**
 * Client-side route guard for the authenticated app. It complements — but does
 * NOT replace — the backend rejecting unauthorized API requests. If server-side
 * protection is required (likely for a regulated fintech), add a Next proxy
 * (Next 16's `middleware` → `proxy` convention) as a follow-up — see CLAUDE.md.
 */

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

const readAuthed = (): boolean => {
  const token = getAccessToken();
  return Boolean(token) && !isSessionExpired(token);
};

/** `null` = not yet known (server render); boolean once on the client. */
const serverSnapshot = (): boolean | null => null;

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authed = React.useSyncExternalStore<boolean | null>(
    subscribe,
    readAuthed,
    serverSnapshot,
  );

  React.useEffect(() => {
    if (!AUTH_DISABLED && authed === false) {
      router.replace(AUTH_ROUTES.SIGN_IN);
    }
  }, [authed, router]);

  // DEV-ONLY: NEXT_PUBLIC_DISABLE_AUTH lets the whole app render without login
  // while the UI is built against mock data (see lib/auth-utils.ts).
  if (AUTH_DISABLED) return <>{children}</>;

  if (!authed) return null;
  return <>{children}</>;
}
