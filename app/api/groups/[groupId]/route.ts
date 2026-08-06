import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{
  groupId: string;
}>;

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  const { groupId } = await params;

  console.log("========== DEBUG ==========");
  console.log("Received groupId:", JSON.stringify(groupId));

  const allGroups = await prisma.group.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  console.log("Groups in DB:", allGroups);

  const group = await prisma.group.findUnique({
  where: {
    id: groupId,
  },
  include: {
    createdBy: true,
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
});

  console.log("Prisma result:", group);
  console.log("===========================");

  if (!group) {
    return NextResponse.json(
      { message: "Group not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(group);
}