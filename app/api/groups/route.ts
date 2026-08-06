import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/groups
export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        expenses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("GET GROUPS ERROR:", error);

    return NextResponse.json(
      { message: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// POST /api/groups
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();


    console.log("Incoming body:", body);

    const { name, description, createdById } = body;

    if (!name || !createdById) {
      console.log("Missing fields");

      return NextResponse.json(
        {
          message: "Name and createdById are required",
        },
        { status: 400 }
      );
    }

    const creator = await prisma.user.findUnique({
      where: {
        id: createdById,
      },
    });

    console.log("Creator found:", creator);

    if (!creator) {
      return NextResponse.json(
        {
          message: "Creator not found",
        },
        { status: 404 }
      );
    }

    const group = await prisma.group.create({
      data: {
        name,
        description: description || "",
        createdById,
      },
      include: {
        createdBy: true,
      },
    });

    console.log("Created group:", group);

    await prisma.member.create({
      data: {
        groupId: group.id,
        userId: creator.id,
        name: creator.name,
        email: creator.email,
      },
    });

    console.log("Creator added as member");

    return NextResponse.json(group, {
      status: 201,
    });

  } catch (error) {
    console.error("CREATE GROUP ERROR:", error);

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