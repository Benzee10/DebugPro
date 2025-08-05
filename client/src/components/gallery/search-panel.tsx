import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePagefind } from "@/hooks/use-pagefind";
import { fetchGalleryData } from "@/lib/api-client";
import { useState, useEffect } from "react";
import type { GalleryPost, GalleryData } from "@shared/schema";

interface SearchPanelProps {
  onClose?: () => void;
  onResults?: (posts: GalleryPost[]) => void;
}

export function SearchPanel({ onClose, onResults }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const { searchResults, isSearching, search } = usePagefind(galleryData?.posts || []);

  // Load gallery data from API
  useEffect(() => {
    fetchGalleryData().then(data => {
      setGalleryData(data);
    }).catch(error => {
      console.error('Failed to load gallery data for search:', error);
    });
  }, []);

  // Real-time search effect with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        search(searchQuery);
        setShowResults(true);
      } else {
        setShowResults(false);
        onResults?.(galleryData?.posts || []); // Show all posts when no search
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, onResults]);

  // Update parent with search results
  useEffect(() => {
    if (searchResults.length > 0) {
      onResults?.(searchResults.map(result => result.post));
    }
  }, [searchResults, onResults]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
    onResults?.(galleryData?.posts || []);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search galleries, models, tags..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Live Search Results Dropdown */}
      {showResults && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
              {searchResults.slice(0, 5).map((result, index) => (
                <button
                  key={result.post.slug}
                  onClick={() => {
                    window.location.href = `/gallery/${result.post.slug}`;
                  }}
                  className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <img
                    src={result.post.cover}
                    alt={result.post.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {result.post.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {result.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {result.post.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        {result.post.images.length} photos
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              {searchResults.length > 5 && (
                <div className="text-center p-2 text-xs text-gray-500 dark:text-gray-400">
                  and {searchResults.length - 5} more results...
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
