import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/use-search";
import { galleryData } from "@/lib/gallery-data";
import type { GalleryPost } from "@shared/schema";

interface SearchPanelProps {
  onClose?: () => void;
  onResults?: (posts: GalleryPost[]) => void;
}

export function SearchPanel({ onClose, onResults }: SearchPanelProps) {
  const { filters, updateFilter, filteredPosts } = useSearch(galleryData.posts);

  const handleSearchChange = (query: string) => {
    updateFilter('query', query);
    onResults?.(filteredPosts);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search galleries, models, tags..."
        value={filters.query || ""}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
    </div>
  );
}
