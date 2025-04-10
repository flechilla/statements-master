import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { statements, transactions } from "@/lib/db/schema/statements.table"

export async function POST(request: Request) {
  try {
    const { statementPeriod, bankName, cardName, transactions: transactionsList } = await request.json()
    
    // Basic validation
    if (!statementPeriod || !bankName || !cardName || !transactionsList || !Array.isArray(transactionsList)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create statement record
    const [statementResult] = await db
      .insert(statements)
      .values({
        statementPeriod,
        bankName,
        cardName,
      })
      .returning({ id: statements.id })

    const statementId = statementResult.id

    // Create transaction records
    if (transactionsList.length > 0) {
      await db.insert(transactions).values(
        transactionsList.map((tx: { date: string; description: string; amount: number; category: string }) => ({
          statementId,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          category: tx.category,
          justification: null, // Can be filled in later by user
        }))
      )
    }

    return NextResponse.json({ id: statementId }, { status: 201 })
  } catch (error) {
    console.error("Error creating statement:", error)
    return NextResponse.json(
      { error: "Failed to create statement" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get all statements with their transactions
    const results = await db.query.statements.findMany({
      with: {
        transactions: true,
      },
      orderBy: (statements, { desc }) => [desc(statements.createdAt)],
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching statements:", error)
    return NextResponse.json(
      { error: "Failed to fetch statements" },
      { status: 500 }
    )
  }
}