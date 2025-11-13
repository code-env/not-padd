import { auth } from "@notpadd/auth/auth";
import { db } from "@notpadd/db";
import { env } from "@notpadd/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { routes } from "./routes/index.ts";
import type { ReqVariables } from "./hono/index.ts";

const app = new Hono<{ Variables: ReqVariables }>();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      if (env.TRUSTED_ORIGINS.includes("*")) return origin;
      return env.TRUSTED_ORIGINS.includes(origin) ? origin : null;
    },
    credentials: true,
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    exposeHeaders: ["Set-Cookie"],
    maxAge: 86400,
  })
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("db", null);
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("db", db);
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.use("*", logger());

app.route("/api", routes);

app.get("/", (c) => {
  return c.text("Hello from Notpadd API!");
});

export default app;
