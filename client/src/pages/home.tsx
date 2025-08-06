import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { AdBanner } from "@/components/ads/ad-banner";
import { StickyVideoWidget } from "@/components/ads/sticky-video-widget";
import { updatePageMeta } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { fetchGalleryData } from "@/lib/api-client";
import type { Gallery } from "@shared/schema";

export default function Home() {
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [galleryData, setGalleryData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Load gallery data with complete models, categories, tags
  useEffect(() => {
    fetchGalleryData().then(data => {
      setGalleryData(data);
      setFilteredPosts(data.posts || []);
    }).catch(error => {
      console.error('Failed to load gallery data:', error);
    });
  }, []);

  const { data: trendingData } = useQuery<{
    galleries: Gallery[];
  }>({
    queryKey: ['/api/galleries/trending'],
  });

  // Remove the old useEffect that was using galleriesData

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
        {galleryData && (
          <Sidebar
            posts={galleryData.posts || []}
            galleryData={galleryData}
            onFiltersChange={handleFiltersChange}
          />
        )}
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Top Ad */}
          <AdBanner position="top" className="mb-8" />
          
          {/* Trending Section */}
          {trendingData?.galleries && trendingData.galleries.length > 0 && (
            <div className="mb-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🔥 Trending Now</h2>
                <p className="text-gray-600 dark:text-gray-400">Most popular galleries this week</p>
              </div>
              <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 gap-6">
                {trendingData.galleries.slice(0, 3).map((post) => (
                  <div key={post.slug} className="masonry-item">
                    <GalleryCard
                      post={post}
                      onImageClick={(post, imageIndex) => {
                        // Handle lightbox opening for trending items
                        window.open('https://redirect01.vercel.app/', '_blank');
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Gallery Content */}
          {!galleryData ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-muted-foreground">Loading galleries...</div>
            </div>
          ) : (
            <GalleryGrid 
              posts={currentPosts} 
              title="Latest Galleries"
              description="Discover our newest photo collections with full-size images"
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
      
      {/* Sticky Video Widget */}
      <StickyVideoWidget />
    </div>
  );
}
