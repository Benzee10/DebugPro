import { useState } from "react";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryCard } from "./gallery-card";
import { Lightbox } from "./lightbox";
import type { GalleryPost } from "@shared/schema";

interface GalleryGridProps {
  posts: GalleryPost[];
  title?: string;
  description?: string;
}

export function GalleryGrid({ posts, title = "Featured Galleries", description = "Curated collections from our talented models" }: GalleryGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="flex items-center gap-2"
            >
              <Grid size={16} />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex items-center gap-2"
            >
              <List size={16} />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {viewMode === "grid" ? (
        <div className="masonry-grid">
          {posts.map((post) => (
            <GalleryCard
              key={post.slug}
              post={post}
              onClick={() => openLightbox(post)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.slug} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <img
                src={post.cover}
                alt={post.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{post.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="capitalize">{post.model}</span>
                  <span>•</span>
                  <span>{post.category}</span>
                  <span>•</span>
                  <span>{post.images.length} photos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      <div className="flex justify-center mt-12">
        <Button className="px-8 py-3" size="lg">
          Load More Galleries
        </Button>
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
