import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";

type Params = Promise<{
  groupId: string;
}>;

// GET /api/groups/:groupId
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
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            userId: dbUser.id,
          },
        },
      },

      include: {
        createdBy: true,

        members: {
          include: {
            user: true,
          },
          orderBy: {
            joinedAt: "asc",
          },
        },

        expenses: {
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
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        {
          message: "Group not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(group);
  } catch (error: any) {
    console.error(
      "GET GROUP ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch group",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE /api/groups/:groupId
export async function DELETE(
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
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const group = await prisma.group.findFirst({
      where: {
        id: groupId,
        createdById: dbUser.id,
      },
    });

    if (!group) {
      return NextResponse.json(
        {
          message:
            "Only the group creator can delete this group.",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Delete settlements
      await tx.settlement.deleteMany({
        where: {
          groupId,
        },
      });

      // Delete expense splits
      await tx.expenseSplit.deleteMany({
        where: {
          expense: {
            groupId,
          },
        },
      });

      // Delete expenses
      await tx.expense.deleteMany({
        where: {
          groupId,
        },
      });

      // Delete members
      await tx.member.deleteMany({
        where: {
          groupId,
        },
      });

      // Delete group
      await tx.group.delete({
        where: {
          id: groupId,
        },
      });
    });

    return NextResponse.json({
      message: "Group deleted successfully",
    });
  } catch (error: any) {
    console.error(
      "DELETE GROUP ERROR:",
      error
    );

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          error.message ||
          "Failed to delete group",
      },
      {
        status: 500,
      }
    );
  }
}