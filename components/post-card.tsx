"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/markdown-renderer";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string | Date;
  tags: string[];
  author: {
    name: string | null;
    image: string | null;
  };
  _count?: {
    comments: number;
    likes: number;
  };
  image?: string;
}

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
  isAdmin?: boolean;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, showFullContent = false, isAdmin = false, onDelete }: PostCardProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
  const [likeLoading, setLikeLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const safeTags = post.tags || [];
  

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!session?.user?.id) {
        setLikeLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/${post.id}/like-status`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      } finally {
        setLikeLoading(false);
      }
    };

    fetchLikeStatus();
  }, [post.id, session?.user?.id]);

  const handleLike = async () => {
    if (!session) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });
      const data = await response.json();

      setLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const content = showFullContent
    ? post.content
    : post.content.slice(0, 100) + (post.content.length > 100? "..." : "");

  return (
    <Card className=" post-card overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition duration-300 bg-[#fefefe] dark:bg-[#1f1f1f] flex flex-col justify-between w-[500px] max-h-[400px]">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-0 w-25 h-25">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.image || ""} />
            <AvatarFallback>
              {post.author.name?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-green-800 dark:text-green-400 mt-4 hover:underline transition-all">
          {showFullContent ? (
            post.title
          ) : (
            <Link
              href={`/posts/${post.id}`}
              className="hover:underline"
              prefetch={false}
            >
              {post.title}
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <div className="scale-90 origin-top w-25 h-25">
        <CardContent className="space-y-2 px-4 py-2 text-gray-700 dark:text-gray-300 flex-1">
          <MarkdownRenderer content={content} />
          
          {post.image && !imageError && (
            <div className="relative w-full h-[180px] rounded-t-2xl overflow-hidden">
              <img
                src={post.image}
                alt={`Image for "${post.title}"`}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {imageError && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Image failed to load
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {safeTags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </div>

      {isAdmin && (
        <div className="px-6 pb-1 flex gap-1 space-x-2">
          <Link href={`/admin/posts/edit/${post.id}`}>
            <Button variant="outline" className="text-sm bg-gray-50 hover:bg-green-100 text-green-700 border-green-200 px-1">
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 px-1"
            onClick={() => onDelete && onDelete(post.id)}
          >
            Delete
          </Button>
        </div>
      )}
<CardFooter className="flex items-center justify-between px-0 pb-20 pt-0 mt-1">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
          onClick={handleLike}
          disabled={!session || likeLoading}
        >
          <Heart
            className={`h-4 w-4 ${
              likeLoading
                ? "animate-pulse"
                : liked
                ? "fill-red-500 text-red-500"
                : ""
            }`}
          />
          <span>{likeCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-1"
          asChild
        >
          <Link href={`/posts/${post.id}#comments`}>
            <MessageCircle className="h-4 w-4" />
            <span>{post._count?.comments || 0}</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}