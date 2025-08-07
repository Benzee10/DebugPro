import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import type { GalleryPost, SearchFilters } from "@shared/schema";

export function useSearch(posts: GalleryPost[]) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    models: [],
    categories: [],
    tags: [],
    dateRange: "all",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 20
  });

  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ["title", "description", "model", "tags", "category"],
      threshold: 0.4,
      includeScore: true
    });
  }, [posts]);

  const filteredPosts = useMemo(() => {
    console.log('useSearch filtering:', { postsLength: posts.length, filters });
    let result = posts;

    // Text search
    if (filters.query && filters.query.trim()) {
      const searchResults = fuse.search(filters.query);
      result = searchResults.map(item => item.item);
      console.log('After text search:', result.length);
    }

    // Model filter
    if (filters.models && filters.models.length > 0) {
      result = result.filter(post => filters.models!.includes(post.model));
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(post => filters.categories!.includes(post.category));
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(post => 
        post.tags && filters.tags!.some(tag => post.tags.includes(tag))
      );
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      result = result.filter(post => new Date(post.date) >= filterDate);
    }

    // Sort
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "likes":
          // This would come from metadata in a real implementation
          aValue = 0;
          bValue = 0;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    console.log('Final filtered result:', result.length);
    return result;
  }, [posts, filters, fuse]);

  return {
    filters,
    setFilters,
    filteredPosts,
    updateFilter: (key: keyof SearchFilters, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
}
