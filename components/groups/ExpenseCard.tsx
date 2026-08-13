"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import EditExpenseDialog from "./EditExpenseDialog";
import { deleteExpense } from "@/services/expense.service";

import type { Expense } from "@/types/expense";

type Props = {
  expense: Expense;
  groupId: string;
  onExpenseUpdated: () => void;
  selected: boolean;
};

export default function ExpenseCard({
  expense,
  groupId,
  onExpenseUpdated,
  selected,
}: Props) {
  const {
    title,
    amount,
    paidBy,
    splits,
  } = expense;

  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteExpense(expense.id);

      onExpenseUpdated();
    } catch (error: any) {
      console.error("DELETE EXPENSE ERROR:", error);

      alert(
        error.message ||
          "Failed to delete expense."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className={`rounded-xl border p-5 transition ${
        selected
          ? "border-cyan-400 bg-cyan-400/5 shadow-lg shadow-cyan-500/10"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {title}
          </h3>

          <p className="mt-2 text-slate-400">
            Paid by{" "}
            <span className="font-medium text-white">
              {paidBy.name}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-xl font-bold text-cyan-400">
            ₹{amount}
          </span>

          <div className="flex gap-2">
            <EditExpenseDialog
              expense={expense}
              groupId={groupId}
              onExpenseUpdated={onExpenseUpdated}
            />

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 size={16} />

              {deleting
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-700 pt-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Split Details
        </h4>

        {splits.length === 0 ? (
          <p className="text-sm text-slate-500">
            No split records found.
          </p>
        ) : (
          <div className="space-y-2">
            {splits.map((split) => (
              <div
                key={split.id}
                className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2"
              >
                <span className="text-white">
                  {split.member.user?.name ??
                    split.member.name ??
                    "Guest"}
                </span>

                <span className="font-semibold text-cyan-400">
                  ₹{split.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}