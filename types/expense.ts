import type { Member } from "./member";

export interface Split {
  id: string;
  amount: number;

  member: Member;
}

export interface Expense {
  id: string;

  title: string;
  amount: number;

  category?: string;
  notes?: string;

  splitType: string;

  createdAt: string;

  paidBy: {
    id: string;
    name: string;
  };

  splits: Split[];
}