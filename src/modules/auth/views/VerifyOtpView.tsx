"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/constants/routes";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { OtpInput } from "@/modules/auth/components/OtpInput";
import {
  useResendOtp,
  useVerifyOtp,
} from "@/modules/auth/controllers/authController";
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "@/modules/auth/lib/validators";

const RESEND_SECONDS = 45;

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const shown = local.slice(0, 8);
  return `${shown.charAt(0).toUpperCase()}${shown.slice(1)}....@${domain}`;
}

export function VerifyOtpView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  const [secondsLeft, setSecondsLeft] = React.useState(RESEND_SECONDS);

  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });
  const otp = useWatch({ control: form.control, name: "otp" }) ?? "";

  const onSubmit = (values: VerifyOtpFormValues) => {
    verifyOtp.mutate(
      { email, otp: values.otp },
      {
        onSuccess: (response) => {
          const params = new URLSearchParams({
            email,
            token: response.data.reset_token,
          });
          router.push(`${AUTH_ROUTES.RESET_PASSWORD}?${params.toString()}`);
        },
      },
    );
  };

  const resend = () => {
    if (!email || secondsLeft > 0 || resendOtp.isPending) return;
    resendOtp.mutate(
      { email },
      { onSuccess: () => setSecondsLeft(RESEND_SECONDS) },
    );
  };

  return (
    <AuthCard
      title="Enter Code"
      subtitle={
        email
          ? `We sent a code to ${maskEmail(email)}`
          : "We sent a code to your email."
      }
      showBack
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <span className="text-sm font-medium text-text-secondary">
            Security Code
          </span>
          <OtpInput
            value={otp}
            onChange={(value) =>
              form.setValue("otp", value, { shouldValidate: true })
            }
            disabled={verifyOtp.isPending}
          />
          {form.formState.errors.otp ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.otp.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Didn&apos;t get the code?{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline disabled:opacity-50"
              disabled={!email || secondsLeft > 0 || resendOtp.isPending}
              onClick={resend}
            >
              Resend it
            </button>
          </span>
          <span>{secondsLeft > 0 ? `${secondsLeft}s` : "0s"}</span>
        </div>

        <Button
          type="submit"
          className="h-11 w-full"
          isLoading={verifyOtp.isPending}
          disabled={!email}
        >
          Continue
        </Button>

        {!email ? (
          <p className="text-center text-sm text-destructive">
            Missing email — please{" "}
            <Link href={AUTH_ROUTES.FORGOT_PASSWORD} className="underline">
              start again
            </Link>
            .
          </p>
        ) : null}
      </form>
    </AuthCard>
  );
}
