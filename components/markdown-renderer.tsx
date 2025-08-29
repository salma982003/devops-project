"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CldImage } from 'next-cloudinary';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processImage = (src: string | undefined, alt: string | undefined) => {
    if (!src) {
      return (
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-500">[Image manquante]</p>
        </div>
      );
    }

    try {
      if (src.includes('res.cloudinary.com')) {
        const parts = src.split('/');
        const cloudName = parts[2].split('.')[0];
        const publicId = parts.slice(-2).join('/').split('.')[0];

        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
          console.error("Cloudinary non configuré - utilisez l'URL directe");
          return <img src={src} alt={alt || ''} className="my-4 rounded-lg border" />;
        }

        return (
          <div className="my-4">
            <CldImage
              width={800}
              height={500}
              src={publicId}
              alt={alt || 'Image du blog'}
              className="rounded-lg border w-full h-auto"
              onError={(e) => {
                console.error("Erreur Cloudinary, bascule vers l'image standard");
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = src;
              }}
            />
          </div>
        );
      }

      return (
        <img 
          src={src} 
          alt={alt || ''} 
          className="my-4 rounded-lg border w-full h-auto"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = '/fallback-image.jpg';
          }}
        />
      );
    } catch (error) {
      console.error("Erreur de traitement d'image:", error);
      return <img src={src} alt={alt || ''} className="my-4 rounded-lg border" />;
    }
  };

  return (
    <div className="prose prose-gray max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold mb-2">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => {
            let imageSrc: string | undefined;
            if (typeof src === "string") {
              imageSrc = src;
            } else if (src instanceof Blob) {
              imageSrc = URL.createObjectURL(src);
            } else {
              imageSrc = undefined;
            }
            return processImage(imageSrc, alt);
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}