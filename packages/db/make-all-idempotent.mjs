import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const migrationsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "./migrations"
);
const migrationFile = resolve(migrationsDir, "0000_previous_mach_iv.sql");

console.log("🔧 Making all ALTER TABLE statements idempotent...\n");

let content = readFileSync(migrationFile, "utf-8");

// Already done: CREATE TABLE -> CREATE TABLE IF NOT EXISTS
// Now handle ALTER TABLE ADD CONSTRAINT -> use DO block to check if exists first

// Pattern: ALTER TABLE "table" ADD CONSTRAINT "name" FOREIGN KEY...
// We'll wrap it in a DO block that checks if constraint exists
const alterTableRegex = /ALTER TABLE "([^"]+)" ADD CONSTRAINT "([^"]+)" ([^;]+);/g;

content = content.replace(alterTableRegex, (match, table, constraint, rest) => {
  return `DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = '${constraint}'
  ) THEN
    ALTER TABLE "${table}" ADD CONSTRAINT "${constraint}" ${rest};
  END IF;
END $$;`;
});

writeFileSync(migrationFile, content);

console.log("✅ All ALTER TABLE statements made idempotent!");
console.log("The migration should now run without errors even if constraints exist.");
