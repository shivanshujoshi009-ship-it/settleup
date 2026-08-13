"use client";

import { useEffect, useState } from "react";

import CreateGroupDialog from "@/components/groups/CreateGroupDialog";
import GroupsList from "@/components/groups/GroupsList";

import { getGroups } from "@/services/group.service";
import type { Group } from "@/types/group";

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadGroups() {
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] text-white">
        Loading groups...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] p-10">

      <div className="mb-10 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-white">
            My Groups
          </h1>

          <p className="mt-2 text-slate-400">
            Manage all your expense groups.
          </p>
        </div>

        <CreateGroupDialog
          onGroupCreated={loadGroups}
        />

      </div>

      <GroupsList groups={groups} />

    </main>
  );
}