import { useState } from "react";
import { Link } from "wouter";
import { Lightbox } from "./lightbox";
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

      {/* Grid layout for galleries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Post Cover Image */}
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={post.cover}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => openLightbox(post, 0)}
                data-testid={`gallery-cover-${post.slug}`}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-colors">
                <div className="absolute bottom-4 left-4 text-white opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">{Array.isArray(post.images) ? post.images.length : 0} photos</span>
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                <Link href={`/gallery/${post.slug}`} className="hover:text-primary transition-colors">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="font-medium">{post.model === "mila-azul" ? "Mila Azul" : post.model}</span>
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* View Gallery Button */}
              <Link href={`/gallery/${post.slug}`}>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
                  View Gallery →
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
