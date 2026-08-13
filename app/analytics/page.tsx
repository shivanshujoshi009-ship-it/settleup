"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

import { useAuth } from "@/context/AuthProvider";
import { getGroups } from "@/services/group.service";
import { getSettlements } from "@/services/settlement.service";

type Expense = {
  id: string;
  title: string;
  amount: number;
  category?: string | null;
  createdAt: string;
};
type DateRange =
  | "ALL"
  | "THIS_YEAR"
  | "LAST_6_MONTHS"
  | "THIS_MONTH"
  | "LAST_MONTH";

export default function AnalyticsPage() {
  const { dbUser } = useAuth();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] =
  useState<DateRange>("ALL");

  useEffect(() => {
    async function loadAnalytics() {
      if (!dbUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const groupData = await getGroups();

        const groupsWithSettlements =
          await Promise.all(
            groupData.map(async (group: any) => {
              const settlements =
                await getSettlements(group.id);

              return {
                ...group,
                settlements,
              };
            })
          );

        setGroups(groupsWithSettlements);
      } catch (error) {
        console.error(
          "ANALYTICS LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [dbUser?.id]);

  const analytics = useMemo(() => {
    const expenses: Expense[] = groups.flatMap(
      (group) =>
        (group.expenses ?? []).map(
          (expense: any) => ({
            id: expense.id,
            title: expense.title,
            amount: Number(expense.amount),
            category:
              expense.category || "General",
            createdAt: expense.createdAt,
          })
        )
    );



    const now = new Date();

function isWithinRange(
  createdAt: string
): boolean {
  const date = new Date(createdAt);

  switch (dateRange) {
    case "THIS_YEAR":
      return (
        date.getFullYear() === now.getFullYear()
      );

    case "LAST_6_MONTHS": {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(
        sixMonthsAgo.getMonth() - 6
      );

      return date >= sixMonthsAgo;
    }

    case "THIS_MONTH":
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );

    case "LAST_MONTH": {
      const lastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      const start = new Date(
        lastMonth.getFullYear(),
        lastMonth.getMonth(),
        1
      );

      const end = new Date(
        lastMonth.getFullYear(),
        lastMonth.getMonth() + 1,
        1
      );

      return date >= start && date < end;
    }

    case "ALL":
    default:
      return true;
  }
}

const filteredExpenses =
  expenses.filter((expense) =>
    isWithinRange(expense.createdAt)
  );

    const groupSpending = groups
  .map((group: any) => ({
    id: group.id,
    name: group.name,
    amount: (group.expenses ?? []).reduce(
      (sum: number, expense: any) =>
        sum + Number(expense.amount),
      0
    ),
  }))
  .sort((a, b) => b.amount - a.amount);

    const totalSpent = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const averageExpense =
      expenses.length > 0
        ? totalSpent / expenses.length
        : 0;

    const categoryMap = new Map<
      string,
      number
    >();

    for (const expense of expenses) {
      const category =
        expense.category || "General";

      categoryMap.set(
        category,
        (categoryMap.get(category) ?? 0) +
          expense.amount
      );
    }

    const categories = Array.from(
      categoryMap.entries()
    )
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    const topExpenses = [...expenses]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

      const currentYear = new Date().getFullYear();

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthlySpending = (() => {
  const monthMap = new Map<string, number>();

  for (const expense of filteredExpenses) {
    const date = new Date(expense.createdAt);

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    monthMap.set(
      key,
      (monthMap.get(key) ?? 0) +
        Number(expense.amount)
    );
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, amount]) => {
      const [year, month] = key.split("-");

      const date = new Date(
        Number(year),
        Number(month) - 1,
        1
      );

      return {
        month: date.toLocaleString("en-IN", {
          month: "short",
          year: "numeric",
        }),
        amount: Number(amount.toFixed(2)),
      };
    });
})();
    

  return {
  totalSpent,
  averageExpense,
  expenseCount: expenses.length,
  categories,
  topExpenses,
  monthlySpending,
  groupSpending,
};
 }, [groups, dateRange]);

  return (
  <main className="flex min-h-screen bg-[#030712]">
    <Sidebar />

    <div className="flex-1">
      <Header />

      <div className="space-y-8 p-4 pt-20 sm:p-6 md:p-8 md:pt-8">
        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-400">
            Loading analytics...
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Analytics
              </h1>

              <p className="mt-2 text-slate-400">
                Understand your spending patterns.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
  {[
    ["ALL", "All Time"],
    ["THIS_YEAR", "This Year"],
    ["LAST_6_MONTHS", "Last 6 Months"],
    ["THIS_MONTH", "This Month"],
    ["LAST_MONTH", "Last Month"],
  ].map(([value, label]) => (
    <button
      key={value}
      type="button"
      onClick={() =>
        setDateRange(value as DateRange)
      }
      className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
        dateRange === value
          ? "bg-cyan-500 text-slate-950"
          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  ))}
</div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <p className="text-sm text-slate-400">
                  Total Spending
                </p>

                <p className="mt-3 text-3xl font-bold text-cyan-400">
                  ₹
                  {analytics.totalSpent.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <p className="text-sm text-slate-400">
                  Number of Expenses
                </p>

                <p className="mt-3 text-3xl font-bold text-white">
                  {analytics.expenseCount}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <p className="text-sm text-slate-400">
                  Average Expense
                </p>

                <p className="mt-3 text-3xl font-bold text-green-400">
                  ₹
                  {analytics.averageExpense.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {/* Monthly Spending */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-6 text-2xl font-semibold text-white">
                Monthly Spending
              </h2>

              <div className="h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={analytics.monthlySpending}
                  >
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                    />

                    <Tooltip
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      }
                    />

                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#22d3ee"
                      fill="#164e63"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spending by Group */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="mb-6 text-2xl font-semibold text-white">
                Spending by Group
              </h2>

              {analytics.groupSpending.length === 0 ? (
                <p className="text-slate-400">
                  No group spending data yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {analytics.groupSpending.map((group) => (
                    <div
                      key={group.id}
                      className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4"
                    >
                      <span className="font-medium text-white">
                        {group.name}
                      </span>

                      <span className="font-semibold text-cyan-400">
                        ₹
                        {group.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category + Top Expenses */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="mb-6 text-2xl font-semibold text-white">
                  Spending by Category
                </h2>

                {analytics.categories.length === 0 ? (
                  <p className="text-slate-400">
                    No expense data yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {analytics.categories.map((category) => (
                      <div
                        key={category.name}
                        className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4"
                      >
                        <span className="text-white">
                          {category.name}
                        </span>

                        <span className="font-semibold text-cyan-400">
                          ₹
                          {category.amount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="mb-6 text-2xl font-semibold text-white">
                  Top Expenses
                </h2>

                {analytics.topExpenses.length === 0 ? (
                  <p className="text-slate-400">
                    No expense data yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {expense.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {expense.category || "General"}
                          </p>
                        </div>

                        <span className="font-semibold text-red-400">
                          ₹
                          {expense.amount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </main>
);
}
