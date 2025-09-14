import { createAuthClient } from "better-auth/react";
import { env } from "@notpadd/env/client";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  plugins: [organizationClient()],
});
