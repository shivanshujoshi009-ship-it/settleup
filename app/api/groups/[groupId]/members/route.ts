import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
  groupId: string;
}>;

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { groupId } = await params;
    const body = await req.json();

    const { name, email } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Try to find a registered user if email is provided
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
    ...(user && { userId: user.id }),
  },
});

    return NextResponse.json(member);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to add member",
      },
      {
        status: 500,
      }
    );
  }
}