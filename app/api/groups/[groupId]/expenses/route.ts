import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
  groupId: string;
}>;

// GET /api/groups/:groupId/expenses
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { groupId } = await params;

    const expenses = await prisma.expense.findMany({
      where: {
        groupId,
      },
      include: {
        paidBy: true,
        splits: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST /api/groups/:groupId/expenses
// POST /api/groups/:groupId/expenses
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { groupId } = await params;

    const body = await request.json();
    
console.log("Incoming body:");
console.dir(body, { depth: null });

console.log("===== BODY RECEIVED =====");
console.dir(body, { depth: null });

console.log("shareAmounts:", body.shareAmounts);
const {
  title,
  amount,
  category,
  notes,
  splitType,
  paidById,
  members,
  exactAmounts,
  percentageAmounts,
  shareAmounts,
} = body;

    if (!title || !amount || !paidById || !members) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const result = await prisma.$transaction(async (tx) => {

      // Get all members of this group
     const selectedMembers = await tx.member.findMany({
  where: {
    id: {
      in: members,
    },
  },
}); 

    if (selectedMembers.length === 0) {
        throw new Error("Group has no members.");
      }

      // Create Expense
  let expense;
  try {
  console.log("Creating expense with:");
  console.log({
    title,
    amount,
    category,
    notes,
    splitType,
    groupId,
    paidById,
  });

  expense = await tx.expense.create({
    data: {
      title,
      amount: Number(amount),
      category: category || "General",
      notes: notes || "",
      splitType: splitType || "EQUAL",
      groupId,
      paidById,
    },
  });

  console.log("Expense created:", expense);

} catch (e) {
  console.error("========== EXPENSE CREATE ERROR ==========");
console.dir(e, { depth: null });
console.error("==========================================");
throw e;
}
      // Equal share for every member
   let splitAmounts: {
  memberId: string;
  amount: number;
}[] = [];

switch (splitType) {

  case "EQUAL": {

    const equalShare =
      Number(amount) /
      selectedMembers.length;

    splitAmounts =
      selectedMembers.map((member) => ({
        memberId: member.id,
        amount: Number(equalShare.toFixed(2)),
      }));

    break;
  }

  case "EXACT": {

    let total = 0;

    splitAmounts =
      selectedMembers.map((member) => {

        const value =
          Number(
            exactAmounts?.[member.id] ?? 0
          );

        total += value;

        return {
          memberId: member.id,
          amount: value,
        };

      });

    if (
      Math.abs(
        total - Number(amount)
      ) > 0.01
    ) {
      throw new Error(
        "Exact amounts must equal total expense."
      );
    }

    break;
  } 

case "PERCENTAGE": {

  let total = 0;

  splitAmounts = selectedMembers.map((member) => {

    const percent = Number(
      percentageAmounts?.[member.id] ?? 0
    );

    total += percent;

    return {
      memberId: member.id,
      amount: Number(
        ((Number(amount) * percent) / 100).toFixed(2)
      ),
    };

  });

  if (Math.abs(total - 100) > 0.01) {
    throw new Error(
      "Percentages must total 100."
    );
  }

  break;
}
case "SHARES": {

  let totalShares = 0;

  selectedMembers.forEach((member) => {
    totalShares += Number(
      shareAmounts?.[member.id] ?? 0
    );
  });

  if (totalShares <= 0) {
    throw new Error(
      "Total shares must be greater than zero."
    );
  }

  splitAmounts = selectedMembers.map((member) => {

    const shares = Number(
      shareAmounts?.[member.id] ?? 0
    );

    return {
      memberId: member.id,
      amount: Number(
        (
          (Number(amount) * shares) /
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

      // Create ExpenseSplit records
     await tx.expenseSplit.createMany({
  data: splitAmounts.map((split) => ({
    expenseId: expense.id,
    memberId: split.memberId,
    amount: split.amount,
  })),
});

      return expense;
    });

    return NextResponse.json(result, {
      status: 201,
    });

  } catch (error: any)  {
    console.error("CREATE EXPENSE ERROR:", error);
return NextResponse.json(
  {
    message:
      error.message ||
      "Failed to create expense",
  },
  {
    status: 500,
  }
);
  }
}