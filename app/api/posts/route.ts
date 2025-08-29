"use server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.post.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, content, tags } = await request.json();
    
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { 
        title,
        content,
        tags: tags || [],
      },
      include: {
        author: { select: { name: true, image: true } },
        _count: { select: { comments: true, likes: true } }
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    const posts = await prisma.post.findMany({
      where: { 
        published: true,
        ...(filter && {
          OR: [
            { tags: { has: filter } },
            { title: { contains: filter, mode: 'insensitive' } },
            { content: { contains: filter, mode: 'insensitive' } }
          ]
        })
      },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    
    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();
    const published = formData.get("published") === "true";
    const slug = formData.get("slug")?.toString() || generateSlug(title || "");
    const image = formData.get("image") as File | string | null;
    const tagsRaw = formData.get("tags")?.toString() || "[]";
    const tags = JSON.parse(tagsRaw) as string[];

    if (!title || !content) {
      return NextResponse.json(
        { error: "Le titre et le contenu sont obligatoires." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé." }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        slug,
        image: image ? (typeof image === "string" ? image : null) : null,
        tags,
        authorId: user.id,
      },
      include: { author: { select: { name: true, image: true } } },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erreur API POST:", error);
    return NextResponse.json(
      { error: "Échec de la création. Vérifiez les données." },
      { status: 500 }
    );
  }
}