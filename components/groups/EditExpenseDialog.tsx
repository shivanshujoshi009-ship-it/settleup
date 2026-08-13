"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateExpense } from "@/services/expense.service";

import type { Expense } from "@/types/expense";
import type { Member } from "@/types/member";
import { useAuth } from "@/context/AuthProvider";

import { apiFetch } from "@/services/api-client";

type Props = {
  expense: Expense;
  groupId: string;
  onExpenseUpdated?: () => void;
};


export default function EditExpenseDialog({
  expense,
  groupId,
  onExpenseUpdated,
}: Props)  {
  const { dbUser } = useAuth();
  

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(expense.title);

const [amount, setAmount] = useState(
  expense.amount.toString()
);

const [category, setCategory] = useState(
  expense.category || "General"
);

const [splitType, setSplitType] = useState(
  expense.splitType
);

const [notes, setNotes] = useState(
  expense.notes || ""
);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

const [exactAmounts, setExactAmounts] = useState<
  Record<string, string>
>({});

const [percentageAmounts, setPercentageAmounts] = useState<
  Record<string, number>
>({});

const [shareAmounts, setShareAmounts] = useState<
  Record<string, number>
>({});


useEffect(() => {
  async function loadMembers() {
    try {
  const response = await apiFetch(
  `/api/groups/${groupId}/members`
);

if (!response.ok) {
  const text = await response.text();

  console.error(
    "LOAD MEMBERS STATUS:",
    response.status
  );

  console.error(
    "LOAD MEMBERS RESPONSE:",
    text
  );

  throw new Error(
    `Failed to load members (${response.status})`
  );
}

const text = await response.text();



const data: Member[] = text
  ? JSON.parse(text)
  : [];

      setMembers(data);

      // Members participating in this expense
      const selected = expense.splits.map(
        (split) => split.member.id
      );

      setSelectedMembers(selected);


      // Populate Exact Amounts
      const exact: Record<string, string> = {};

      expense.splits.forEach((split) => {
        exact[split.member.id] =
          split.amount.toString();
      });

      setExactAmounts(exact);

      // Populate Percentages
      const percentage: Record<string, number> = {};

      expense.splits.forEach((split) => {
        percentage[split.member.id] = Number(
          (
            (split.amount / expense.amount) *
            100
          ).toFixed(2)
        );
      });

      setPercentageAmounts(percentage);

      // Populate Shares
      const shares: Record<string, number> = {};

      expense.splits.forEach((split) => {
        shares[split.member.id] = 1;
      });

      setShareAmounts(shares);

    } catch (error) {
      console.error(error);
    }
  }

  loadMembers();
}, [groupId, expense]);

async function handleUpdate() {
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

    await updateExpense(expense.id, {
      title,
      amount: Number(amount),
      category,
      notes,
      splitType,
      paidById: dbUser.id,
      members: selectedMembers,
      exactAmounts: Object.fromEntries(
        Object.entries(exactAmounts).map(([k, v]) => [
          k,
          Number(v),
        ])
      ),
      percentageAmounts,
      shareAmounts,
    });

    setOpen(false);

    onExpenseUpdated?.();

    alert("Expense updated successfully.");

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
  Edit Expense
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
  <option value="PERCENTAGE">Percentage</option>
  <option value="SHARES">Shares</option>
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
  <div className="space-y-3">

    <label className="block text-sm text-slate-300">
      Percentages
    </label>

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
            <span className="text-white">
              {name}
            </span>

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
)}

{splitType === "SHARES" && (
  <div className="space-y-3">

    <label className="block text-sm text-slate-300">
      Shares
    </label>

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
            <span className="text-white">
              {name}
            </span>

            <input
              type="number"
              min="1"
              placeholder="Shares"
              value={shareAmounts[member.id] ?? ""}
              onChange={(e) =>
                setShareAmounts({
                  ...shareAmounts,
                  [member.id]: Number(e.target.value),
                })
              }
              className="w-28 rounded-xl border border-slate-700 bg-slate-800 p-2 text-white"
            />
          </div>
        );

      })}

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
  onClick={handleUpdate}
  disabled={loading}
>
  {loading ? "Updating..." : "Save Changes"}
</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
