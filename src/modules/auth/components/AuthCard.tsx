"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Shared field styling for the auth forms — grey-filled, flat. */
export const AUTH_INPUT_CLASS = "h-11 bg-muted shadow-none";

interface AuthCardProps {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  /** Show the "Go Back" pill (top-right of the form panel). */
  showBack?: boolean;
}

export function AuthCard({
  title,
  subtitle,
  children,
  showBack,
}: AuthCardProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      {showBack ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute right-6 top-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-muted lg:right-10 lg:top-12"
        >
          <ArrowLeft className="size-4" />
          Go Back
        </button>
      ) : null}

      <div className="space-y-1">
        <h1 className="text-[28px] font-bold leading-tight text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
