// Database types
export type Statement = {
  id: number;
  statementPeriod: string;
  bankName: string;
  cardName: string;
  createdAt: string;
};

export type Transaction = {
  id: number;
  statementId: number;
  date: string;
  description: string;
  amount: number;
  justification: string | null;
  category: string;
  createdAt: string;
};

// UI types
export type BusinessExpense = {
  id: number;
  date: string;
  description: string;
  amount: number;
  justification: string | null;
  category?: string;
};

export type StatementWithTransactions = Statement & {
  transactions: Transaction[];
  totalAmount: number;
};

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

export type SelectableExpense = BusinessExpense & {
  isSelected: boolean;
  cardName: string;
  bankName: string;
  month: string;
  statementId: number;
};