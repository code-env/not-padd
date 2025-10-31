import { Pool } from "pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { createHash } from "crypto";

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log("🚀 Running migration: 0011_organic_wendigo\n");

    const migrationPath = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "./migrations/0011_organic_wendigo.sql"
    );
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    const migrationHash = createHash("sha256")
      .update(migrationSQL)
      .digest("hex");

    console.log("1. Checking if migration already applied...");
    const checkResult = await client.query(
      `
      SELECT hash FROM __drizzle_migrations
      WHERE hash = $1
    `,
      [migrationHash]
    );

    if (checkResult.rows.length > 0) {
      console.log("   ✓ Migration already applied, skipping");
      return;
    }

    console.log("2. Executing migration SQL...");
    const statements = migrationSQL
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement);
      }
    }
    console.log("   ✓ Migration SQL executed\n");

    console.log("3. Marking migration as applied...");
    await client.query(
      `
      INSERT INTO __drizzle_migrations (hash, created_at)
      VALUES ($1, EXTRACT(EPOCH FROM NOW())::bigint)
      ON CONFLICT (hash) DO NOTHING
    `,
      [migrationHash]
    );
    console.log("   ✓ Migration marked as applied\n");

    console.log("✅ Migration 0011_organic_wendigo completed successfully!");
  } catch (error) {
    console.error("❌ Error running migration:", error.message);

    if (
      error.code === "42P01" &&
      error.message.includes("__drizzle_migrations")
    ) {
      console.log("\n   Creating __drizzle_migrations table...");
      await client.query(`
        CREATE TABLE IF NOT EXISTS __drizzle_migrations (
          id SERIAL PRIMARY KEY,
          hash text NOT NULL UNIQUE,
          created_at bigint
        )
      `);
      console.log("   ✓ Table created, retrying migration...\n");

      const migrationPath = resolve(
        dirname(fileURLToPath(import.meta.url)),
        "./migrations/0011_organic_wendigo.sql"
      );
      const migrationSQL = readFileSync(migrationPath, "utf-8");
      const migrationHash = createHash("sha256")
        .update(migrationSQL)
        .digest("hex");

      const statements = migrationSQL
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !s.startsWith("--"));

      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }

      await client.query(
        `
        INSERT INTO __drizzle_migrations (hash, created_at)
        VALUES ($1, EXTRACT(EPOCH FROM NOW())::bigint)
      `,
        [migrationHash]
      );

      console.log("✅ Migration 0011_organic_wendigo completed successfully!");
      return;
    }

    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
