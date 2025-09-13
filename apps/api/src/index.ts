import { Hono } from "hono";
import { logger } from "hono/logger";
import { db } from "@notpadd/db";
import { cors } from "hono/cors";
import { auth } from "@notpadd/auth/auth";
import routes from "./routes/index.ts";
import { env } from "@notpadd/env/server";

export interface ReqVariables {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  db: typeof db | null;
}

const app = new Hono<{ Variables: ReqVariables }>();

app.use(
  "*",
  cors({
    origin: (_origin, c) => env.TRUSTED_ORIGINS.includes(_origin),
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
  const vars = env.TRUSTED_ORIGINS;

  console.log(vars);

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
  return c.text("Hello from the Hono API!");
});

export default app;
