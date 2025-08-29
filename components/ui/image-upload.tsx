// components/ui/image-upload.tsx
"use client";

import { CldUploadWidget } from 'next-cloudinary';
import { useEffect, useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-2">
      <CldUploadWidget
        uploadPreset="blog-content" // Votre upload preset Cloudinary
        onSuccess={(result: any) => {
          if (result?.info?.secure_url) {
            onChange(result.info.secure_url);
          }
        }}
        options={{
          sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
          multiple: false,
          maxFiles: 1,
          resourceType: 'image',
          cropping: true,
          croppingAspectRatio: 16/9,
          showPoweredBy: false,
          styles: {
            palette: {
              window: "#FFFFFF",
              sourceBg: "#F4F4F4",
              windowBorder: "#90A0B3",
              tabIcon:"#15803d",
              inactiveTabIcon: "#5E666F",
              menuIcons: "#5E666F",
              link: "#15803d",
              action: "#FF620C",
              inProgress: "#15803d",
              complete: "#20B832",
              error: "#C43737",
              textDark: "#000000",
              textLight: "#FFFFFF"
            }
          }
        }}
      >
        {({ open }) => {
          return (
            <button
              type="button"
              onClick={() => open()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              {value ? "Changer l'image" : "Choisir une image"}
            </button>
          );
        }}
      </CldUploadWidget>
      {value && (
        <div className="mt-2">
          <img 
            src={value} 
            alt="Preview" 
            className="max-w-full h-auto rounded border border-gray-200"
            style={{ maxHeight: '200px' }}
          />
        </div>
      )}
    </div>
  );
}