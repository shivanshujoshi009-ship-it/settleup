import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import BalanceCards from "@/components/dashboard/BalanceCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import GroupsCard from "@/components/dashboard/GroupsCard";
import QuickActions from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen bg-[#030712]">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="space-y-8 p-8">
          <BalanceCards />

          <div className="grid gap-8 xl:grid-cols-2">
            <ExpenseChart />
            <RecentExpenses />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <GroupsCard />
            <QuickActions />
          </div>
        </div>
      </div>
    </main>
  );
}