"use client";

import Link from "next/link";
import type { Group } from "@/types/group";
type Props = {
  groups: Group[];
};

export default function GroupsList({ groups }: Props) {
  if (groups.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
        No groups found.
        <br />
        Create your first group.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <Link
          key={group.id}
          href={`/groups/${group.id}`}
          className="rounded-2xl border border-slate-700 bg-slate-900 p-6 transition hover:border-cyan-500 hover:bg-slate-800"
        >
          <h2 className="text-xl font-semibold text-white">
            {group.name}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {group.id}
          </p>
        </Link>
      ))}
    </div>
  );
}