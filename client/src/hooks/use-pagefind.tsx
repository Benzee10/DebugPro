import { useState, useEffect, useCallback } from 'react';
import type { GalleryPost } from '@shared/schema';

interface SearchResult {
  post: GalleryPost;
  score: number;
  excerpt: string;
}

export function usePagefind(posts: GalleryPost[]) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Client-side search implementation since we don't have a build step for Pagefind
      const results: SearchResult[] = [];
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

      posts.forEach(post => {
        let score = 0;
        let matchedText = '';

        // Search in title
        const titleMatches = searchTerms.filter(term => 
          post.title.toLowerCase().includes(term)
        );
        score += titleMatches.length * 3;

        // Search in description
        const descMatches = searchTerms.filter(term => 
          post.description.toLowerCase().includes(term)
        );
        score += descMatches.length * 2;

        // Search in tags
        const tagMatches = searchTerms.filter(term =>
          post.tags.some(tag => tag.toLowerCase().includes(term))
        );
        score += tagMatches.length * 2;

        // Search in model name
        const modelMatches = searchTerms.filter(term =>
          post.model.toLowerCase().includes(term)
        );
        score += modelMatches.length * 2;

        // Search in category
        const categoryMatches = searchTerms.filter(term =>
          post.category.toLowerCase().includes(term)
        );
        score += categoryMatches.length;

        if (score > 0) {
          // Create excerpt from description
          const excerpt = post.description.length > 150 
            ? post.description.substring(0, 150) + '...'
            : post.description;

          results.push({
            post,
            score,
            excerpt
          });
        }
      });

      // Sort by relevance score
      results.sort((a, b) => b.score - a.score);
      setSearchResults(results.slice(0, 10)); // Limit to top 10 results

    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [posts]);

  return {
    searchResults,
    isSearching,
    search
  };
}