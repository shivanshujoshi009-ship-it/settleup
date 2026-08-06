export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  createdAt?: unknown;
}

export interface ExpenseInput {
  groupId: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
}