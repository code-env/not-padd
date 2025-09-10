import { Hono } from "hono";
import type { ReqVariables } from "@/index";
import authRouter from "./auth";

const routes = new Hono<{ Variables: ReqVariables }>();

routes.route("/auth", authRouter);

export default routes;
