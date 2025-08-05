import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { AdBanner } from "@/components/ads/ad-banner";
import { updatePageMeta } from "@/lib/seo";
import { fetchGalleryData } from "@/lib/api-client";
import type { GalleryPost, GalleryData } from "@shared/schema";

export default function Home() {
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<GalleryPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Load gallery data from API
  useEffect(() => {
    fetchGalleryData().then(data => {
      setGalleryData(data);
      setFilteredPosts(data.posts);
    });
  }, []);

  // Update SEO for homepage
  useEffect(() => {
    updatePageMeta();
  }, []);

  const handleFiltersChange = (posts: GalleryPost[]) => {
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
        <Sidebar
          posts={galleryData?.posts || []}
          onFiltersChange={handleFiltersChange}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Top Ad */}
          <AdBanner position="top" className="mb-8" />
          
          {/* Gallery Content */}
          <GalleryGrid 
            posts={currentPosts} 
            title="Latest Galleries"
            description="Discover our newest photo collections featuring Mila Azul"
          />
          
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
