"use client";

import { useState, useRef, useEffect } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export function TagInput({ tags: propTags, setTags }: TagInputProps) {
  const [input, setInput] = useState("");
  const [localTags, setLocalTags] = useState<string[]>(propTags || []);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronisation optimisée
  useEffect(() => {
    if (JSON.stringify(propTags) !== JSON.stringify(localTags)) {
      setLocalTags(propTags || []);
    }
  }, [propTags]);

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !localTags.includes(trimmed)) {
      const newTags = [...localTags, trimmed];
      updateTags(newTags);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = localTags.filter(t => t !== tag);
    updateTags(newTags);
  };

  const updateTags = (newTags: string[]) => {
    setLocalTags(newTags);
    setTags(newTags);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="border p-2 rounded space-y-2">
      <div className="flex flex-wrap gap-2">
        {localTags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded cursor-pointer flex items-center"
            onClick={() => removeTag(tag)}
          >
            {tag}
            <span className="ml-1 text-blue-600">×</span>
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="Type tag and press Enter"
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}