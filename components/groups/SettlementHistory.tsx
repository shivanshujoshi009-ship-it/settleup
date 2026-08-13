"use client";

import type { Settlement } from "@/services/settlement.service";

type Props = {
  settlements: Settlement[];
  selectedSettlementId?: string | null;
};

function getMemberName(member: Settlement["payer"]) {
  return (
    member.user?.name ??
    member.name ??
    "Guest"
  );
}

export default function SettlementHistory({
  settlements,
  selectedSettlementId,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Settlement History
      </h2>

      {settlements.length === 0 ? (
        <p className="text-slate-400">
          No settlements recorded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {settlements.map((settlement) => {
            const payerName = getMemberName(
              settlement.payer
            );

            const receiverName = getMemberName(
              settlement.receiver
            );

            return (
             <div
  key={settlement.id}
  className={`flex items-center justify-between gap-4 rounded-xl p-4 transition ${
    settlement.id === selectedSettlementId
      ? "border border-green-400 bg-green-400/5 shadow-lg shadow-green-500/10"
      : "bg-slate-800"
  }`}
>
                <div>
                  <p className="font-medium text-white">
                    {payerName} paid {receiverName}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {new Date(
                      settlement.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <span className="font-semibold text-green-400">
                  ₹{settlement.amount.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}