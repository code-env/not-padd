import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { resolve } from "path";
import BASE_ENV from "./base.js";
import { z } from "zod";

// Load environment variables from root .env file
config({ path: resolve(process.cwd(), ".env") });

export const env = createEnv({
  ...BASE_ENV,
  runtimeEnv: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_CALLBACK_URL: process.env.NEXT_PUBLIC_CALLBACK_URL,
    NEXT_PUBLIC_GITHUB_APP_NAME: process.env.NEXT_PUBLIC_GITHUB_APP_NAME,
  },

  clientPrefix: "NEXT_PUBLIC_",
  client: {
    NEXT_PUBLIC_BACKEND_URL: z.url(),
    NEXT_PUBLIC_FRONTEND_URL: z.url(),
    NEXT_PUBLIC_CALLBACK_URL: z.url(),
    NEXT_PUBLIC_GITHUB_APP_NAME: z.string().optional(),
  },
});

export default env;
