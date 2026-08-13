"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

type Expense = {
  amount: number;
  createdAt: string;
};

type Props = {
  expenses: Expense[];
};

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

export default function ExpenseChart({
  expenses,
}: Props) {
  const currentYear = new Date().getFullYear();

  const monthlyTotals = monthNames.map(
    (month, index) => {
      const amount = expenses
        .filter((expense) => {
          const date = new Date(expense.createdAt);

          return (
            date.getFullYear() === currentYear &&
            date.getMonth() === index
          );
        })
        .reduce(
          (total, expense) =>
            total + Number(expense.amount),
          0
        );

      return {
        month,
        amount: Number(amount.toFixed(2)),
      };
    }
  );

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Monthly Spending
      </h2>

      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={monthlyTotals}>
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
  );
}