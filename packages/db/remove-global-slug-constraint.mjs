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

async function removeConstraint() {
  const client = await pool.connect();

  try {
    console.log("🔧 Removing global slug unique constraint...\n");

    // Check if constraint exists
    const checkResult = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'articles'
      AND constraint_name = 'articles_slug_unique'
    `);

    if (checkResult.rows.length === 0) {
      console.log("   ✓ Constraint 'articles_slug_unique' doesn't exist");
      console.log("   The database is already correct!");
      return;
    }

    // Drop the constraint
    console.log("1. Dropping 'articles_slug_unique' constraint...");
    await client.query(
      `ALTER TABLE "articles" DROP CONSTRAINT IF EXISTS "articles_slug_unique"`
    );
    console.log("   ✓ Constraint dropped\n");

    // Verify the composite constraint still exists
    console.log("2. Verifying composite constraint exists...");
    const compositeCheck = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'articles'
      AND constraint_name = 'articles_organization_id_slug_unique'
    `);

    if (compositeCheck.rows.length > 0) {
      console.log(
        "   ✓ Composite constraint 'articles_organization_id_slug_unique' exists"
      );
    } else {
      console.log("   ⚠️  Warning: Composite constraint not found!");
    }

    console.log(
      "\n✅ Fixed! Articles can now have duplicate slugs across different organizations."
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

removeConstraint();
