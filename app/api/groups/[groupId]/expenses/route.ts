import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { calculateSplits } from "@/lib/expense/splitCalculator";
import { getAuthenticatedUser } from "@/lib/api-auth";

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

    const membership =
      await prisma.member.findFirst({
        where: {
          groupId,
          userId: dbUser.id,
        },
      });

    if (!membership) {
      return NextResponse.json(
        { message: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const expenses =
      await prisma.expense.findMany({
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
  } catch (error: any) {
    console.error(
      "GET EXPENSES ERROR:",
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
        message: "Failed to fetch expenses",
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/groups/:groupId/expenses
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { groupId } = await params;

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

    // Verify that the authenticated user belongs to the group.
    const currentMember =
      await prisma.member.findFirst({
        where: {
          groupId,
          userId: dbUser.id,
        },
      });

    if (!currentMember) {
      return NextResponse.json(
        { message: "You are not a member of this group" },
        { status: 403 }
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
      !paidById ||
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
        // Verify payer belongs to this group.
        const payer =
          await tx.member.findFirst({
            where: {
              id: paidById,
              groupId,
            },
          });

        if (!payer) {
          throw new Error(
            "Invalid payer for this group."
          );
        }

        // Verify every selected member belongs
        // to this group.
        const selectedMembers =
          await tx.member.findMany({
            where: {
              id: {
                in: members,
              },
              groupId,
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
          await tx.expense.create({
            data: {
              title: title.trim(),
              amount: numericAmount,
              category:
                category?.trim() || "General",
              notes: notes?.trim() || "",
              splitType: splitType || "EQUAL",
              groupId,
              paidById: payer.userId
                ? payer.userId
                : dbUser.id,
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
  } catch (error: any) {
    console.error(
      "CREATE EXPENSE ERROR:",
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