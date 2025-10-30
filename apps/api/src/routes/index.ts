import { Hono } from "hono";
import type { ReqVariables } from "../hono/index.ts";
import { authRouter } from "./auth/index.ts";
import { articlesRoutes } from "./articles/index.ts";
import { mediaRoutes } from "./media/index.ts";
import { tagsRoutes } from "./tags/index.ts";
import { authorsRoutes } from "./authors/index.ts";
import { keysRoutes } from "./keys/index.ts";
import { v1Routes } from "./v1/index.ts";
import { githubAppRoutes } from "./github-app/index.ts";

const routes = new Hono<{ Variables: ReqVariables }>();

routes.route("/auth", authRouter);
routes.route("/articles", articlesRoutes);
routes.route("/media", mediaRoutes);
routes.route("/tags", tagsRoutes);
routes.route("/authors", authorsRoutes);
routes.route("/keys", keysRoutes);
routes.route("/v1", v1Routes);
routes.route("/github-app", githubAppRoutes);

export { routes };
