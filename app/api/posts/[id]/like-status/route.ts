import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
 
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ liked: false });
    }

    const { id } = params;

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ liked: !!existingLike });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch like status" },
      { status: 500 }
    );
  }
}
