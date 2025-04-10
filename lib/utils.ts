import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type BusinessExpense = {
  date: string
  description: string
  amount: number
  justification: string
}

export type StatementData = {
  statement_period: string
  bank_name: string
  card_name: string
  business_expenses: BusinessExpense[]
  total_business_expenses: number
}

export type CardStatements = {
  cardName: string
  statements: {
    month: string
    monthKey: string
    data: StatementData
  }[]
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
