import { PersonBalance } from "./balance";

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export function greedySettlement(
  people: PersonBalance[]
): Settlement[] {

  const debtors = people
    .filter((p) => p.balance < 0)
    .map((p) => ({ ...p }));

  const creditors = people
    .filter((p) => p.balance > 0)
    .map((p) => ({ ...p }));

  const settlements: Settlement[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {

    const amount = Math.min(
      -debtors[i].balance,
      creditors[j].balance
    );

    settlements.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount,
    });

    debtors[i].balance += amount;
    creditors[j].balance -= amount;

    if (Math.abs(debtors[i].balance) < 0.01)
      i++;

    if (Math.abs(creditors[j].balance) < 0.01)
      j++;
  }

  return settlements;
}