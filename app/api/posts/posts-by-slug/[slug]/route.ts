import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';


export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    console.log("API called with slug:", params.slug);
    
    const post = await prisma.post.findUnique({
      where: { 
        slug: params.slug
      },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true, likes: true } }
      }
    });

    if (!post) {
      console.log("Post not found in DB for slug:", params.slug);
      return NextResponse.json(
        { error: "Post not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Database error" }, 
      { status: 500 }
    );
  }
}



export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const existingPost = await prisma.post.findUnique({
      where: { slug: params.slug }
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: existingPost.id },
      data: {
        title: body.title,
        content: body.content,
        tags: body.tags,
        image: body.image
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}