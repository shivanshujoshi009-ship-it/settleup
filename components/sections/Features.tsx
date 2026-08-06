"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Wallet,
  Users,
  ShieldCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Smart Settlement",
    description:
      "Our algorithm calculates the minimum number of transactions required to settle every expense.",
    icon: Brain,
    size: "col-span-2",
  },
  {
    title: "Group Management",
    description: "Create unlimited groups with friends, family or teams.",
    icon: Users,
    size: "",
  },
  {
    title: "Expense Analytics",
    description: "Visual insights into your spending and payment history.",
    icon: BarChart3,
    size: "",
  },
  {
    title: "Secure Login",
    description: "Google authentication with secure cloud storage.",
    icon: ShieldCheck,
    size: "",
  },
  {
    title: "Future Ready",
    description: "Designed for QR payments, Razorpay and UPI integration.",
    icon: Wallet,
    size: "",
  },
  {
    title: "Beautiful Experience",
    description: "Modern animations and responsive design for every device.",
    icon: Sparkles,
    size: "col-span-2",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32">

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-center text-5xl font-bold text-white">
          Everything You Need
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-slate-400">
          Powerful features designed to simplify group expense management while
          keeping settlements fast, fair, and effortless.
        </p>
      </motion.div>

      <div className="mt-20 grid gap-6 md:grid-cols-3">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-2 hover:border-cyan-500/40 hover:bg-white/10 ${feature.size}`}
            >
              <div className="mb-6 inline-flex rounded-2xl bg-cyan-500/10 p-4 text-cyan-400 transition group-hover:scale-110">
                <Icon size={34} />
              </div>

              <h3 className="text-2xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-400">
                {feature.description}
              </p>
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}