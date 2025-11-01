import { createAuthClient } from "better-auth/react";
import { env } from "@notpadd/env/client";
import { organizationClient } from "better-auth/client/plugins";
import { ac, member, admin, owner } from "./permission";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  plugins: [
    organizationClient({
      ac,
      roles: { owner, admin, member },
      schema: {
        organization: {
          additionalFields: {
            lastUsed: { type: "boolean" },
            repoUrl: { type: "string" },
            repoPath: { type: "string" },
            storageLimit: { type: "number" },
            storageUsed: { type: "number" },
          },
        },
      },
    }),
  ],
});
