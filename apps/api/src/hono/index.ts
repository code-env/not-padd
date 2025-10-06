import { auth } from "@notpadd/auth/auth";
import { db } from "@notpadd/db";

export interface ReqVariables {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
  db: typeof db | null;
}
