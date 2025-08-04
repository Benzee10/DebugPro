import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { galleryData } from "@/lib/gallery-data";
import type { GalleryPost } from "@shared/schema";

export default function Home() {
  const [filteredPosts, setFilteredPosts] = useState<GalleryPost[]>(galleryData.posts);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar
          posts={galleryData.posts}
          onFiltersChange={setFilteredPosts}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          <GalleryGrid posts={filteredPosts} />
        </main>
      </div>
    </div>
  );
}
