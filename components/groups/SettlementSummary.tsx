type Settlement = {
  from: string;
  to: string;
  amount: number;
};

type Props = {
  settlements: Settlement[];
};

export default function SettlementSummary({
  settlements,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Settlement Summary
      </h2>

      {settlements.length === 0 ? (
        <p className="text-slate-400">
          Everyone is settled up 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-slate-800 p-3"
            >
              <span className="text-white">
                {settlement.from} → {settlement.to}
              </span>

              <span className="font-semibold text-cyan-400">
                ₹{settlement.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}