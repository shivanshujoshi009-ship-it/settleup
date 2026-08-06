"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createGroup } from "@/services/group.service";
import { useAuth } from "@/context/AuthProvider";

type Props = {
  onGroupCreated?: () => void;
};

export default function CreateGroupDialog({
  onGroupCreated,
}: Props) {
  const {
    dbUser,
    loading: authLoading,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    console.log("========== CREATE GROUP ==========");

    if (authLoading) {
      alert("Please wait...");
      return;
    }

    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }

    console.log("Group Name:", groupName);
    console.log("dbUser:", dbUser);
console.log("createdById:", dbUser?.id);

    if (!dbUser) {
      alert("Please login again.");
      return;
    }

    try {
      setCreating(true);

      const group = await createGroup({
        name: groupName.trim(),
        description: "",
        createdById: dbUser.id,
      });

      console.log("Group created:", group);

      alert("Group created successfully!");

      setGroupName("");
      setOpen(false);

      onGroupCreated?.();

    } catch (error) {
      console.error(error);
      alert("Failed to create group.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        + New Group
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Create Group
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-3xl text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none"
            />

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}