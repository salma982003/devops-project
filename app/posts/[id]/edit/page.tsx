import EditPostClient from "@/components/EditPostClient";
import prisma from "@/lib/prisma";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return (
      <div className="text-center mt-10">
        Post not found<br />
        <a href="/" className="text-blue-600 underline">Back to Home</a>
      </div>
    );
  }

  return (
    <div className="p-8">
      <EditPostClient
        post={{
          id: post.id,
          title: post.title,
          content: post.content,
          tags: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags,

          imageUrl: post.image || "",
        }}
      />
    </div>
  );
}
