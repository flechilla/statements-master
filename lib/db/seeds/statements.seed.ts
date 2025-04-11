import fs from "fs";
import path from "path";
import { db } from "../index";
import { clients, statements, transactions } from "../schema";
import { count, eq } from "drizzle-orm";

interface JsonStatement {
  statement_period: string;
  bank_name: string;
  card_name: string;
  business_expenses: {
    date: string;
    description: string;
    amount: number;
    justification: string;
  }[];
  total_business_expenses: number;
}

export async function seedStatements() {
  try {
    console.log("Seeding statements started");

    // check if statements table is empty
    const statementsCount = await db
      .select({ count: count() })
      .from(statements);
    if (statementsCount[0].count > 0) {
      console.log("Statements table is not empty, skipping");
      return;
    }

    const mainClient = await db
      .select()
      .from(clients)
      .where(eq(clients.email, "adriano@example.com"))
      .limit(1);

    if (mainClient.length === 0) {
      console.log("Main client not found, skipping");
      return;
    }

    // Define card folders to process
    const cardFolders = ["chase-freedom", "chase-unlimited", "amex-gold"];
    let totalStatementsInserted = 0;
    let totalTransactionsInserted = 0;

    for (const folder of cardFolders) {
      console.log(`Processing ${folder} statements`);
      const folderPath = path.join(process.cwd(), "data", folder);

      // Check if folder exists
      if (!fs.existsSync(folderPath)) {
        console.log(`Folder ${folderPath} does not exist, skipping`);
        continue;
      }

      // Get all JSON files in the folder
      const files = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".json"));

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        console.log(`Processing ${filePath}`);

        // Read and parse the JSON file
        const data = JSON.parse(
          fs.readFileSync(filePath, "utf8")
        ) as JsonStatement;

        // Insert statement
        const [statement] = await db
          .insert(statements)
          .values({
            statementPeriod: data.statement_period,
            bankName: data.bank_name,
            cardName: data.card_name,
            clientId: mainClient[0].id,
          })
          .returning({ id: statements.id });

        totalStatementsInserted++;

        // Insert transactions
        if (data.business_expenses && data.business_expenses.length > 0) {
          const transactionsToInsert = data.business_expenses.map(
            (expense) => ({
              statementId: statement.id,
              date: expense.date,
              description: expense.description,
              amount: String(expense.amount),
              justification: expense.justification || null,
              category: "business_expense",
            })
          );

          await db.insert(transactions).values(transactionsToInsert);
          totalTransactionsInserted += transactionsToInsert.length;
          console.log(
            `Inserted ${transactionsToInsert.length} transactions for statement ${statement.id}`
          );
        }
      }
    }

    console.log(
      `Seeding completed: ${totalStatementsInserted} statements and ${totalTransactionsInserted} transactions inserted`
    );
    return {
      statementsCount: totalStatementsInserted,
      transactionsCount: totalTransactionsInserted,
    };
  } catch (error) {
    console.error("Statements seeding failed:", error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedStatements()
    .then(() => {
      console.log("Statements seeding script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Statements seeding script failed:", error);
      process.exit(1);
    });
}
