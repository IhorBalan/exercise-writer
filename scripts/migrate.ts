/**
 * Applies pending Drizzle migrations from ./drizzle.
 * Runs as part of the Vercel build (see vercel.json), so a tagged release
 * ships schema and code together. Skips quietly when no database URL is set
 * (local builds, CI).
 */
import "dotenv/config";
import { existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] No DATABASE_URL set, skipping migrations.");
    return;
  }
  if (!existsSync("./drizzle/meta/_journal.json")) {
    console.log("[migrate] No migrations yet, skipping.");
    return;
  }
  const db = drizzle(neon(url));
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] Migrations applied.");
}

main().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
