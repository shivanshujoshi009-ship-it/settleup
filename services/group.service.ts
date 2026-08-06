export interface Split {
  id: string;
  amount: number;

  member: {
    id: string;

    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category?: string;
  notes?: string;
  createdAt: string;

  paidBy: {
    id: string;
    name: string;
  };

  splits: Split[];
}

export interface Member {
  id: string;

  user?: {
    id: string;
    name: string;
    email: string;
  };

  name?: string;
  email?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  createdById: string;

  createdBy?: {
    id: string;
    name: string;
    email: string;
    photoUrl?: string;
  };

  members: Member[];
  expenses: Expense[];
}

// GET ALL GROUPS
export async function getGroups(): Promise<Group[]> {
  const response = await fetch("/api/groups");

  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }

  return response.json();
}

// CREATE GROUP
export async function createGroup(data: {
  name: string;
  description?: string;
  createdById: string;
}) {
  const response = await fetch("/api/groups", {
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
  const response = await fetch(`/api/groups/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete group");
  }

  return response.json();
}

// GET GROUP BY ID
export async function getGroupById(
  id: string
): Promise<Group> {
  const response = await fetch(`/api/groups/${id}`);

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