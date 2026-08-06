"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", amount: 4200 },
  { month: "Feb", amount: 3100 },
  { month: "Mar", amount: 5200 },
  { month: "Apr", amount: 4300 },
  { month: "May", amount: 6100 },
  { month: "Jun", amount: 4700 },
];

export default function ExpenseChart() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Monthly Spending
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
            />

            <Tooltip />

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