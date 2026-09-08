"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { AUTH_ROUTES } from "@/constants/routes";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import {
  useResendOtp,
  useVerifyOtp,
} from "@/modules/auth/controllers/authController";
import {
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "@/modules/auth/lib/validators";

export function VerifyOtpView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const verifyOtp = useVerifyOtp();
  const resendOtp = useResendOtp();

  const form = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

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

  return (
    <AuthCard
      title="Enter your code"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}.`
          : "We sent a 6-digit code to your email."
      }
      footer={
        <span>
          Didn&apos;t get it?{" "}
          <button
            type="button"
            className="text-info hover:underline disabled:opacity-50"
            disabled={!email || resendOtp.isPending}
            onClick={() => resendOtp.mutate({ email })}
          >
            Resend code
          </button>
        </span>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="otp"
            label="6-digit code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={verifyOtp.isPending}
            disabled={!email}
          >
            Verify
          </Button>
          {!email ? (
            <p className="text-center text-sm text-destructive">
              Missing email — please{" "}
              <Link
                href={AUTH_ROUTES.FORGOT_PASSWORD}
                className="underline"
              >
                start again
              </Link>
              .
            </p>
          ) : null}
        </form>
      </Form>
    </AuthCard>
  );
}
