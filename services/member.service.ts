import { apiFetch } from "@/services/api-client";
export async function addMember(
  groupId: string,
  data: {
    name: string;
    email?: string;
  }
) {
  const response = await apiFetch(
  `/api/groups/${groupId}/members`,
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
      result.message || "Failed to add member"
    );
  }

  return result;
}