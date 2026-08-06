"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl shadow-2xl">

        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-white">Settle</span>
          <span className="text-cyan-400">Up</span>
        </h1>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#" className="transition hover:text-cyan-400">
            Features
          </a>
          <a href="#" className="transition hover:text-cyan-400">
            How it Works
          </a>
          <a href="#" className="transition hover:text-cyan-400">
            Analytics
          </a>
          <a href="#" className="transition hover:text-cyan-400">
            Contact
          </a>
        </nav>

        {/* Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            className="text-slate-300 hover:text-white"
          >
            Login
          </Button>

          <Button className="rounded-xl bg-cyan-500 px-5 hover:bg-cyan-400 text-black font-semibold">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden text-white">
          <Menu />
        </button>

      </div>
    </motion.header>
  );
}