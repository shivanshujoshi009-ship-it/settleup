export interface Balance {
  userId: string;
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
  amount: number;

  paidBy: {
    id: string;
    name: string;
  };

  splits: Split[];
}

/**
 * Calculates the net balance of every user.
 *
 * Positive balance  -> user should receive money
 * Negative balance  -> user owes money
 */
export function calculateBalances(
  expenses: Expense[]
): Balance[] {

  const balances = new Map<string, Balance>();

  for (const expense of expenses) {

    // Add money to payer
    if (!balances.has(expense.paidBy.id)) {
      balances.set(expense.paidBy.id, {
        userId: expense.paidBy.id,
        name: expense.paidBy.name,
        balance: 0,
      });
    }

    balances.get(expense.paidBy.id)!.balance += expense.amount;

    // Subtract each member's share
    for (const split of expense.splits) {

      const member = split.member;

      // Registered member
      if (member.user) {

        const user = member.user;

        if (!balances.has(user.id)) {
          balances.set(user.id, {
            userId: user.id,
            name: user.name,
            balance: 0,
          });
        }

        balances.get(user.id)!.balance -= split.amount;
      }

      // Guest member
      else {

        const guestId = member.id;

        if (!balances.has(guestId)) {
          balances.set(guestId, {
            userId: guestId,
            name: member.name ?? "Guest",
            balance: 0,
          });
        }

        balances.get(guestId)!.balance -= split.amount;
      }
    }
  }

  return Array.from(balances.values());
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export function calculateSettlements(
  balances: Balance[]
): Settlement[] {

  const debtors = balances
    .filter((b) => b.balance < 0)
    .map((b) => ({
      ...b,
      balance: Math.abs(b.balance),
    }));

  const creditors = balances
    .filter((b) => b.balance > 0)
    .map((b) => ({
      ...b,
      balance: b.balance,
    }));

  const settlements: Settlement[] = [];

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
      from: debtor.name,
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