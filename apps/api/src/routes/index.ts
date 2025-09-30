import { Hono } from "hono";
import type { ReqVariables } from "../index.ts";
import authRouter from "./auth/index.ts";
import articlesRouter from "./articles/index.ts";
import mediaRouter from "./media/index.ts";

const routes = new Hono<{ Variables: ReqVariables }>();

routes.route("/auth", authRouter);
routes.route("/articles", articlesRouter);
routes.route("/media", mediaRouter);

export default routes;
