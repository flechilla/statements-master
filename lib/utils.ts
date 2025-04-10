import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export function getMonthName(date: string): string {
  // Get month name from date format like "12/26", "01/04", etc.
  const monthNum = parseInt(date.split('/')[0]);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNum - 1] || 'Unknown';
}

export function formatCardName(name: string): string {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Fetch data from API
export async function fetchStatements() {
  const response = await fetch('/api/statements');
  if (!response.ok) {
    throw new Error('Failed to fetch statements');
  }
  const data = await response.json();
  return data.statements;
}

export async function fetchStatementById(id: number) {
  const response = await fetch(`/api/statements/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch statement');
  }
  return await response.json();
}

export async function fetchTransactionsByStatementId(id: number) {
  const response = await fetch(`/api/statements/${id}/transactions`);
  if (!response.ok) {
    throw new Error('Failed to fetch transactions');
  }
  const data = await response.json();
  return data.transactions;
}

export async function fetchBanks() {
  const response = await fetch('/api/banks');
  if (!response.ok) {
    throw new Error('Failed to fetch banks');
  }
  const data = await response.json();
  return data.banks;
}

export async function fetchCardsByBank(bankName: string) {
  const response = await fetch(`/api/banks/${encodeURIComponent(bankName)}/cards`);
  if (!response.ok) {
    throw new Error('Failed to fetch cards');
  }
  const data = await response.json();
  return data.cards;
}

export async function searchTransactions(query: string) {
  const response = await fetch(`/api/transactions/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search transactions');
  }
  const data = await response.json();
  return data.transactions;
}
