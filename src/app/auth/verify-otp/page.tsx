import { Suspense } from "react";

import { VerifyOtpView } from "@/modules/auth/views/VerifyOtpView";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpView />
    </Suspense>
  );
}
