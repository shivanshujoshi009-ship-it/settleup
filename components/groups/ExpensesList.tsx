import ExpenseCard from "./ExpenseCard";

type Expense = {
  id: string;
  title: string;
  amount: number;

  paidBy: {
    name: string;
  };

  splits: {
    id: string;
    amount: number;

    member: {
      user: {
        name: string;
      };
    };
  }[];
};

type Props = {
  expenses: Expense[];
};

export default function ExpensesList({
  expenses,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

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
              title={expense.title}
              amount={expense.amount}
              paidBy={expense.paidBy.name}
              splits={expense.splits}
            />
          ))}
        </div>
      )}

    </div>
  );
}