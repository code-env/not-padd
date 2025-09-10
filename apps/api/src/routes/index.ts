import { Hono } from "hono";
import type { ReqVariables } from "../index.ts";
import authRouter from "./auth/index.ts";

const routes = new Hono<{ Variables: ReqVariables }>();

routes.route("/auth", authRouter);

export default routes;
