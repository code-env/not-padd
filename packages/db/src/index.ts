import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import schema from "./schema";
import { env } from "@notpadd/env/server";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });
