import { Suspense } from "react";

import { ResetPasswordView } from "@/modules/auth/views/ResetPasswordView";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordView />
    </Suspense>
  );
}
