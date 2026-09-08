import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";

export default function RootPage() {
  // The authenticated layout's AuthGuard bounces unauthenticated users to
  // /auth/signin, so a single entry point is enough here.
  redirect(APP_ROUTES.PLATFORM_ANALYTICS);
}
