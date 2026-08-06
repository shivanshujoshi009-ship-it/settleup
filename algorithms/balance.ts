export interface PersonBalance {
  name: string;
  balance: number;
}

export function calculateBalances(
  balances: PersonBalance[]
) {
  const creditors = balances.filter(
    (p) => p.balance > 0
  );

  const debtors = balances.filter(
    (p) => p.balance < 0
  );

  return {
    creditors,
    debtors,
  };
}