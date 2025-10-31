import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const migrationsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "./migrations"
);
const migrationFile = resolve(migrationsDir, "0000_previous_mach_iv.sql");

console.log("🔧 Making migration idempotent...\n");

const content = readFileSync(migrationFile, "utf-8");

const modified = content.replace(
  /CREATE TABLE "([^"]+)"/g,
  'CREATE TABLE IF NOT EXISTS "$1"'
);

writeFileSync(migrationFile, modified);

console.log("✅ Migration file updated to use IF NOT EXISTS");
