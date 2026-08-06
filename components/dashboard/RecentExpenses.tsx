"use client";

import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const expenses = [
  {
    title: "Dinner at BBQ Nation",
    date: "Today • 8:30 PM",
    amount: "-₹1,250",
    type: "expense",
  },
  {
    title: "Rahul Paid You",
    date: "Yesterday",
    amount: "+₹850",
    type: "income",
  },
  {
    title: "Goa Trip Hotel",
    date: "2 days ago",
    amount: "-₹4,600",
    type: "expense",
  },
  {
    title: "Flat Rent",
    date: "5 days ago",
    amount: "-₹7,500",
    type: "expense",
  },
];

export default function RecentExpenses() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Recent Expenses
      </h2>

      <div className="space-y-4">
        {expenses.map((item) => (
          <div
            key={item.title}
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
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.date}</p>
              </div>
            </div>

            <span
              className={`font-semibold ${
                item.type === "income"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}