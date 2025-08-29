import prisma from "@/lib/prisma";
import PostCard from "@/components/post-card";
import { SectorFilter } from "@/components/SectorFilter";

interface PostsPageProps {
  searchParams: {
    filter?: string;
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const filter = searchParams?.filter || "";

  const posts = await prisma.post.findMany({
  where: filter 
    ? { 
        tags: { 
          has: filter
        },
        published: true
      } 
    : { published: true },
  include: {
    author: {
      select: { name: true, image: true },
    },
    _count: {
      select: { comments: true, likes: true }
    }
  },
  orderBy: { createdAt: "desc" },
}).then(posts => posts.map(post => ({
  ...post,
  image: post.image || undefined 
})));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <SectorFilter />
        </aside>

        <main className="md:w-3/4">
          {filter && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold">
                Showing posts with tag: <span className="text-blue-600">{filter}</span>
              </h2>
              <a 
                href="/posts"
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Clear filter
              </a>
            </div>
          )}

          {posts.length > 0 ? (
            <div className="grid gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {filter
                  ? `No posts found with tag "${filter}"`
                  : "No posts available"}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}