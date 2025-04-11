import { Statement } from "./statement.type";
import { Transaction } from "./transaction.type";
import { Client } from "./client.type";

export type StatementWithTransactions = Statement & {
  transactions: Transaction[];
  totalAmount: number;
  client?: Client;
};
