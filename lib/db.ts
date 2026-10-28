import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export function getSql() {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured. Add it in Vercel Project Settings → Environment Variables.");
  }
  return neon(databaseUrl);
}
