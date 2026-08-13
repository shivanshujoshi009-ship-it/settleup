import type { Balance } from "@/algorithms/settlement";

type Props = {
  balances: Balance[];
};

export default function BalanceSummary({
  balances,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Current Balances
      </h2>

      {balances.length === 0 ? (
        <p className="text-slate-400">
          No balances yet.
        </p>
      ) : (
        <div className="space-y-3">
          {balances.map((balance) => (
            <div
              key={balance.memberId}
              className="flex items-center justify-between rounded-lg bg-slate-800 p-3"
            >
              <span className="text-white">
                {balance.name}
              </span>

              <span
                className={`font-bold ${
                  balance.balance >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {balance.balance >= 0 ? "+" : "-"}₹
                {Math.abs(balance.balance).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}