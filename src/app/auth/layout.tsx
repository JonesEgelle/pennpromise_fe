import type { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Sign in — PennPromise Admin",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-black lg:block">
        {/* TODO(assets): Glass 1.svg (~30MB) and image 5.svg are raster-in-SVG
            exports — compress to PNG/WebP before production. */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/auth/image%205.svg')" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-20 h-[68%] w-[135%] bg-contain bg-bottom bg-no-repeat"
          style={{ backgroundImage: "url('/auth/Glass%201.svg')" }}
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col p-12 xl:p-16">
          <div
            className="h-10.5 w-52.5 bg-contain bg-left bg-no-repeat"
            style={{ backgroundImage: "url('/auth/authLogo.svg')" }}
            role="img"
            aria-label="PennPromise Capital"
          />
          <div className="mt-14 max-w-xl space-y-5">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Take Control of Your Business Account.
            </h2>
            <p className="max-w-lg text-[15px] leading-relaxed text-white/75">
              An easier, ethical, and accessible way to invest confidently,
              giving you the tools, insights, and transparency you need to grow
              your wealth while staying aligned with your values.
            </p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex justify-center bg-background px-6 py-16 lg:px-10 lg:py-24">
        <div className="w-full max-w-95">{children}</div>
      </div>
    </div>
  );
}
