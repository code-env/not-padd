import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePostgresJS } from "drizzle-orm/postgres-js";

import { Pool } from "pg";
import schema from "./schema";
import { env } from "@notpadd/env/server";

type DrizzlePostgresInstance<S extends Record<string, unknown>> =
  | ReturnType<typeof drizzle<S>>
  | ReturnType<typeof drizzlePostgresJS<S>>;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });

export type DB = DrizzlePostgresInstance<typeof schema>;
