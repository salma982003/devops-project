"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";
import { ImageUpload } from "@/components/ui/image-upload";
import Link from "next/link";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: false,
    tags: [] as string[],
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (!res.ok) throw new Error("Post not found");
        
        const post = await res.json();
        setFormData({
          title: post.title,
          content: post.content,
          published: post.published,
          tags: post.tags || [],
          imageUrl: post.image || ""
        });
      } catch (error) {
        setNotFound(true);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update post");
      }

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("Update error:", error);
      alert(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (notFound) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    );
  }

return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-50">
            ← Back to Home
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg shadow-md p-8 border border-green-100">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Edit Post</h1>

        {/* Title Input */}
<div className="space-y-2">
  <Label htmlFor="title" className="text-green-700 font-medium">Title</Label>
  <div className="border border-green-200 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
    <input
      id="title"
      type="text"
      value={formData.title}
      onChange={(e) => handleChange("title", e.target.value)}
      className="w-full p-3 focus:outline-none bg-transparent"
      required
      disabled={loading}
    />
  </div>
</div>

        {/* Content Input */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-green-700 font-medium">Content</Label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            className=" focus:outline-none  w-full p-3 border border-green-200 rounded-lg min-h-[200px] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            required
            disabled={loading}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-green-700 font-medium">Image</Label>
          <div className="border border-green-200 rounded-lg hover:border-green-300 p-4">
            <ImageUpload 
              value={formData.imageUrl} 
              onChange={(url) => handleChange("imageUrl", url)}
            />
           
          </div>
        </div>

      {/* Tags Input */}
<div className="space-y-2">
  <Label className="text-green-700 font-medium">Tags</Label>
  
  <div className="border border-green-200 rounded-lg p-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:outline-none">
    <TagInput
      tags={formData.tags}
      setTags={(tags) => handleChange("tags", tags)}
    />
  </div>

  {/* Suppression de la bordure noire pour l'input interne */}
  <style jsx global>{`
    /* Cible tous les inputs à l'intérieur du composant TagInput */
    .border input {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    .border input:focus {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }
  `}</style>
</div>


        {/* Publish Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => handleChange("published", e.target.checked)}
            disabled={loading}
            className="w-5 h-5 text-green-600 border-green-300 rounded focus:ring-green-500"
          />
          <Label htmlFor="published" className="text-green-700 font-medium">Published</Label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-green-100">
          <Button 
            type="button" 
            variant="outline" 
            disabled={loading} 
            onClick={() => router.push("/")}
            className="text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )};