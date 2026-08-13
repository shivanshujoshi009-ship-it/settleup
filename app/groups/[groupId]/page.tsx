"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "next/navigation";

import GroupHeader from "@/components/groups/GroupHeader";
import MembersList from "@/components/groups/MembersList";
import ExpensesList from "@/components/groups/ExpensesList";
import AddMemberDialog from "@/components/groups/AddMemberDialog";
import AddExpenseDialog from "@/components/groups/AddExpenseDialog";
import SettlementSummary from "@/components/groups/SettlementSummary";
import BalanceSummary from "@/components/groups/BalanceSummary";
import SettlementHistory from "@/components/groups/SettlementHistory";
import { getGroupById } from "@/services/group.service";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  calculateBalances,
  applySettlements,
  calculateSettlements,
  type RecordedSettlement,
} from "@/algorithms/settlement";

import {
  getSettlements,
  type Settlement,
} from "@/services/settlement.service";

export default function GroupPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const searchParams = useSearchParams();

const selectedExpenseId =
  searchParams.get("expense");

const selectedSettlementId =
  searchParams.get("settlement");

  const [group, setGroup] = useState<any | null>(null);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadGroup() {
  try {
    const [groupData, settlementData] =
      await Promise.all([
        getGroupById(groupId),
        getSettlements(groupId),
      ]);

    setGroup(groupData);
    setSettlements(settlementData);
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
 const balances = calculateBalances(
  group.expenses ?? []
);

const recordedSettlements: RecordedSettlement[] =
  settlements.map((settlement) => ({
    payerId: settlement.payer.id,
    receiverId: settlement.receiver.id,
    amount: settlement.amount,
  }));

const adjustedBalances = applySettlements(
  balances,
  recordedSettlements
);

const settlementSuggestions =
  calculateSettlements(adjustedBalances);
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
  expenses={(group.expenses ?? []) as any}
  groupId={group.id}
  onExpenseUpdated={loadGroup}
  selectedExpenseId={selectedExpenseId}
/>

</div>

    {/* Balances & Settlements */}
    <div className="mt-8 grid gap-8 lg:grid-cols-2">

      <BalanceSummary
        balances={balances}
      />

<SettlementSummary
  settlements={settlementSuggestions}
  groupId={group.id}
  onSettlementCreated={loadGroup}
/>

    </div>

{/* Settlement History */}
<div className="mt-8">
  <SettlementHistory
  settlements={settlements}
  selectedSettlementId={selectedSettlementId}
/>
</div>

  </main>
);
}