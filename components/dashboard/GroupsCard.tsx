"use client";

const groups = [
  {
    name: "Goa Trip",
    members: 6,
    balance: "₹3,250",
  },
  {
    name: "Flatmates",
    members: 4,
    balance: "₹1,840",
  },
  {
    name: "Office Team",
    members: 8,
    balance: "₹920",
  },
];

export default function GroupsCard() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Your Groups
      </h2>

      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.name}
            className="flex items-center justify-between rounded-xl bg-slate-800/50 p-4"
          >
            <div>
              <h3 className="font-semibold text-white">
                {group.name}
              </h3>

              <p className="text-sm text-slate-400">
                {group.members} Members
              </p>
            </div>

            <span className="font-semibold text-cyan-400">
              {group.balance}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}