import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { AdBanner } from "@/components/ads/ad-banner";
import { StickyVideoWidget } from "@/components/ads/sticky-video-widget";
import { updatePageMeta } from "@/lib/seo";
import { useQuery } from "@tanstack/react-query";
import { fetchGalleryData } from "@/lib/api-client";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import type { Gallery } from "@shared/schema";

export default function Home() {
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [galleryData, setGalleryData] = useState<any>(null);
  const [displayedPosts, setDisplayedPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    setCurrentPage(1);
    // Reset displayed posts to first page
    setDisplayedPosts(posts.slice(0, postsPerPage));
  };

  // Update displayed posts when filteredPosts or currentPage changes
  useEffect(() => {
    if (filteredPosts.length > 0) {
      const endIndex = currentPage * postsPerPage;
      setDisplayedPosts(filteredPosts.slice(0, endIndex));
    }
  }, [filteredPosts, currentPage, postsPerPage]);

  // Infinite scroll logic
  const hasNextPage = useMemo(() => {
    return currentPage * postsPerPage < filteredPosts.length;
  }, [currentPage, postsPerPage, filteredPosts.length]);

  const fetchNextPage = async () => {
    if (isLoadingMore || !hasNextPage) return;
    
    setIsLoadingMore(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setCurrentPage(prev => prev + 1);
    setIsLoadingMore(false);
  };

  const infiniteScrollRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage: isLoadingMore,
    fetchNextPage
  });

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
            <>
              <GalleryGrid 
                posts={displayedPosts} 
                title="Latest Galleries"
                description="Discover our newest photo collections with full-size images"
              />
              
              {/* Mid-scroll Ad after displaying several posts */}
              {displayedPosts.length > 6 && (
                <AdBanner position="middle" className="my-12" />
              )}
              
              {/* Loading indicator */}
              {isLoadingMore && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-lg text-muted-foreground">Loading more galleries...</div>
                </div>
              )}
              
              {/* Infinite scroll trigger */}
              {hasNextPage && (
                <div ref={infiniteScrollRef} className="h-4" />
              )}
              
              {/* End of results message */}
              {!hasNextPage && displayedPosts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    You've reached the end of our gallery collection
                  </p>
                </div>
              )}
            </>
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
