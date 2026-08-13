import ExpenseCard from "./ExpenseCard";
import type { Expense } from "@/types/expense";

type Props = {
  expenses: Expense[];
  groupId: string;
  onExpenseUpdated: () => void;
  selectedExpenseId: string | null;
};

export default function ExpensesList({
  expenses,
  groupId,
  onExpenseUpdated,
  selectedExpenseId,
}: Props) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">
        Expenses ({expenses.length})
      </h2>

      {expenses.length === 0 ? (
        <p className="text-slate-400">
          No expenses yet.
        </p>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              groupId={groupId}
              onExpenseUpdated={onExpenseUpdated}
              selected={
                expense.id === selectedExpenseId
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}