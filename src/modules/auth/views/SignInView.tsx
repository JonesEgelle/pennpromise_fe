"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/shared/FormInput";
import { AUTH_ROUTES, APP_ROUTES } from "@/constants/routes";
import {
  AuthCard,
  AUTH_INPUT_CLASS,
} from "@/modules/auth/components/AuthCard";
import { useLogin } from "@/modules/auth/controllers/authController";
import {
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth/lib/validators";

export function SignInView() {
  const router = useRouter();
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => router.replace(APP_ROUTES.PLATFORM_ANALYTICS),
    });
  };

  return (
    <AuthCard title="Get Started!" subtitle="Sign up for a business account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="Enter email address"
            className={AUTH_INPUT_CLASS}
          />
          <FormInput
            control={form.control}
            name="password"
            label="Create password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            className={AUTH_INPUT_CLASS}
          />

          <div className="flex items-center justify-between text-sm">
            <label
              htmlFor="keep-signed-in"
              className="flex items-center gap-2 text-text-secondary"
            >
              <Checkbox
                id="keep-signed-in"
                defaultChecked
                className="size-5 rounded-[5px] border-input data-[state=checked]:border-input data-[state=checked]:bg-transparent data-[state=checked]:text-muted-foreground"
              />
              Keep me signed in
            </label>
            <Link
              href={AUTH_ROUTES.FORGOT_PASSWORD}
              className="text-text-secondary hover:text-foreground"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-11 w-full"
            isLoading={login.isPending}
          >
            Continue
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
}
