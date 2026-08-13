import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";

type Params = Promise<{
  groupId: string;
}>;

// GET /api/groups/:groupId/settlements
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

    // Verify that the authenticated user belongs
    // to this group.
    const membership =
      await prisma.member.findFirst({
        where: {
          groupId,
          userId: dbUser.id,
        },
      });

    if (!membership) {
      return NextResponse.json(
        {
          message:
            "You are not a member of this group",
        },
        {
          status: 403,
        }
      );
    }

    const settlements =
      await prisma.settlement.findMany({
        where: {
          groupId,
        },
        include: {
          payer: {
            include: {
              user: true,
            },
          },
          receiver: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(settlements);
  } catch (error: any) {
    console.error(
      "GET SETTLEMENTS ERROR:",
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
        message: "Failed to fetch settlements",
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/groups/:groupId/settlements
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
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Verify that the authenticated user belongs
    // to this group.
    const membership =
      await prisma.member.findFirst({
        where: {
          groupId,
          userId: dbUser.id,
        },
      });

    if (!membership) {
      return NextResponse.json(
        {
          message:
            "You are not a member of this group",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const {
      payerId,
      receiverId,
      amount,
    } = body;

    if (
      !payerId ||
      !receiverId ||
      amount === undefined
    ) {
      return NextResponse.json(
        {
          message:
            "payerId, receiverId and amount are required",
        },
        {
          status: 400,
        }
      );
    }

    if (payerId === receiverId) {
      return NextResponse.json(
        {
          message:
            "Payer and receiver must be different members.",
        },
        {
          status: 400,
        }
      );
    }

    const settlementAmount = Number(amount);

    if (
      !Number.isFinite(settlementAmount) ||
      settlementAmount <= 0
    ) {
      return NextResponse.json(
        {
          message:
            "Settlement amount must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const payer =
          await tx.member.findFirst({
            where: {
              id: payerId,
              groupId,
            },
          });

        const receiver =
          await tx.member.findFirst({
            where: {
              id: receiverId,
              groupId,
            },
          });

        if (!payer || !receiver) {
          throw new Error(
            "Both settlement members must belong to this group."
          );
        }

        const settlement =
          await tx.settlement.create({
            data: {
              groupId,
              payerId,
              receiverId,
              amount: Number(
                settlementAmount.toFixed(2)
              ),
            },

            include: {
              payer: {
                include: {
                  user: true,
                },
              },

              receiver: {
                include: {
                  user: true,
                },
              },
            },
          });

        return settlement;
      }
    );

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error: any) {
    console.error(
      "CREATE SETTLEMENT ERROR:",
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
          "Failed to create settlement",
      },
      {
        status: 500,
      }
    );
  }
}