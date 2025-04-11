import { StatementViewer } from "@/components/statement";
import { db } from "@/lib/db";
import { statements, transactions } from "@/lib/db/schema";
import { CardStatements } from "@/lib/types";
import { getMonthName } from "@/lib/utils";
import Link from "next/link";
import { eq } from "drizzle-orm";

// Server-side function to get all statements with transactions
async function getAllStatementsWithTransactions(): Promise<CardStatements[]> {
  // Get all statements
  const statementsData = await db
    .select()
    .from(statements)
    .orderBy(statements.createdAt);

  // Group statements by card name and bank
  const cardMap = new Map<
    string,
    {
      bankName: string;
      statements: Array<{
        id: number;
        month: string;
        statementPeriod: string;
        totalAmount: number;
        transactions: Array<{
          id: number;
          date: string;
          description: string;
          amount: number;
          justification: string | null;
          category?: string;
        }>;
      }>;
    }
  >();

  for (const statement of statementsData) {
    const key = statement.cardName;

    if (!cardMap.has(key)) {
      cardMap.set(key, {
        bankName: statement.bankName,
        statements: [],
      });
    }

    // Get transactions for this statement
    const transactionsData = await db
      .select()
      .from(transactions)
      .where(eq(transactions.statementId, statement.id));

    // Calculate total amount
    const totalAmount = transactionsData.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );

    // Get month from statement period or first transaction
    let month = "Unknown";
    if (transactionsData.length > 0) {
      month = getMonthName(transactionsData[0].date);
    }

    // Add statement with transactions to the map
    cardMap.get(key)?.statements.push({
      id: statement.id,
      month: month,
      statementPeriod: statement.statementPeriod,
      totalAmount: totalAmount,
      transactions: transactionsData.map((t) => ({
        id: t.id,
        date: t.date,
        description: t.description,
        amount: Number(t.amount),
        justification: t.justification,
        category: t.category || undefined,
      })),
    });
  }

  // Convert map to array
  const result: CardStatements[] = [];
  cardMap.forEach((value, key) => {
    result.push({
      cardName: key,
      bankName: value.bankName,
      statements: value.statements,
    });
  });

  return result;
}

export default async function Home() {
  const cardStatements = await getAllStatementsWithTransactions();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Statement Master</h1>
          <p className="text-muted-foreground">
            Visualize and track your business expenses from credit card
            statements
          </p>
          <div className="mt-4">
            <Link
              href="/upload"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Upload New Statement
            </Link>
          </div>
        </header>

        <main>
          <StatementViewer cardStatements={cardStatements} />
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Statement Master | Business Expense
            Tracker
          </p>
        </footer>
      </div>
    </div>
  );
}
