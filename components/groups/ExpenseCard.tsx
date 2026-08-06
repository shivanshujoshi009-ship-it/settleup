type Split = {
  id: string;
  amount: number;

  member: {
  id: string;
  name?: string;

  user: {
    id: string;
    name: string;
  } | null;
};
};

type Props = {
  title: string;
  amount: number;
  paidBy: string;
  splits: Split[];
};

export default function ExpenseCard({
  title,
  amount,
  paidBy,
  splits,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        <span className="text-xl font-bold text-cyan-400">
          ₹{amount}
        </span>
      </div>

      <p className="mt-2 text-slate-400">
        Paid by <span className="font-medium text-white">{paidBy}</span>
      </p>

      <div className="mt-5 border-t border-slate-700 pt-4">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Split Details
        </h4>

        {splits.length === 0 ? (
          <p className="text-sm text-slate-500">
            No split records found.
          </p>
        ) : (
          <div className="space-y-2">
            {splits.map((split) => (
              <div
                key={split.id}
                className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2"
              >
               <span className="text-white">
  {split.member.user?.name ?? split.member.name ?? "Guest"}
</span>

                <span className="font-semibold text-cyan-400">
                  ₹{split.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}