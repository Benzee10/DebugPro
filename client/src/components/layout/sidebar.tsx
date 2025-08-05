import React, { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useSearch } from "@/hooks/use-search";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import type { GalleryPost, Model, GalleryData } from "@shared/schema";

interface SidebarProps {
  posts: GalleryPost[];
  galleryData: GalleryData;
  onFiltersChange?: (posts: GalleryPost[]) => void;
}

export function Sidebar({ posts, galleryData, onFiltersChange }: SidebarProps) {
  const { accentHue, setAccentHue } = useTheme();
  const { filters, updateFilter, filteredPosts } = useSearch(posts);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Update parent when filters change
  React.useEffect(() => {
    onFiltersChange?.(filteredPosts);
  }, [filteredPosts, onFiltersChange]);

  const modelCounts = galleryData.models.reduce((acc, model) => {
    acc[model.name] = posts.filter(post => post.model === model.slug).length;
    return acc;
  }, {} as Record<string, number>);

  const categoryCounts = galleryData.categories.reduce((acc, category) => {
    acc[category] = posts.filter(post => post.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  const handleModelToggle = (modelSlug: string, checked: boolean) => {
    const currentModels = filters.models || [];
    const newModels = checked
      ? [...currentModels, modelSlug]
      : currentModels.filter(m => m !== modelSlug);
    updateFilter('models', newModels);
  };

  const handleCategoryToggle = (category: string, checked: boolean) => {
    const currentCategories = filters.categories || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category);
    updateFilter('categories', newCategories);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    updateFilter('tags', newTags);
  };

  return (
    <aside className={`hidden lg:block ${isCollapsed ? 'w-12' : 'w-64'} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300 ease-in-out`}>
      {/* Toggle Button */}
      <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
          data-testid="sidebar-toggle"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-gray-500" />
          ) : (
            <ChevronLeft size={16} className="text-gray-500" />
          )}
        </Button>
      </div>

      {/* Collapsed State - Show Only Filter Icon */}
      {isCollapsed ? (
        <div className="p-3 flex justify-center">
          <Filter size={20} className="text-gray-400" />
        </div>
      ) : (
        <div className="p-6 space-y-6">
        {/* Accent Hue Slider */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Accent Color
          </Label>
          <Slider
            value={[accentHue]}
            onValueChange={(value) => setAccentHue(value[0])}
            max={360}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        
        {/* Models Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Models
          </h3>
          <div className="space-y-2">
            {galleryData.models.map((model) => (
              <div key={model.slug} className="flex items-center space-x-2">
                <Checkbox
                  id={`model-${model.slug}`}
                  checked={(filters.models || []).includes(model.slug)}
                  onCheckedChange={(checked) => handleModelToggle(model.slug, checked as boolean)}
                />
                <Label
                  htmlFor={`model-${model.slug}`}
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                >
                  {model.name}{" "}
                  <span className="text-gray-400">({modelCounts[model.name] || 0})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Categories Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Categories
          </h3>
          <div className="space-y-2">
            {galleryData.categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={(filters.categories || []).includes(category)}
                  onCheckedChange={(checked) => handleCategoryToggle(category, checked as boolean)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {galleryData.tags.slice(0, 8).map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-2 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                  (filters.tags || []).includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Date Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Date Range
          </h3>
          <Select
            value={filters.dateRange || "all"}
            onValueChange={(value) => updateFilter('dateRange', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>
      )}
    </aside>
  );
}
