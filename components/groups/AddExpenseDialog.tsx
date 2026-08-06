"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createExpense } from "@/services/expense.service";
import { useAuth } from "@/context/AuthProvider";

type Props = {
  groupId: string;
  onExpenseAdded?: () => void;
};
type Member = {
  id: string;
  name?: string;

  user?: {
    id: string;
    name: string;
  } | null;
};

export default function AddExpenseDialog({
  groupId,
  onExpenseAdded,
}: Props) {
  const { dbUser } = useAuth();
  console.log("dbUser:", dbUser);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
 const [splitType, setSplitType] = useState("EQUAL");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

const [exactAmounts, setExactAmounts] = useState<
  Record<string, string>
>({});

const [percentageAmounts, setPercentageAmounts] = useState<
  Record<string, number>
>({});

 useEffect(() => {
  if (!open) return;

  async function loadMembers() {
    const response = await fetch(`/api/groups/${groupId}`);

    const group = await response.json();

    setMembers(group.members);

    setSelectedMembers(
      group.members.map((m: Member) => m.id)
    );

    const values: Record<string, string> = {};
    group.members.forEach((member: Member) => {
      values[member.id] = "";
    });
    setExactAmounts(values);
  }
  loadMembers();
}, [open, groupId]);


async function handleCreate() {
    if (!dbUser) {
      alert("Please login again.");
      return;
    }

    if (!title.trim() || !amount.trim()) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
const exactAmountsNum = Object.fromEntries(
        Object.entries(exactAmounts).map(([key, value]) => [key, Number(value)])
      );
await createExpense(groupId, {
  title,
  amount: Number(amount),
  category,
  notes,
  splitType,
  paidById: dbUser.id,
  members: selectedMembers,
  exactAmounts: exactAmountsNum,
  percentageAmounts,
});

      setTitle("");
      setAmount("");
      setCategory("General");
      setSplitType("EQUAL");
      setNotes("");

      setOpen(false);

      onExpenseAdded?.();

      alert("Expense added successfully.");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        + Add Expense
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Add Expense
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
              />

              <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
              />
               <div>
  <label className="mb-2 block text-sm text-slate-300">
    Split Type
  </label>

  <select
  value={splitType}
  onChange={(e) => setSplitType(e.target.value)}
  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
>
  <option value="EQUAL">Equal</option>
  <option value="EXACT">Exact Amount</option>
</select>
</div>

<div>
  <label className="mb-2 block text-sm text-slate-300">
    Participants
  </label>

  <div className="space-y-2 rounded-xl border border-slate-700 p-3">

    {members.map((member) => {
      const displayName =
        member.user?.name ??
        member.name ??
        "Guest";

      return (
        <label
          key={member.id}
          className="flex items-center gap-3 text-white"
        >
          <input
            type="checkbox"
            checked={selectedMembers.includes(member.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedMembers([
                  ...selectedMembers,
                  member.id,
                ]);
              } else {
                setSelectedMembers(
                  selectedMembers.filter(
                    (id) => id !== member.id
                  )
                );
              }
            }}
          />

          <span>{displayName}</span>
        </label>
      );
    })}

  </div>
</div>

{splitType === "EXACT" && (
  <div className="space-y-3">

    <label className="block text-sm text-slate-300">
      Exact Amounts
    </label>

    {members
      .filter((m) =>
        selectedMembers.includes(m.id)
      )
      .map((member) => {

        const name =
          member.user?.name ??
          member.name ??
          "Guest";

        return (
          <div
            key={member.id}
            className="flex items-center justify-between"
          >

            <span className="text-white">
              {name}
            </span>

            <input
              type="number"
              value={
                exactAmounts[member.id] ?? ""
              }
              onChange={(e) =>
                setExactAmounts({
                  ...exactAmounts,
                  [member.id]:
                    e.target.value,
                })
              }
              className="w-32 rounded-lg border border-slate-700 bg-slate-800 p-2 text-white"
            />

          </div>
        );

      })}
  </div>
)}

{splitType === "PERCENTAGE" && (
  <div>
    <label className="mb-2 block text-sm text-slate-300">
      Percentages
    </label>

    <div className="space-y-3">
      {members
        .filter((m) => selectedMembers.includes(m.id))
        .map((member) => {
          const name =
            member.user?.name ??
            member.name ??
            "Guest";

          return (
            <div
              key={member.id}
              className="flex items-center justify-between"
            >
              <span className="text-white">{name}</span>

              <input
                type="number"
                min="0"
                max="100"
                placeholder="%"
                value={percentageAmounts[member.id] ?? ""}
                onChange={(e) =>
                  setPercentageAmounts({
                    ...percentageAmounts,
                    [member.id]: Number(e.target.value),
                  })
                }
                className="w-28 rounded-xl border border-slate-700 bg-slate-800 p-2 text-white"
              />
            </div>
          );
        })}
    </div>
  </div>
)}

              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white"
              />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Expense"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
