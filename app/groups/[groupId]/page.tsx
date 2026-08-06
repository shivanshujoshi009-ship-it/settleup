"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import GroupHeader from "@/components/groups/GroupHeader";
import MembersList from "@/components/groups/MembersList";
import ExpensesList from "@/components/groups/ExpensesList";
import AddMemberDialog from "@/components/groups/AddMemberDialog";
import AddExpenseDialog from "@/components/groups/AddExpenseDialog";
import SettlementSummary from "@/components/groups/SettlementSummary";
import BalanceSummary from "@/components/groups/BalanceSummary";

import {
  Group,
  getGroupById,
} from "@/services/group.service";

import { calculateBalances } from "@/algorithms/settlement";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.groupId as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadGroup() {
    try {
      const data = await getGroupById(groupId);
      setGroup(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (groupId) {
      loadGroup();
    }
  }, [groupId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        Loading...
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#030712] text-red-500">
        Group not found.
      </main>
    );
  }
  const balances = calculateBalances(group.expenses);
  const settlements: any[] = [];
  return (
  <main className="min-h-screen bg-[#030712] p-10">

    <div className="mb-8 flex items-center justify-between">
      <GroupHeader name={group.name} />

      <div className="flex gap-3">
        <AddMemberDialog
          groupId={group.id}
          onMemberAdded={loadGroup}
        />

        <AddExpenseDialog
          groupId={group.id}
          onExpenseAdded={loadGroup}
        />
      </div>
    </div>

    {/* Members & Expenses */}
    <div className="grid gap-8 lg:grid-cols-2">

      <MembersList
  members={
    group.members?.map(
      (member: any) =>
        member.user?.name ?? member.name
    ) ?? []
  }
/>

      <ExpensesList
        expenses={group.expenses ?? []}
      />

    </div>

    {/* Balances & Settlements */}
    <div className="mt-8 grid gap-8 lg:grid-cols-2">

      <BalanceSummary
        balances={balances}
      />

      <SettlementSummary
        settlements={settlements}
      />

    </div>

  </main>
);
}