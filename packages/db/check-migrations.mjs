import { Pool } from "pg";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkMigrations() {
  const client = await pool.connect();

  try {
    console.log("📊 Checking migration state...\n");

    const result = await client.query(
      `SELECT hash, created_at FROM __drizzle_migrations ORDER BY created_at`
    );

    console.log(`Migrations in tracking table: ${result.rows.length}\n`);
    result.rows.forEach((row, idx) => {
      console.log(`${idx + 1}. Hash: ${row.hash.substring(0, 16)}...`);
    });

    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log(`\n📋 Tables in database: ${tablesResult.rows.length}`);
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkMigrations();
