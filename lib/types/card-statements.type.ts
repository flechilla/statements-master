import { BusinessExpense } from "./business-expense.type";

export type CardStatements = {
  cardName: string;
  bankName: string;
  statements: {
    id: number;
    month: string;
    statementPeriod: string;
    totalAmount: number;
    transactions: BusinessExpense[];
  }[];
};
