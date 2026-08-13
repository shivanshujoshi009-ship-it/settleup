"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "@/context/AuthProvider";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Groups",
    icon: Users,
    href: "/groups",
  },
  {
    name: "Expenses",
    icon: Receipt,
    href: "/expenses",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout.");
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 flex-col justify-between border-r border-slate-800 bg-slate-950 p-6 md:flex">
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

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Mobile Top Bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
        <h1 className="text-2xl font-bold text-cyan-400">
          SettleUp
        </h1>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 h-full w-full bg-black/60"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <aside className="relative flex h-full w-72 flex-col justify-between border-r border-slate-800 bg-slate-950 p-6">
            <div>
              <div className="mb-10 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-cyan-400">
                  SettleUp
                </h1>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-slate-800 p-2 text-white transition hover:bg-slate-700"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="space-y-2">
                {menu.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Icon size={20} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={20} />
              Logout
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
