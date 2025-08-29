"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/utils";
import { TagInput } from "@/components/ui/tag-input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import MarkdownRenderer from "@/components/markdown-renderer";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Titre et contenu sont obligatoires !");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("published", published.toString());
    formData.append("slug", generateSlug(title));
    formData.append("tags", JSON.stringify(tags));
    if (imageUrl) formData.append("image", imageUrl);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur inconnue");
      }

      router.push("/");
    } catch (error: any) {
      console.error("Erreur:", error);
      alert(error.message || "Échec de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-50"
          >
            ← Back to Home
          </Button>
        </Link>
      </div>

      <div className={`space-y-8 bg-white rounded-lg shadow-md p-8 border border-green-100 ${preview ? "lg:grid lg:grid-cols-2 lg:gap-8" : ""}`}>
        <form
          onSubmit={handleSubmit}
          className={`${preview ? "lg:col-span-1" : ""}`}
        >
          <h1 className="text-3xl font-bold text-green-800 mb-6">Create New Post</h1>

          {/* Title Input */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-green-700 font-medium focus:outline-none focus:ring-0 border-none outline-none"
            >
              Title
            </Label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              required
              disabled={loading}
            />
          </div>

          {/* Content Input */}
          <div className="space-y-2 mt-6">
            <Label htmlFor="content" className="text-green-700 font-medium">
              Content
            </Label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-green-200 rounded-lg min-h-[200px] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              required
              disabled={loading}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2 mt-6">
            <Label className="text-green-700 font-medium">Image</Label>
            <div className="border border-green-200 rounded-lg hover:border-green-300 p-4">
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>
          </div>

          {/* Tags Input */}
          <div className="space-y-2 mt-6">
            <Label className="text-green-700 font-medium">Tags</Label>
            <div className="border border-green-200 rounded-lg focus-within:ring-2 focus-within:ring-green-500 p-2">
              <TagInput tags={tags} setTags={setTags} />
            </div>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center space-x-3 mt-6">
            <input
              type="checkbox"
              id="publish"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              disabled={loading}
              className="w-5 h-5 text-green-600 border-green-300 rounded focus:ring-green-500"
            />
            <Label htmlFor="publish" className="text-green-700 font-medium">
              Publish immediately
            </Label>
          </div>

          {/* Form Actions and Preview Toggle */}
          <div className="flex justify-between items-center gap-4 pt-4 border-t border-green-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreview(!preview)}
              className="text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800"
            >
              {preview ? "Edit" : "Preview"}
            </Button>

            <div className="flex gap-4">
              <Link href="/">
                <Button
                  type="button"
                  variant="outline"
                  className="text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </div>
        </form>

        {preview && (
          <div className="bg-white rounded-lg shadow-md p-8 border border-green-100 lg:col-span-1 overflow-auto max-h-[80vh]">
            <h2 className="text-3xl font-bold text-green-800 mb-6">Preview</h2>
            <h3 className="text-2xl font-semibold mb-4">{title || "Post Title"}</h3>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Post image preview"
                className="mb-6 max-w-full rounded"
              />
            )}
            <MarkdownRenderer
              content={content || "Your content will appear here..."}
            />
            {tags.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-green-700 mb-2">Tags:</h4>
                <ul className="flex flex-wrap gap-2">
                  {tags.map((tag, idx) => (
                    <li
                      key={idx}
                      className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

