import { Hono } from "hono";
import type { ReqVariables } from "../index.ts";
import authRouter from "./auth/index.ts";
import articlesRouter from "./articles/index.ts";
import mediaRouter from "./media/index.ts";
import tagsRouter from "./tags/index.ts";
import authorsRouter from "./authors/index.ts";
import keysRouter from "./keys/index.ts";
import v1Routes from "./v1/index.ts";

const routes = new Hono<{ Variables: ReqVariables }>();

routes.route("/auth", authRouter);
routes.route("/articles", articlesRouter);
routes.route("/media", mediaRouter);
routes.route("/tags", tagsRouter);
routes.route("/authors", authorsRouter);
routes.route("/keys", keysRouter);
routes.route("/v1", v1Routes);

export default routes;
