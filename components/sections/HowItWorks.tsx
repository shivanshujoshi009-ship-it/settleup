"use client";

import {
  Users,
  ReceiptIndianRupee,
  BrainCircuit,
  CreditCard,
} from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Create a Group",
    description:
      "Start a group for your trip, roommates, office team or event.",
  },
  {
    icon: ReceiptIndianRupee,
    title: "Add Expenses",
    description:
      "Record who paid and choose how the expense should be split.",
  },
  {
    icon: BrainCircuit,
    title: "Smart Settlement",
    description:
      "Our algorithm calculates the minimum number of payments required.",
  },
  {
    icon: CreditCard,
    title: "Pay & Finish",
    description:
      "Settle the balance quickly and keep everyone's expenses clear.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">

      <div className="text-center">

        <p className="text-indigo-400 font-semibold">
          HOW IT WORKS
        </p>

        <h2 className="mt-4 text-5xl font-bold text-white">
          Four Simple Steps
        </h2>

      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="relative rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:border-indigo-500"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
                <Icon className="text-indigo-400" />
              </div>

              <span className="text-sm text-slate-500">
                Step {index + 1}
              </span>

              <h3 className="mt-3 text-2xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
}