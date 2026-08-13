"use client";

import {
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

type RecentExpense = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
  type: "expense" | "income";
};

type Props = {
  expenses: RecentExpense[];
};

export default function RecentExpenses({
  expenses,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Recent Expenses
      </h2>

      {expenses.length === 0 ? (
        <p className="text-slate-400">
          No recent expenses.
        </p>
      ) : (
        <div className="space-y-4">
          {expenses.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl bg-slate-800/50 p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-xl p-3 ${
                    item.type === "income"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {item.type === "income" ? (
                    <ArrowDownLeft size={20} />
                  ) : (
                    <ArrowUpRight size={20} />
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-white">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {new Date(
                      item.createdAt
                    ).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <span
                className={`font-semibold ${
                  item.type === "income"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {item.type === "income" ? "+" : "-"}₹
                {item.amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}