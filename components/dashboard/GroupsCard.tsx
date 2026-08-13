"use client";

import { useRouter } from "next/navigation";

type DashboardGroup = {
  id: string;
  name: string;
  members?: unknown[];
  balance: number;
};

type Props = {
  groups: DashboardGroup[];
};

export default function GroupsCard({
  groups,
}: Props) {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Your Groups
      </h2>

      {groups.length === 0 ? (
        <p className="text-slate-400">
          You are not part of any groups yet.
        </p>
      ) : (
        <div className="space-y-4">
          {groups.slice(0, 5).map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() =>
                router.push(`/groups/${group.id}`)
              }
              className="flex w-full items-center justify-between rounded-xl bg-slate-800/50 p-4 text-left transition hover:bg-slate-800"
            >
              <div>
                <h3 className="font-semibold text-white">
                  {group.name}
                </h3>

                <p className="text-sm text-slate-400">
                  {group.members?.length ?? 0} Members
                </p>
              </div>

              <span
                className={`font-semibold ${
                  group.balance < 0
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {group.balance < 0 ? "-" : "+"}₹
                {Math.abs(group.balance).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}