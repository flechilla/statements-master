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
