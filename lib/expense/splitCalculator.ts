type SplitType =
  | "EQUAL"
  | "EXACT"
  | "PERCENTAGE"
  | "SHARES";

type Member = {
  id: string;
};

type Params = {
  amount: number;

  splitType: SplitType;

  members: Member[];

  exactAmounts?: Record<string, number>;

  percentageAmounts?: Record<string, number>;

  shareAmounts?: Record<string, number>;
};

export function calculateSplits({
  amount,
  splitType,
  members,
  exactAmounts = {},
  percentageAmounts = {},
  shareAmounts = {},
}: Params) {

  let splitAmounts: {
    memberId: string;
    amount: number;
  }[] = [];

  switch (splitType) {

    case "EQUAL": {

      const share =
        amount / members.length;

      splitAmounts =
        members.map((member) => ({
          memberId: member.id,
          amount: Number(
            share.toFixed(2)
          ),
        }));

      break;
    }

    case "EXACT": {

      let total = 0;

      splitAmounts =
        members.map((member) => {

          const value =
            Number(
              exactAmounts[member.id] ?? 0
            );

          total += value;

          return {
            memberId: member.id,
            amount: value,
          };

        });

      if (
        Math.abs(total - amount) >
        0.01
      ) {
        throw new Error(
          "Exact amounts must equal total expense."
        );
      }

      break;
    }

    case "PERCENTAGE": {

      let total = 0;

      splitAmounts =
        members.map((member) => {

          const percent =
            Number(
              percentageAmounts[
                member.id
              ] ?? 0
            );

          total += percent;

          return {
            memberId: member.id,
            amount: Number(
              (
                (amount * percent) /
                100
              ).toFixed(2)
            ),
          };

        });

      if (
        Math.abs(total - 100) >
        0.01
      ) {
        throw new Error(
          "Percentages must total 100."
        );
      }

      break;
    }

    case "SHARES": {

      let totalShares = 0;

      members.forEach((member) => {

        totalShares += Number(
          shareAmounts[
            member.id
          ] ?? 0
        );

      });

      if (totalShares <= 0) {
        throw new Error(
          "Total shares must be greater than zero."
        );
      }

      splitAmounts =
        members.map((member) => {

          const shares =
            Number(
              shareAmounts[
                member.id
              ] ?? 0
            );

          return {
            memberId: member.id,
            amount: Number(
              (
                (amount * shares) /
                totalShares
              ).toFixed(2)
            ),
          };

        });

      break;
    }

    default:
      throw new Error(
        "Unsupported split type."
      );
  }

  return splitAmounts;
}
