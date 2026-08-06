"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  CreditCard,
  Bell,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      {/* Glow */}
      <div className="absolute -inset-6 rounded-[40px] bg-cyan-500/10 blur-3xl"></div>

      {/* Dashboard */}
      <div className="relative rounded-[34px] border border-white/10 bg-slate-900/80 p-8 backdrop-blur-2xl shadow-[0_0_60px_rgba(6,182,212,0.15)]">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400">Total Balance</p>

            <h1 className="mt-2 text-5xl font-bold text-white">
              ₹14,520
            </h1>
          </div>

          <div className="rounded-2xl bg-cyan-500/15 p-4">
            <Wallet className="text-cyan-400" size={34} />
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-2 gap-5">

          <div className="rounded-3xl bg-white/5 p-5 border border-white/5">
            <ArrowDownLeft className="text-red-400" />

            <p className="mt-5 text-slate-400">
              You Owe
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              ₹2,450
            </h2>
          </div>

          <div className="rounded-3xl bg-white/5 p-5 border border-white/5">
            <ArrowUpRight className="text-green-400" />

            <p className="mt-5 text-slate-400">
              You Are Owed
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              ₹5,980
            </h2>
          </div>

        </div>

        {/* Activity */}
        <div className="mt-8">

          <h3 className="mb-5 text-xl font-semibold">
            Recent Activity
          </h3>

          {[
            {
              icon: <Users size={20} />,
              title: "Goa Trip",
              amount: "+₹1850",
              color: "text-green-400",
            },
            {
              icon: <CreditCard size={20} />,
              title: "Dinner Split",
              amount: "-₹650",
              color: "text-red-400",
            },
            {
              icon: <Bell size={20} />,
              title: "Electricity Bill",
              amount: "+₹1200",
              color: "text-green-400",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="mt-4 flex items-center justify-between rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                  {item.icon}
                </div>

                <div>
                  <h4>{item.title}</h4>
                  <p className="text-sm text-slate-500">
                    Today
                  </p>
                </div>
              </div>

              <span className={`${item.color} font-semibold`}>
                {item.amount}
              </span>
            </div>
          ))}

        </div>

      </div>
    </motion.div>
  );
}