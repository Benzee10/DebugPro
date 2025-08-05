import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Filter } from "lucide-react";
import { fetchGalleryData } from "@/lib/api-client";
import type { GalleryPost, GalleryData } from "@shared/schema";

export default function ArchivePage() {
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Load gallery data
  useEffect(() => {
    fetchGalleryData().then(data => {
      setGalleryData(data);
    });
  }, []);

  // Group posts by year
  const postsByYear = useMemo(() => {
    if (!galleryData) return {};
    
    const grouped: { [year: string]: GalleryPost[] } = {};
    
    galleryData.posts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });

    // Sort each year's posts by date (newest first)
    Object.keys(grouped).forEach(year => {
      grouped[year].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return grouped;
  }, [galleryData]);

  // Filter posts based on selections
  const filteredPosts = useMemo(() => {
    if (!galleryData) return [];
    
    let posts = galleryData.posts;

    if (selectedYear !== "all") {
      posts = posts.filter(post => 
        new Date(post.date).getFullYear().toString() === selectedYear
      );
    }

    if (selectedCategory !== "all") {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    if (selectedTag !== "all") {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [galleryData, selectedYear, selectedCategory, selectedTag]);

  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));
  const categories = galleryData?.categories || [];
  const tags = galleryData?.tags || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar
          posts={galleryData?.posts || []}
          onFiltersChange={() => {}}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          {/* Archive Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Gallery Archive
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Browse our complete collection organized by year, category, and tags
            </p>
          </div>

          {/* Filter Controls */}
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter Gallery
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Year Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Calendar size={16} />
                  Year
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedYear === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear("all")}
                  >
                    All Years
                  </Button>
                  {years.map(year => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedYear(year)}
                    >
                      {year} ({postsByYear[year].length})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Filter size={16} />
                  Studio
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Studios
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Tag size={16} />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  <Button
                    variant={selectedTag === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag("all")}
                  >
                    All Tags
                  </Button>
                  {tags.slice(0, 10).map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedYear !== "all" || selectedCategory !== "all" || selectedTag !== "all") && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Filters:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedYear !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedYear("all")}>
                      Year: {selectedYear} ✕
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                      Studio: {selectedCategory} ✕
                    </Badge>
                  )}
                  {selectedTag !== "all" && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedTag("all")}>
                      Tag: {selectedTag} ✕
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredPosts.length} of {galleryData?.posts.length || 0} galleries
            </p>
          </div>

          {/* Gallery Grid */}
          <GalleryGrid 
            posts={filteredPosts}
            title=""
            description=""
          />
        </main>
      </div>
    </div>
  );
}