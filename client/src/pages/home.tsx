import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { AdBanner } from "@/components/ads/ad-banner";
import { updatePageMeta } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import type { Gallery } from "@shared/schema";
import type { GalleryData } from "@/lib/types";

export default function Home() {
  const [filteredPosts, setFilteredPosts] = useState<Gallery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Load gallery data from new database API
  const { data: galleriesData, isLoading } = useQuery({
    queryKey: ['/api/galleries'],
  });

  const { data: trendingData } = useQuery({
    queryKey: ['/api/galleries/trending'],
  });

  // Update filtered posts when data loads
  useEffect(() => {
    if (galleriesData?.galleries) {
      setFilteredPosts(galleriesData.galleries);
    }
  }, [galleriesData]);

  // Update SEO for homepage
  useEffect(() => {
    updatePageMeta();
  }, []);

  const handleFiltersChange = (posts: Gallery[]) => {
    setFilteredPosts(posts);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {galleriesData?.galleries && (
          <Sidebar
            posts={galleriesData.galleries}
            galleryData={{ posts: galleriesData.galleries, models: [], categories: [], tags: [] }}
            onFiltersChange={handleFiltersChange}
          />
        )}
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Top Ad */}
          <AdBanner position="top" className="mb-8" />
          
          {/* Trending Section */}
          {trendingData?.galleries && trendingData.galleries.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">🔥 Trending Now</h2>
              <GalleryGrid 
                posts={trendingData.galleries.slice(0, 3)} 
                title=""
                description=""
              />
            </div>
          )}
          
          {/* Gallery Content */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-muted-foreground">Loading galleries...</div>
            </div>
          ) : (
            <GalleryGrid 
              posts={currentPosts} 
              title="Latest Galleries"
              description="Discover our newest photo collections"
            />
          )}
          
          {/* Mid-scroll Ad after first 3 posts */}
          {currentPosts.length > 3 && (
            <AdBanner position="middle" className="my-12" />
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              
              <span className="text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
          
          {/* Bottom Ad */}
          <AdBanner position="bottom" className="mt-12" />
        </main>
      </div>
    </div>
  );
}
