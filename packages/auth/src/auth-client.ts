import { createAuthClient } from "better-auth/react";
import { env } from "@notpadd/env/client";

console.log(env.NEXT_PUBLIC_BACKEND_URL);

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
});
