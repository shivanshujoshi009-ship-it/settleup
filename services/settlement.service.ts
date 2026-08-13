import { apiFetch } from "@/services/api-client";
export async function settleExpenses() {
 
}

export interface Settlement {
  id: string;
  amount: number;
  createdAt: string;

  groupId: string;

  payer: {
    id: string;
    name?: string;

    user?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };

  receiver: {
    id: string;
    name?: string;

    user?: {
      id: string;
      name: string;
      email: string;
    } | null;
  };
}

// GET SETTLEMENTS
export async function getSettlements(
  groupId: string
): Promise<Settlement[]> {
  const response = await apiFetch(
    `/api/groups/${groupId}/settlements`
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch settlements"
    );
  }

  return result;
}

// CREATE SETTLEMENT
export async function createSettlement(
  groupId: string,
  data: {
    payerId: string;
    receiverId: string;
    amount: number;
  }
): Promise<Settlement> {
  const response = await apiFetch(
    `/api/groups/${groupId}/settlements`,
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
      result.message ||
        "Failed to create settlement"
    );
  }

  return result;
}