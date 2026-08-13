export interface Balance {
  memberId: string;
  userId?: string;
  name: string;
  balance: number;
}

export interface Split {
  amount: number;

  member: {
    id: string;
    name?: string;

    user: {
      id: string;
      name: string;
    } | null;
  };
}

export interface Expense {
  id: string;
  amount: number;
  createdAt: string;

  paidBy: {
    id: string;
    name: string;
  };

  splits: Split[];
}

/**
 * Calculates the net balance of every group member.
 *
 * Positive balance -> member should receive money
 * Negative balance -> member owes money
 */
export function calculateBalances(
  expenses: Expense[]
): Balance[] {
  const balances = new Map<string, Balance>();

  for (const expense of expenses) {
    /*
     * The payer is stored as User.id in Expense.
     *
     * Find that user's Member.id from the expense splits.
     * This keeps the settlement system consistently member-based.
     */
    const payerSplit = expense.splits.find(
      (split) =>
        split.member.user?.id === expense.paidBy.id
    );

    if (payerSplit) {
      const payerMember = payerSplit.member;

      if (!balances.has(payerMember.id)) {
        balances.set(payerMember.id, {
          memberId: payerMember.id,
          userId: payerMember.user?.id,
          name:
            payerMember.user?.name ??
            payerMember.name ??
            "Guest",
          balance: 0,
        });
      }

      balances.get(payerMember.id)!.balance +=
        expense.amount;
    }

    /*
     * Subtract every member's share.
     */
    for (const split of expense.splits) {
      const member = split.member;

      if (!balances.has(member.id)) {
        balances.set(member.id, {
          memberId: member.id,
          userId: member.user?.id,
          name:
            member.user?.name ??
            member.name ??
            "Guest",
          balance: 0,
        });
      }

      balances.get(member.id)!.balance -=
        split.amount;
    }
  }

  return Array.from(balances.values());
}

export interface RecordedSettlement {
  payerId: string;
  receiverId: string;
  amount: number;
}

/**
 * Applies already-recorded settlements to balances.
 *
 * Payer paid money they owed:
 * negative balance moves toward zero.
 *
 * Receiver received money:
 * positive balance moves toward zero.
 */
export function applySettlements(
  balances: Balance[],
  settlements: RecordedSettlement[]
): Balance[] {
  const updated = balances.map((balance) => ({
    ...balance,
  }));

  for (const settlement of settlements) {
    const payer = updated.find(
      (balance) =>
        balance.memberId === settlement.payerId
    );

    const receiver = updated.find(
      (balance) =>
        balance.memberId === settlement.receiverId
    );

    if (payer) {
      payer.balance += settlement.amount;
    }

    if (receiver) {
      receiver.balance -= settlement.amount;
    }
  }

  return updated;
}

export interface SettlementSuggestion {
  fromMemberId: string;
  from: string;

  toMemberId: string;
  to: string;

  amount: number;
}

/**
 * Converts balances into the minimum practical
 * set of payments needed to settle the group.
 */
export function calculateSettlements(
  balances: Balance[]
): SettlementSuggestion[] {
  const debtors = balances
    .filter((balance) => balance.balance < -0.01)
    .map((balance) => ({
      ...balance,
      balance: Math.abs(balance.balance),
    }));

  const creditors = balances
    .filter((balance) => balance.balance > 0.01)
    .map((balance) => ({
      ...balance,
      balance: balance.balance,
    }));

  const settlements: SettlementSuggestion[] = [];

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (
    debtorIndex < debtors.length &&
    creditorIndex < creditors.length
  ) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amount = Math.min(
      debtor.balance,
      creditor.balance
    );

    settlements.push({
      fromMemberId: debtor.memberId,
      from: debtor.name,

      toMemberId: creditor.memberId,
      to: creditor.name,

      amount: Number(amount.toFixed(2)),
    });

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance <= 0.01) {
      debtorIndex++;
    }

    if (creditor.balance <= 0.01) {
      creditorIndex++;
    }
  }

  return settlements;
}