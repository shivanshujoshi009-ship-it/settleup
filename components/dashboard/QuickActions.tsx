"use client";

import {
  PlusCircle,
  Users,
  Wallet,
} from "lucide-react";

import { useRouter } from "next/navigation";

import CreateGroupDialog from "@/components/groups/CreateGroupDialog";

type Props = {
  onGroupCreated?: () => void;
};

export default function QuickActions({
  onGroupCreated,
}: Props) {
  const router = useRouter();

  function handleAddExpense() {
    router.push("/groups");
  }

  function handleSettleUp() {
    router.push("/groups");
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="mb-6 text-2xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="space-y-4">

        {/* Add Expense */}
        <button
          type="button"
          onClick={handleAddExpense}
          className="flex w-full items-center gap-3 rounded-2xl bg-slate-800 px-4 py-4 text-white transition hover:bg-cyan-500"
        >
          <PlusCircle size={20} />
          Add Expense
        </button>

        {/* Create Group */}
        <div>
          <CreateGroupDialog
  onGroupCreated={onGroupCreated}
  trigger={
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-2xl bg-slate-800 px-4 py-4 text-white transition hover:bg-cyan-500"
    >
      <Users size={20} />
      Create Group
    </button>
  }
/>
        </div>

        {/* Settle Up */}
        <button
          type="button"
          onClick={handleSettleUp}
          className="flex w-full items-center gap-3 rounded-2xl bg-slate-800 px-4 py-4 text-white transition hover:bg-cyan-500"
        >
          <Wallet size={20} />
          Settle Up
        </button>

      </div>
    </div>
  );
}