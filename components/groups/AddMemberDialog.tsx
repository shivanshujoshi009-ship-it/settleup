"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addMember } from "@/services/member.service";

type Props = {
  groupId: string;
  onMemberAdded?: () => void;
};

export default function AddMemberDialog({
  groupId,
  onMemberAdded,
}: Props) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!name.trim()) {
      alert("Please enter a name.");
      return;
    }

    try {
      setLoading(true);

      await addMember(groupId, {
        name: name.trim(),
        email: email.trim(),
      });

      alert("Member added successfully.");

      setName("");
      setEmail("");

      setOpen(false);

      onMemberAdded?.();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        + Add Member
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
              Add Member
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Member Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
              />

              <input
                type="email"
                placeholder="Email (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
              />

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={handleAdd}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Member"}
              </Button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}