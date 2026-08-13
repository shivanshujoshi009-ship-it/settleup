"use client";

import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

type Activity = {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  createdAt: string;
  type: "expense" | "settlement";
  subtitle: string;
};

type Props = {
  activities: Activity[];
};

export default function RecentActivity({
  activities,
}: Props) {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Recent Activity
      </h2>

      {activities.length === 0 ? (
        <p className="text-slate-400">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const isSettlement =
              activity.type === "settlement";

            return (
              <button
                key={`${activity.type}-${activity.id}`}
                type="button"
                onClick={() => {
  const query =
    activity.type === "expense"
      ? `?expense=${activity.id}`
      : `?settlement=${activity.id}`;

  router.push(
    `/groups/${activity.groupId}${query}`
  );
}}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-800/50 p-4 text-left transition hover:bg-slate-800"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-xl p-3 ${
                      isSettlement
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isSettlement ? (
                      <ArrowDownLeft size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-white">
                      {activity.title}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {activity.subtitle}
                    </p>

                    <p className="text-xs text-slate-500">
                      {new Date(
                        activity.createdAt
                      ).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <span
                  className={`font-semibold ${
                    isSettlement
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {isSettlement ? "+" : "-"}₹
                  {activity.amount.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}