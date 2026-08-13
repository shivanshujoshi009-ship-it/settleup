import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateSplits } from "@/lib/expense/splitCalculator";
import { getAuthenticatedUser } from "@/lib/api-auth";

type Params = Promise<{
  expenseId: string;
}>;

// GET /api/expenses/:expenseId
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { expenseId } = await params;

    const firebaseUser =
      await getAuthenticatedUser(request);

    const dbUser = await prisma.user.findUnique({
      where: {
        firebaseId: firebaseUser.uid,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
      include: {
        paidBy: true,
        group: {
          select: {
            id: true,
          },
        },
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
    });

    if (!expense) {
      return NextResponse.json(
        {
          message: "Expense not found",
        },
        {
          status: 404,
        }
      );
    }

    const membership =
      await prisma.member.findFirst({
        where: {
          groupId: expense.group.id,
          userId: dbUser.id,
        },
      });

    if (!membership) {
      return NextResponse.json(
        {
          message: "You are not a member of this group",
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(expense);
  } catch (error: any) {
    console.error(
      "GET EXPENSE ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch expense",
      },
      {
        status: 500,
      }
    );
  }
}

// PATCH /api/expenses/:expenseId
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { expenseId } = await params;

    const firebaseUser =
      await getAuthenticatedUser(request);

    const dbUser = await prisma.user.findUnique({
      where: {
        firebaseId: firebaseUser.uid,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

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

    if (
      !title?.trim() ||
      amount === undefined ||
      !Array.isArray(members) ||
      members.length === 0
    ) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          message: "Amount must be greater than zero",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await prisma.$transaction(async (tx) => {
        const existingExpense =
          await tx.expense.findUnique({
            where: {
              id: expenseId,
            },
          });

        if (!existingExpense) {
          throw new Error("Expense not found.");
        }

        // Verify authenticated user belongs to
        // the expense's group.
        const currentMember =
          await tx.member.findFirst({
            where: {
              groupId: existingExpense.groupId,
              userId: dbUser.id,
            },
          });

        if (!currentMember) {
          throw new Error(
            "You are not a member of this group."
          );
        }

        // Verify payer belongs to this group.
        const payer = await tx.member.findFirst({
          where: {
            id: paidById,
            groupId: existingExpense.groupId,
          },
        });

        if (!payer) {
          throw new Error(
            "Invalid payer for this group."
          );
        }

        // Verify all selected members belong
        // to this group.
        const selectedMembers =
          await tx.member.findMany({
            where: {
              id: {
                in: members,
              },
              groupId: existingExpense.groupId,
            },
          });

        if (
          selectedMembers.length !== members.length
        ) {
          throw new Error(
            "One or more selected members do not belong to this group."
          );
        }

        const expense =
          await tx.expense.update({
            where: {
              id: expenseId,
            },
            data: {
              title: title.trim(),
              amount: numericAmount,
              category:
                category?.trim() || "General",
              notes: notes?.trim() || "",
              splitType: splitType || "EQUAL",
              // Expense.paidById points to User.id,
              // not Member.id.
              paidById:
                payer.userId ?? dbUser.id,
            },
          });

        await tx.expenseSplit.deleteMany({
          where: {
            expenseId,
          },
        });

        const splitAmounts = calculateSplits({
          amount: numericAmount,
          splitType,
          members: selectedMembers,
          exactAmounts,
          percentageAmounts,
          shareAmounts,
        });

        await tx.expenseSplit.createMany({
          data: splitAmounts.map((split) => ({
            expenseId,
            memberId: split.memberId,
            amount: split.amount,
          })),
        });

        return expense;
      });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(
      "UPDATE EXPENSE ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      error.message ===
      "You are not a member of this group."
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to update expense",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE /api/expenses/:expenseId
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { expenseId } = await params;

    const firebaseUser =
      await getAuthenticatedUser(request);

    const dbUser = await prisma.user.findUnique({
      where: {
        firebaseId: firebaseUser.uid,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const existingExpense =
        await tx.expense.findUnique({
          where: {
            id: expenseId,
          },
        });

      if (!existingExpense) {
        throw new Error("Expense not found.");
      }

      const membership =
        await tx.member.findFirst({
          where: {
            groupId: existingExpense.groupId,
            userId: dbUser.id,
          },
        });

      if (!membership) {
        throw new Error(
          "You are not a member of this group."
        );
      }

      await tx.expenseSplit.deleteMany({
        where: {
          expenseId,
        },
      });

      await tx.expense.delete({
        where: {
          id: expenseId,
        },
      });
    });

    return NextResponse.json({
      message: "Expense deleted successfully",
    });
  } catch (error: any) {
    console.error(
      "DELETE EXPENSE ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      error.message ===
      "You are not a member of this group."
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to delete expense",
      },
      {
        status: 500,
      }
    );
  }
}