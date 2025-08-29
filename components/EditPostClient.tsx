"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Props {
  post: {
    id: string
    title: string
    content: string
    tags: string
    imageUrl: string
  }
}

export default function EditPostClient({ post }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [tags, setTags] = useState(post.tags)
  const [imageUrl, setImageUrl] = useState(post.imageUrl)
  const [loading, setLoading] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("dzmrypky3", "blog-content") 

    setLoading(true)
    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    setImageUrl(data.secure_url)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tags, imageUrl }),
    })

    if (response.ok) {
      router.push("/")
    } else {
      alert("Erreur lors de la mise à jour de l'article")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block">Titre</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full p-2"
        />
      </div>

      <div>
        <label className="block">Contenu</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border w-full p-2"
        />
      </div>

      <div>
        <label className="block">Tags</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border w-full p-2"
        />
      </div>

      <div>
        <label className="block">Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {loading && <p>Chargement de l'image...</p>}
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={300}
            height={200}
            className="mt-2 rounded"
          />
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Enregistrer les modifications
      </button>
    </form>
  )
}
