"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">

      {/* Main Background */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Left Glow */}
      <motion.div
        animate={{
          x: [-40, 30, -40],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[150px]"
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          x: [40, -20, 40],
          y: [20, -20, 20],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[170px]"
      />

      {/* Bottom Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[130px]"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}