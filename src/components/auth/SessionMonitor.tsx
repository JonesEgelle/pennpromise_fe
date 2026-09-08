"use client";

import * as React from "react";

import {
  AUTH_DISABLED,
  getAccessToken,
  handleSessionExpiry,
  isSessionExpired,
} from "@/lib/auth-utils";

const CHECK_INTERVAL_MS = 5 * 60 * 1000;

/**
 * No-UI component. Proactively tears down an expired session on an interval and
 * on tab-visibility change, rather than waiting for the next API call to 401.
 * Mounted once inside the authenticated layout.
 */
export function SessionMonitor() {
  React.useEffect(() => {
    // DEV-ONLY: no session to monitor when the auth guard is bypassed.
    if (AUTH_DISABLED) return;

    const check = () => {
      const token = getAccessToken();
      if (!token || isSessionExpired(token)) {
        handleSessionExpiry();
      }
    };

    const interval = setInterval(check, CHECK_INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}
