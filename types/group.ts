import type { Expense } from "./expense";
import type { Member } from "./member";

export interface Group {
  id: string;

  name: string;

  members: Member[];

  expenses: Expense[];
}