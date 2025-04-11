export type BusinessExpense = {
  id: number;
  date: string;
  description: string;
  amount: number;
  justification: string | null;
  category?: string;
};
