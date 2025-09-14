import { db } from "@notpadd/db";
import schema from "@notpadd/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@notpadd/env/server";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),

  trustedOrigins: [env.FRONTEND_URL, env.BACKEND_URL],
  emailAndPassword: {
    enabled: false,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      accessType: "offline",
      prompt: "consent",
    },
  },

  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
    },
  },
  verification: {
    disableCleanup: true,
  },
  plugins: [organization()],
});

export type Session = typeof auth.$Infer.Session;
