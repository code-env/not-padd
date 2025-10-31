import { Pool } from "pg";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import { createHash } from "crypto";
import { readdirSync } from "fs";

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

async function fixMigrationTracking() {
  const client = await pool.connect();

  try {
    console.log("🔍 Checking migration tracking status...\n");

    const migrationsDir = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "./migrations"
    );
    const migrationFiles = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    console.log(`Found ${migrationFiles.length} migration files\n`);

    const trackedResult = await client.query(
      `SELECT hash FROM __drizzle_migrations`
    );
    const trackedHashes = new Set(trackedResult.rows.map((r) => r.hash));

    console.log(`Currently tracked: ${trackedHashes.size} migrations\n`);

    let added = 0;
    let skipped = 0;

    for (const file of migrationFiles) {
      const filePath = resolve(migrationsDir, file);
      const migrationSQL = readFileSync(filePath, "utf-8");
      const migrationHash = createHash("sha256")
        .update(migrationSQL)
        .digest("hex");

      if (trackedHashes.has(migrationHash)) {
        console.log(`✓ ${file} - already tracked`);
        skipped++;
      } else {
        console.log(`+ ${file} - adding to tracking...`);
        try {
          await client.query(
            `
            INSERT INTO __drizzle_migrations (hash, created_at)
            VALUES ($1, EXTRACT(EPOCH FROM NOW())::bigint)
            ON CONFLICT (hash) DO NOTHING
          `,
            [migrationHash]
          );
          added++;
        } catch (error) {
          console.error(`  ❌ Error: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Migration tracking updated:`);
    console.log(`   - Added: ${added}`);
    console.log(`   - Skipped: ${skipped}`);
  } catch (error) {
    console.error("❌ Error fixing migration tracking:", error.message);

    if (error.code === "42P01") {
      console.log("\n   Creating __drizzle_migrations table...");
      await client.query(`
        CREATE TABLE IF NOT EXISTS __drizzle_migrations (
          id SERIAL PRIMARY KEY,
          hash text NOT NULL UNIQUE,
          created_at bigint
        )
      `);
      console.log("   ✓ Table created, please run this script again");
    } else {
      throw error;
    }
  } finally {
    client.release();
    await pool.end();
  }
}

fixMigrationTracking();
