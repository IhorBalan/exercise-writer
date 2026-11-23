import { sql } from "drizzle-orm";

import { getDb } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true, db: "reachable" });
  } catch (err) {
    console.error("[health] database check failed", err);
    return Response.json({ ok: false, db: "unreachable" }, { status: 503 });
  }
}
