import { BusinessExpense } from "./business-expense.type";

export type SelectableExpense = BusinessExpense & {
  isSelected: boolean;
  cardName: string;
  bankName: string;
  month: string;
  statementId: number;
};
