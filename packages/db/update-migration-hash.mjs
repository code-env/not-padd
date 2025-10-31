import { Pool } from "pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { createHash } from "crypto";

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateHash() {
  const client = await pool.connect();

  try {
    const migrationFile = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "./migrations/0000_previous_mach_iv.sql"
    );
    const migrationSQL = readFileSync(migrationFile, "utf-8");

    // Calculate new hash
    const newHash = createHash("sha256")
      .update(migrationSQL)
      .digest("hex");

    // Clear old hash and insert new one
    await client.query(`DELETE FROM __drizzle_migrations`);
    await client.query(
      `INSERT INTO __drizzle_migrations (hash, created_at) VALUES ($1, EXTRACT(EPOCH FROM NOW())::bigint)`,
      [newHash]
    );

    console.log("✅ Migration hash updated!");
    console.log(`   New hash: ${newHash.substring(0, 16)}...`);

  } finally {
    client.release();
    await pool.end();
  }
}

updateHash();
