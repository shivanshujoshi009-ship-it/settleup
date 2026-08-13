"use client";

import { useState } from "react";
import { createSettlement } from "@/services/settlement.service";

type Settlement = {
  fromMemberId: string;
  from: string;

  toMemberId: string;
  to: string;

  amount: number;
};

type Props = {
  settlements: Settlement[];
  groupId: string;
  onSettlementCreated?: () => void;
};

export default function SettlementSummary({
  settlements,
  groupId,
  onSettlementCreated,
}: Props) {
  const [settlingId, setSettlingId] = useState<string | null>(
    null
  );

  async function handleSettle(
    settlement: Settlement
  ) {
    const confirmed = window.confirm(
      `Record ₹${settlement.amount.toFixed(
        2
      )} payment from ${settlement.from} to ${settlement.to}?`
    );

    if (!confirmed) {
      return;
    }

    const settlementId =
      `${settlement.fromMemberId}-${settlement.toMemberId}`;

    try {
      setSettlingId(settlementId);

      await createSettlement(groupId, {
        payerId: settlement.fromMemberId,
        receiverId: settlement.toMemberId,
        amount: settlement.amount,
      });

      onSettlementCreated?.();
    } catch (error: any) {
      alert(
        error.message ||
          "Failed to record settlement."
      );
    } finally {
      setSettlingId(null);
    }
  }

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
          {settlements.map((settlement) => {
            const settlementId =
              `${settlement.fromMemberId}-${settlement.toMemberId}`;

            const isSettling =
              settlingId === settlementId;

            return (
              <div
                key={settlementId}
                className="flex items-center justify-between gap-4 rounded-lg bg-slate-800 p-3"
              >
                <div>
                  <p className="text-white">
                    {settlement.from} →{" "}
                    {settlement.to}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    ₹
                    {settlement.amount.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleSettle(settlement)
                  }
                  disabled={isSettling}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSettling
                    ? "Saving..."
                    : "Settle Up"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}