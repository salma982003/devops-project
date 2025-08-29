export async function getPostBySlug(slug: string) {
  const response = await fetch(`/api/posts-by-slug/${slug}`);
  return await response.json();
}