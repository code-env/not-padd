import { Hono } from "hono";
import type { ReqVariables } from "@/index";

const routes = new Hono<{ Variables: ReqVariables }>();

// routes.route("/auth", ()=>{})

export default routes;
