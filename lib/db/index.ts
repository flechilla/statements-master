import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as schema from "./tables";

// Validate environment variable
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

console.log(
  `process.env.DATABASE_URL from index.ts: ${process.env.DATABASE_URL}`
);

// Database connection URL from environment
const connectionString = process.env.DATABASE_URL;

// Create a Postgres client for use with Drizzle
export const queryClient = postgres(connectionString);

// Create Drizzle client
export const db = drizzle(queryClient, { schema });
