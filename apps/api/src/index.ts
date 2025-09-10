import { Hono } from "hono";
import { logger } from "hono/logger";
import { env } from "@notpadd/env/server";
import { db } from "@notpadd/db";
import { cors } from "hono/cors";
import { auth } from "@notpadd/auth/auth";

export interface ReqVariables {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  db: typeof db | null;
}

const app = new Hono();

app.use("*", logger());

app.get("/", (c) => {
  return c.text("Hello from the Hono API!");
});

export default app;
