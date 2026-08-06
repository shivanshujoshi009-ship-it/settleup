export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  notes: string;
  createdAt: string;
}

export async function getExpenses(groupId: string): Promise<Expense[]> {
  const response = await fetch(
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
}
) {
  const response = await fetch(
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