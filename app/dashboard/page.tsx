"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import BalanceCards from "@/components/dashboard/BalanceCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import GroupsCard from "@/components/dashboard/GroupsCard";
import QuickActions from "@/components/dashboard/QuickActions";

import { useAuth } from "@/context/AuthProvider";
import { getGroups } from "@/services/group.service";
import { getSettlements } from "@/services/settlement.service";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  calculateBalances,
  applySettlements,
  type Expense,
  type RecordedSettlement,
} from "@/algorithms/settlement";

export default function Dashboard() {
  const { dbUser } = useAuth();

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load groups and settlements
  useEffect(() => {
    async function loadDashboard() {
      if (!dbUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const groupData = await getGroups();

        const groupsWithSettlements = await Promise.all(
          groupData.map(async (group: any) => {
            const settlements = await getSettlements(group.id);

            return {
              ...group,
              settlements,
            };
          })
        );

        setGroups(groupsWithSettlements);
      } catch (error) {
        console.error("DASHBOARD LOAD ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [dbUser?.id]);

  // Recent activities
  const recentActivities = useMemo(() => {
    const activities = groups.flatMap((group: any) => {
      const expenseActivities = (group.expenses ?? []).map(
        (expense: any) => ({
          id: expense.id,
          groupId: group.id,
          title: expense.title,
          amount: Number(expense.amount),
          createdAt: expense.createdAt,
          type: "expense" as const,
          subtitle: `Expense • ${group.name}`,
        })
      );

      const settlementActivities = (group.settlements ?? []).map(
        (settlement: any) => {
          const payerName =
            settlement.payer?.user?.name ??
            settlement.payer?.name ??
            "Guest";

          const receiverName =
            settlement.receiver?.user?.name ??
            settlement.receiver?.name ??
            "Guest";

          return {
            id: settlement.id,
            groupId: group.id,
            title: `${payerName} paid ${receiverName}`,
            amount: Number(settlement.amount),
            createdAt: settlement.createdAt,
            type: "settlement" as const,
            subtitle: `Settlement • ${group.name}`,
          };
        }
      );

      return [
        ...expenseActivities,
        ...settlementActivities,
      ];
    });

    return activities
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 8);
  }, [groups]);

  // Overall dashboard balances
  const dashboardData = useMemo(() => {
    if (!dbUser?.id) {
      return {
        totalBalance: 0,
        youOwe: 0,
        youAreOwed: 0,
        thisMonth: 0,
      };
    }

    let totalBalance = 0;
    let youOwe = 0;
    let youAreOwed = 0;
    let thisMonth = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    for (const group of groups) {
    const expenses: Expense[] = (group.expenses ?? []).map(
  (expense: any) => ({
    ...expense,
    splits: expense.splits ?? [],
  })
);
      const balances = calculateBalances(expenses);

      const recordedSettlements: RecordedSettlement[] =
        (group.settlements ?? []).map((settlement: any) => ({
          payerId: settlement.payer.id,
          receiverId: settlement.receiver.id,
          amount: Number(settlement.amount),
        }));

      const adjustedBalances = applySettlements(
        balances,
        recordedSettlements
      );

      const myMember = group.members?.find(
        (member: any) => member.userId === dbUser.id
      );

      const myBalance = adjustedBalances.find(
        (balance) => balance.memberId === myMember?.id
      );

      if (myBalance) {
        totalBalance += myBalance.balance;

        if (myBalance.balance < 0) {
          youOwe += Math.abs(myBalance.balance);
        } else {
          youAreOwed += myBalance.balance;
        }
      }

      for (const expense of expenses) {
        const expenseDate = new Date(expense.createdAt);

        if (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        ) {
          thisMonth += Number(expense.amount);
        }
      }
    }

    return {
      totalBalance,
      youOwe,
      youAreOwed,
      thisMonth,
    };
  }, [groups, dbUser?.id]);

  // Per-group balances
  const dashboardGroups = useMemo(() => {
    if (!dbUser?.id) {
      return [];
    }

    return groups.map((group: any) => {
     const expenses: Expense[] = (group.expenses ?? []).map(
  (expense: any) => ({
    ...expense,
    splits: expense.splits ?? [],
  })
);

      const balances = calculateBalances(expenses);

      const recordedSettlements: RecordedSettlement[] =
        (group.settlements ?? []).map((settlement: any) => ({
          payerId: settlement.payer.id,
          receiverId: settlement.receiver.id,
          amount: Number(settlement.amount),
        }));

      const adjustedBalances = applySettlements(
        balances,
        recordedSettlements
      );

      const myMember = group.members?.find(
        (member: any) => member.userId === dbUser.id
      );

      const myBalance = adjustedBalances.find(
        (balance) => balance.memberId === myMember?.id
      );

      return {
        id: group.id,
        name: group.name,
        members: group.members ?? [],
        balance: myBalance?.balance ?? 0,
      };
    });
  }, [groups, dbUser?.id]);

  return (
  <ProtectedRoute>
    <main className="flex min-h-screen bg-[#030712]">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="space-y-8 p-4 pt-20 sm:p-6 sm:pt-20 md:p-8 md:pt-8">
          {loading ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 text-slate-400">
              Loading dashboard...
            </div>
          ) : (
            <>
              <BalanceCards
                totalBalance={dashboardData.totalBalance}
                youOwe={dashboardData.youOwe}
                youAreOwed={dashboardData.youAreOwed}
                thisMonth={dashboardData.thisMonth}
              />

              <div className="grid gap-8 xl:grid-cols-2">
                <ExpenseChart
  expenses={groups.flatMap((group) =>
    group.expenses ?? []
  )}
/>

                <RecentActivity
    activities={recentActivities}
  />
</div>

              <div className="grid gap-8 md:grid-cols-2">
                <GroupsCard
                  groups={dashboardGroups}
                />

                <QuickActions
  onGroupCreated={() => {
    window.location.reload();
  }}
/>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  </ProtectedRoute>
  );
}