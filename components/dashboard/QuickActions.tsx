"use client";

import { PlusCircle, Users, Wallet } from "lucide-react";

const actions = [
  {
    title: "Add Expense",
    icon: PlusCircle,
  },
  {
    title: "Create Group",
    icon: Users,
  },
  {
    title: "Settle Up",
    icon: Wallet,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="flex w-full items-center gap-3 rounded-2xl bg-slate-800 px-4 py-4 text-white transition hover:bg-cyan-500"
            >
              <Icon size={20} />
              {action.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}