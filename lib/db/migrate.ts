import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from ".";

async function main() {
  try {
    console.log("Migration started");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration completed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
