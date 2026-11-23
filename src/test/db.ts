import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import * as schema from "@/db/schema";
import { seedProgram } from "@/db/seed";

/** A fresh in-memory Postgres with the real migrations and program data. */
export async function createTestDb() {
  const db = drizzle(new PGlite(), { schema });
  await migrate(db, { migrationsFolder: "./drizzle" });
  await seedProgram(db);
  return db;
}
