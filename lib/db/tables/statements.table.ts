import {
  pgTable,
  serial,
  text,
  numeric,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const statements = pgTable("statements", {
  id: serial("id").primaryKey(),
  statementPeriod: text("statement_period").notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  cardName: varchar("card_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  statementId: serial("statement_id").references(() => statements.id),
  date: text("date").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  justification: varchar("justification", { length: 1000 }),
  category: varchar("category", { length: 255 }).default("business_expense"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
