
import type { Group } from "@/types/group";
import { apiFetch } from "@/services/api-client";

// GET ALL GROUPS
export async function getGroups(): Promise<Group[]> {
  const response = await apiFetch("/api/groups");

  if (!response.ok) {
    const text = await response.text();

    console.error(
      "GET GROUPS STATUS:",
      response.status
    );

    console.error(
      "GET GROUPS RESPONSE:",
      text
    );

    throw new Error(
      `Failed to fetch groups (${response.status})`
    );
  }

  return response.json();
}

// CREATE GROUP
export async function createGroup(data: {
  name: string;
  description?: string;
  createdById: string;
}) {
  const response = await apiFetch("/api/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create group");
  }

  return response.json();
}

// DELETE GROUP
export async function deleteGroup(id: string) {
  const response = await apiFetch(
    `/api/groups/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const result = await response.json();

    throw new Error(
      result.message ||
        "Failed to delete group"
    );
  }

  return response.json();
}

// GET GROUP BY ID
export async function getGroupById(
  id: string
): Promise<Group> {
  const response = await apiFetch(
  `/api/groups/${id}`
);
  if (!response.ok) {
    const text = await response.text();
    console.error("Status:", response.status);
    console.error("Response:", text);

    throw new Error(
      `Group request failed (${response.status})`
    );
  }

  return response.json();
}
