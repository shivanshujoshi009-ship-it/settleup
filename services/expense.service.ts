import { apiFetch } from "@/services/api-client";
export interface Split {
  id: string;
  amount: number;

  member: {
    id: string;
    name?: string;

    user?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
}

export type Expense = {
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
};

export async function getExpenses(groupId: string): Promise<Expense[]> {
  const response = await apiFetch(
    `/api/groups/${groupId}/expenses`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return response.json();
}

export async function createExpense(
  groupId: string,
  data: {
    title: string;
    amount: number;
    category?: string;
    notes?: string;
    splitType: string;
    paidById: string;

    members: string[];

    exactAmounts?: Record<string, number>;
    percentageAmounts?: Record<string, number>;
    shareAmounts?: Record<string, number>;
  }
): Promise<Expense> {
  const response = await apiFetch(
    `/api/groups/${groupId}/expenses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create expense"
    );
  }

  return result;
}

// GET SINGLE EXPENSE
export async function getExpenseById(
  expenseId: string
): Promise<Expense> {

  const response = await apiFetch(
    `/api/expenses/${expenseId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch expense"
    );
  }

  return response.json();
}

// UPDATE EXPENSE
export async function updateExpense(
  expenseId: string,
  data: {
    title: string;
    amount: number;
    category?: string;
    notes?: string;
    splitType: string;
    paidById: string;

    members: string[];

    exactAmounts?: Record<string, number>;
    percentageAmounts?: Record<string, number>;
    shareAmounts?: Record<string, number>;
  }
) {

  const response = await apiFetch(
  `/api/expenses/${expenseId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update expense"
    );
  }

  return result;
}

// DELETE EXPENSE
export async function deleteExpense(
  expenseId: string
) {

  const response = await apiFetch(
    `/api/expenses/${expenseId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete expense"
    );
  }

  return response.json();
}
