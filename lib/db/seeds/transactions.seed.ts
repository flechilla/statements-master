import { db } from "../index";
import { transactions } from "../schema";
import { Transaction } from "../types";

/**
 * Seed additional transactions that aren't part of statements
 * This can be used for adding test data or other specialized transaction records
 */
export async function seedTransactions() {
  try {
    console.log("Seeding additional transactions started");

    // Define sample additional transactions data
    // You can modify or expand this as needed
    const additionalTransactions: Transaction[] = [
      // Example of manual transactions - uncomment and modify as needed
      /*
      {
        statementId: null, // For transactions not associated with a statement
        date: "2023-12-15",
        description: "Test transaction 1",
        amount: "150.00",
        justification: "Software subscription",
        category: "software",
      },
      {
        statementId: null,
        date: "2023-12-20",
        description: "Test transaction 2",
        amount: "74.99",
        justification: "Office supplies",
        category: "office",
      },
      */
    ];

    // Skip if no additional transactions to insert
    if (additionalTransactions.length === 0) {
      console.log("No additional transactions to seed");
      return { count: 0 };
    }

    // Insert additional transactions
    const insertedTransactions = await db
      .insert(transactions)
      .values(additionalTransactions)
      .returning();

    console.log(
      `Inserted ${insertedTransactions.length} additional transactions`
    );
    return { count: insertedTransactions.length };
  } catch (error) {
    console.error("Additional transactions seeding failed:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedTransactions()
    .then(({ count }) => {
      console.log(
        `Additional transactions seeding completed successfully: ${count} inserted`
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("Additional transactions seeding script failed:", error);
      process.exit(1);
    });
}
