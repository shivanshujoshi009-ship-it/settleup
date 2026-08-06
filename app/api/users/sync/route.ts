import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.firebaseId || !body.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: {
        firebaseId: body.firebaseId,
      },
    });

    // Create user if not found
    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseId: body.firebaseId,
          name: body.name || "",
          email: body.email,
          photoUrl: body.photoUrl || "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("User Sync Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync user",
      },
      {
        status: 500,
      }
    );
  }
}