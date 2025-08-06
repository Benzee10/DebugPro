import { useState } from "react";
import { Link } from "wouter";
import { Lightbox } from "./lightbox";
import { GalleryCard } from "./gallery-card";
import type { Gallery } from "@shared/schema";

interface GalleryGridProps {
  posts: Gallery[];
  title?: string;
  description?: string;
}

export function GalleryGrid({ posts, title = "Featured Galleries", description = "Curated collections from our talented models" }: GalleryGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Gallery | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openLightbox = (post: Gallery, imageIndex: number = 0) => {
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

      {/* Grid layout for galleries - using full-size images with masonry layout */}
      <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {posts.map((post) => (
          <GalleryCard
            key={post.slug}
            post={post}
            onImageClick={openLightbox}
          />
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
