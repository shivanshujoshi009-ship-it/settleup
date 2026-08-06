"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, CheckCircle2 } from "lucide-react";
import DashboardPreview from "@/components/cards/DashboardPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">

      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">

        <div className="grid items-center gap-20 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .8 }}
          >

            <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">

              🚀 Powered by Smart Settlement Algorithm

            </div>

            <h1 className="mt-8 text-6xl font-black leading-tight text-white lg:text-7xl">

              Split Expenses

              <br />

              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">

                Smarter.

              </span>

              <br />

              Never Awkward.

            </h1>

            <p className="mt-8 max-w-xl text-xl leading-9 text-slate-400">

              The easiest way to manage group expenses, calculate the
              minimum number of transactions, and settle instantly.

            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <button className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-black transition hover:scale-105 hover:bg-cyan-400">

                Get Started

                <ArrowRight size={20} />

              </button>

              <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg text-white backdrop-blur transition hover:border-cyan-400">

                <PlayCircle size={22} />

                Watch Demo

              </button>

            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 text-slate-300 sm:grid-cols-3">

              <div className="flex items-center gap-2">

                <CheckCircle2 className="text-cyan-400" size={18} />

                Google Login

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle2 className="text-cyan-400" size={18} />

                Smart Groups

              </div>

              <div className="flex items-center gap-2">

                <CheckCircle2 className="text-cyan-400" size={18} />

                Minimum Transactions

              </div>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, scale: .9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >

            <DashboardPreview />

          </motion.div>

        </div>

      </div>

    </section>
  );
}