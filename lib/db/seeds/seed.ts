import { seedClients } from "./clients.seed";
import { seedStatements } from "./statements.seed";
import { seedTransactions } from "./transactions.seed";

/**
 * Main seeding function that orchestrates all seeding operations
 */
async function seed() {
  try {
    console.log("🌱 Database seeding started");

    // Step 1: Seed clients
    console.log("\n📋 Seeding clients...");
    const clients = await seedClients();
    console.log(`✅ Successfully inserted ${clients.length} clients`);

    // Step 2: Seed statements and transactions from statement files
    console.log("\n📊 Seeding statements and their transactions...");
    const { statementsCount, transactionsCount } = await seedStatements();
    console.log(
      `✅ Successfully inserted ${statementsCount} statements and ${transactionsCount} transactions`
    );

    // Step 3: Seed additional transactions not part of statements
    console.log("\n💵 Seeding additional transactions...");
    const { count: additionalTransactionsCount } = await seedTransactions();
    console.log(
      `✅ Successfully inserted ${additionalTransactionsCount} additional transactions`
    );

    // All done!
    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Execute the seeding function
seed();
