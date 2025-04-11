import { db } from "./index";
import { clients, statements, transactions } from "./schema/index";
import { eq, and, like, desc, sql } from "drizzle-orm";

// Get all statements
export async function getAllStatements() {
  return db.select().from(statements).orderBy(desc(statements.createdAt));
}

// Get statement by ID
export async function getStatementById(id: number) {
  return db.select().from(statements).where(eq(statements.id, id)).limit(1);
}

// Get statement by bank and card name
export async function getStatementsByCard(bankName: string, cardName: string) {
  return db
    .select()
    .from(statements)
    .where(
      and(eq(statements.bankName, bankName), eq(statements.cardName, cardName))
    )
    .orderBy(desc(statements.createdAt));
}

// Get all transactions for a statement
export async function getTransactionsByStatementId(statementId: number) {
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.statementId, statementId))
    .orderBy(desc(transactions.amount));
}

// Get transaction by ID
export async function getTransactionById(id: number) {
  return db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
}

// Search transactions by description
export async function searchTransactions(searchTerm: string) {
  return db
    .select()
    .from(transactions)
    .where(like(transactions.description, `%${searchTerm}%`))
    .orderBy(desc(transactions.amount));
}

// Get total amount for a specific statement
export async function getTotalAmountByStatementId(statementId: number) {
  const result = await db
    .select({
      total: sql<number>`sum(${transactions.amount})`,
    })
    .from(transactions)
    .where(eq(transactions.statementId, statementId));

  return result[0]?.total || 0;
}

// Get all unique banks
export async function getAllBanks() {
  const result = await db
    .select({ bankName: statements.bankName })
    .from(statements)
    .groupBy(statements.bankName);

  return result.map((r) => r.bankName);
}

// Get all card names for a specific bank
export async function getCardsByBank(bankName: string) {
  const result = await db
    .select({ cardName: statements.cardName })
    .from(statements)
    .where(eq(statements.bankName, bankName))
    .groupBy(statements.cardName);

  return result.map((r) => r.cardName);
}

// Client-related queries
// Get all clients
export async function getAllClients() {
  return db.select().from(clients).orderBy(desc(clients.createdAt));
}

// Get client by ID
export async function getClientById(id: number) {
  return db.select().from(clients).where(eq(clients.id, id)).limit(1);
}

// Get client by email
export async function getClientByEmail(email: string) {
  return db.select().from(clients).where(eq(clients.email, email)).limit(1);
}

// Get all statements for a client
export async function getStatementsByClientId(clientId: number) {
  return db
    .select()
    .from(statements)
    .where(eq(statements.clientId, clientId))
    .orderBy(desc(statements.createdAt));
}

// Search clients by name
export async function searchClientsByName(searchTerm: string) {
  return db
    .select()
    .from(clients)
    .where(like(clients.name, `%${searchTerm}%`))
    .orderBy(clients.name);
}
