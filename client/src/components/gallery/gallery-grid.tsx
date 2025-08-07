import { useLocation } from "wouter";
import { GalleryCard } from "./gallery-card";
import type { GalleryPost } from "@shared/schema";

interface GalleryGridProps {
  posts: GalleryPost[];
  title?: string;
  description?: string;
}

export function GalleryGrid({ posts, title = "Featured Galleries", description = "Curated collections from our talented models" }: GalleryGridProps) {
  const [, setLocation] = useLocation();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No galleries found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - only show if title is provided */}
      {title && (
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
      )}

      {/* Grid layout for galleries - using full-size images with masonry layout */}
      <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6">
        {posts.map((post) => (
          <div key={post.slug} className="masonry-item">
            <GalleryCard
              post={post}
              onImageClick={(post) => {
                // Navigate to individual gallery post
                setLocation(`/gallery/${post.slug}`);
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
