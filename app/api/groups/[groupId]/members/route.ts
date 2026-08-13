import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/api-auth";

type Params = Promise<{
  groupId: string;
}>;

// GET /api/groups/:groupId/members
export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { groupId } = await params;

    const firebaseUser =
      await getAuthenticatedUser(req);

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
        {
          message:
            "You are not a member of this group",
        },
        { status: 403 }
      );
    }

    const members = await prisma.member.findMany({
      where: {
        groupId,
      },
      include: {
        user: true,
      },
      orderBy: {
        joinedAt: "asc",
      },
    });

    return NextResponse.json(members);
  } catch (error: any) {
    console.error(
      "GET MEMBERS ERROR:",
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
        message: "Failed to fetch members",
      },
      { status: 500 }
    );
  }
}

// POST /api/groups/:groupId/members
export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { groupId } = await params;

    const firebaseUser =
      await getAuthenticatedUser(req);

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
        {
          message:
            "You are not a member of this group",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      name,
      email,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        {
          message: "Name is required",
        },
        { status: 400 }
      );
    }

    let user = null;

    if (email?.trim()) {
      user = await prisma.user.findUnique({
        where: {
          email: email.trim(),
        },
      });
    }

    const member = await prisma.member.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        groupId,
        ...(user && {
          userId: user.id,
        }),
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(member, {
      status: 201,
    });
  } catch (error: any) {
    console.error(
      "ADD MEMBER ERROR:",
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
          "Failed to add member",
      },
      { status: 500 }
    );
  }
}