import fs from "fs";
import path from "path";
import { db } from "./index";
import { statements, transactions } from "./schema";

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

async function seed() {
  try {
    console.log("Seeding started");

    // Define card folders to process
    const cardFolders = ["chase-freedom", "chase-unlimited", "amex-gold"];

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
          })
          .returning({ id: statements.id });

        // Insert transactions
        if (data.business_expenses && data.business_expenses.length > 0) {
          const transactionsToInsert = data.business_expenses.map(
            (expense) => ({
              statementId: statement.id,
              date: expense.date,
              description: expense.description,
              amount: expense.amount,
              justification: expense.justification || null,
              category: "business_expense",
            })
          );

          await db.insert(transactions).values(transactionsToInsert);
          console.log(
            `Inserted ${transactionsToInsert.length} transactions for statement ${statement.id}`
          );
        }
      }
    }

    console.log("Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
