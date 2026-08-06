export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  paidBy: string;
  title: string;
  amount: number;
  splitBetween: string[];
  createdAt: string;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: "pending" | "paid";
}