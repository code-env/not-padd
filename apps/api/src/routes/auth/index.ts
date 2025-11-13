import type { ReqVariables } from "../../hono/index.ts";
import { auth } from "@notpadd/auth/auth";
import { Hono, type Context } from "hono";

const authRouter = new Hono<{ Variables: ReqVariables }>();

authRouter.on(["POST", "GET"], "/*", async (c: Context) => {
  try {
    return await auth.handler(c.req.raw);
  } catch (error) {
    console.error("Auth handler error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
});

export { authRouter };
