import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";

// GET /api/groups
export async function GET(req: NextRequest) {
  try {
    const firebaseUser =
      await getAuthenticatedUser(req);

    const user = await prisma.user.findUnique({
      where: {
        firebaseId: firebaseUser.uid,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },

      include: {
        members: {
          include: {
            user: true,
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
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(groups);
  } catch (error: any) {
    console.error("GET GROUPS ERROR:", error);

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
        message: "Failed to fetch groups",
      },
      {
        status: 500,
      }
    );
  }
}

// POST /api/groups
export async function POST(req: NextRequest) {
  try {
    const firebaseUser = await getAuthenticatedUser(req);

    const body = await req.json();

    const {
      name,
      description,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          message: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    const creator = await prisma.user.findUnique({
      where: {
        firebaseId: firebaseUser.uid,
      },
    });

    if (!creator) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        description: description?.trim() || "",
        createdById: creator.id,
      },
      include: {
        createdBy: true,
      },
    });

    await prisma.member.create({
      data: {
        groupId: group.id,
        userId: creator.id,
        name: creator.name,
        email: creator.email,
      },
    });

    return NextResponse.json(group, {
      status: 201,
    });
  } catch (error: any) {
    console.error(
      "CREATE GROUP ERROR:",
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
        message: "Failed to create group",
      },
      {
        status: 500,
      }
    );
  }
}