"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Groups", icon: Users, href: "/groups" },
  { name: "Expenses", icon: Receipt, href: "/expenses" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-950 p-6">

      <div>
        <h1 className="mb-10 text-3xl font-bold text-cyan-400">
          SettleUp
        </h1>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10">
        <LogOut size={20} />
        Logout
      </button>

    </aside>
  );
}