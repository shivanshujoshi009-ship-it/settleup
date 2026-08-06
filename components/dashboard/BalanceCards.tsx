"use client";

import { Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Total Balance",
    amount: "₹14,520",
    icon: Wallet,
    color: "text-cyan-400",
  },
  {
    title: "You Owe",
    amount: "₹2,450",
    icon: ArrowUpRight,
    color: "text-red-400",
  },
  {
    title: "You Are Owed",
    amount: "₹5,980",
    icon: ArrowDownLeft,
    color: "text-green-400",
  },
  {
    title: "This Month",
    amount: "₹8,730",
    icon: TrendingUp,
    color: "text-yellow-400",
  },
];

export default function BalanceCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-400">{card.title}</span>

              <div className={`rounded-xl bg-slate-800 p-3 ${card.color}`}>
                <Icon size={22} />
              </div>
            </div>

            <h2 className="mt-6 text-4xl font-bold text-white">
              {card.amount}
            </h2>
          </motion.div>
        );
      })}
    </div>
  );
}