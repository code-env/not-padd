import { Pool } from "pg";
import { readFileSync, readdirSync } from "fs";
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

async function markAllMigrationsApplied() {
  const client = await pool.connect();

  try {
    console.log("🔧 Marking all migrations as applied...\n");

    const migrationsDir = resolve(
      dirname(fileURLToPath(import.meta.url)),
      "./migrations"
    );
    const migrationFiles = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql") && !f.includes("_fixed"))
      .sort();

    console.log(`Found ${migrationFiles.length} migration files\n`);

    console.log("1. Clearing existing migration tracking...");
    await client.query(`DELETE FROM __drizzle_migrations`);
    console.log("   ✓ Cleared\n");

    console.log("2. Marking migrations as applied...");
    let added = 0;

    for (const file of migrationFiles) {
      const filePath = resolve(migrationsDir, file);
      const migrationSQL = readFileSync(filePath, "utf-8");

      const normalizedSQL = migrationSQL.trim();

      let migrationHash = createHash("sha256")
        .update(migrationSQL)
        .digest("hex");

      try {
        const journalPath = resolve(
          migrationsDir,
          "../migrations/meta/_journal.json"
        );
        let timestamp = Date.now();

        try {
          const journal = JSON.parse(readFileSync(journalPath, "utf-8"));
          const entry = journal.entries.find(
            (e) => e.tag === file.replace(".sql", "")
          );
          if (entry && entry.when) {
            timestamp = entry.when;
          }
        } catch (e) {}

        await client.query(
          `
          INSERT INTO __drizzle_migrations (hash, created_at)
          VALUES ($1, $2)
          ON CONFLICT (hash) DO UPDATE SET created_at = EXCLUDED.created_at
        `,
          [migrationHash, Math.floor(timestamp / 1000)]
        );

        console.log(`   ✓ ${file}`);
        added++;
      } catch (error) {
        console.error(`   ❌ ${file}: ${error.message}`);
      }
    }

    console.log(`\n✅ Successfully marked ${added} migrations as applied!`);
    console.log("\nYou can now run: pnpm db:migrate");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("\nFull error:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

markAllMigrationsApplied();
