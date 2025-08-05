import { useState } from "react";
import { Link } from "wouter";
import { Lightbox } from "./lightbox";
import type { GalleryPost } from "@shared/schema";

interface GalleryGridProps {
  posts: GalleryPost[];
  title?: string;
  description?: string;
}

export function GalleryGrid({ posts, title = "Featured Galleries", description = "Curated collections from our talented models" }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (post: GalleryPost, imageIndex: number = 0) => {
    setSelectedPost(post);
    setSelectedImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedPost(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedPost && selectedImageIndex < selectedPost.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No galleries found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>

      {/* Full-width vertical gallery layout */}
      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.slug} className="w-full">
            {/* Post Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg leading-relaxed">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">{post.model === "mila-azul" ? "Mila Azul" : post.model}</span>
                <span>•</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                  {post.category}
                </span>
                <span>•</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.images.length} photos</span>
              </div>
            </div>
            
            {/* Full Image Display */}
            <div className="w-full mb-6">
              <Link href={`/gallery/${post.slug}`}>
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-auto object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity shadow-lg"
                />
              </Link>
            </div>
            
            {/* Post Footer */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <Link href={`/gallery/${post.slug}`}>
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  View Full Gallery →
                </button>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && selectedPost && (
        <Lightbox
          isOpen={lightboxOpen}
          images={selectedPost.images}
          currentIndex={selectedImageIndex}
          title={selectedPost.title}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      )}
    </>
  );
}
