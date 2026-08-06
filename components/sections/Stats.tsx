"use client";

import CountUp from "react-countup";

export default function Stats() {
  const stats = [
    {
      value: 98,
      suffix: "%",
      label: "Less Transactions",
    },
    {
      value: 24,
      suffix: "/7",
      label: "Availability",
    },
    {
      value: 100,
      suffix: "%",
      label: "Secure",
    },
    {
      value: 1,
      suffix: " Click",
      label: "Settlement",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-8 py-24">

      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">

        {stats.map((item) => (

          <div
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center"
          >

            <h2 className="text-5xl font-bold text-white">

              <CountUp
                end={item.value}
                duration={2}
              />

              {item.suffix}

            </h2>

            <p className="mt-4 text-slate-400">

              {item.label}

            </p>

          </div>

        ))}

      </div>

    </section>
  );
}