import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  let workersEnv;
  try {
    workersEnv = env;
  } catch {
    workersEnv = process.env as Record<string, string | undefined>;
  }

  const envTyped = workersEnv as { DB?: D1Database };

  if (!envTyped.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable."
    );
  }

  return drizzle(envTyped.DB, { schema });
}
