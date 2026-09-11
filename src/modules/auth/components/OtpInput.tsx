"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

/** Six individual digit boxes; auto-advances, handles backspace and paste. */
export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
}: OtpInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join(""));
  };

  return (
    <div className="flex gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          onChange={(event) => {
            const cleaned = event.target.value.replace(/\D/g, "").slice(-1);
            setDigit(index, cleaned);
            if (cleaned && index < length - 1) {
              refs.current[index + 1]?.focus();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          onPaste={(event) => {
            const pasted = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, length);
            if (!pasted) return;
            event.preventDefault();
            onChange(pasted);
            refs.current[Math.min(pasted.length, length - 1)]?.focus();
          }}
          className={cn(
            "size-11 rounded-[10px] border border-input bg-surface text-center text-lg font-semibold text-foreground outline-none transition-colors",
            "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      ))}
    </div>
  );
}
