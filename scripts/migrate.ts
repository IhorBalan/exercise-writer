/**
 * Applies pending Drizzle migrations from ./drizzle, then upserts the Big Six
 * program data. Runs as part of the Vercel build (see vercel.json), so each
 * deploy ships schema, data and code together. Skips quietly when no database
 * URL is set (local builds, CI).
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import * as schema from "../src/db/schema";
import { seedProgram } from "../src/db/seed";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) {
    console.log("[migrate] No DATABASE_URL set, skipping migrations.");
    return;
  }
  const db = drizzle(neon(url), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("[migrate] Migrations applied.");
  const seeded = await seedProgram(db);
  console.log(`[migrate] Program data upserted: ${seeded.movements} movements, ${seeded.steps} steps.`);
}

main().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
