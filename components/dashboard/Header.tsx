"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-8 py-6">

      <div>
        <h2 className="text-3xl font-bold text-white">
          Dashboard
        </h2>

        <p className="mt-1 text-slate-400">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center rounded-xl bg-slate-900 px-4 py-3">

          <Search className="mr-2 text-slate-500" size={18} />

          <input
            placeholder="Search..."
            className="bg-transparent text-white outline-none placeholder:text-slate-500"
          />

        </div>

        <button className="rounded-xl bg-slate-900 p-3">
          <Bell className="text-white" size={20} />
        </button>

      </div>

    </header>
  );
}