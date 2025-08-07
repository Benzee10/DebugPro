import { format } from "date-fns";
import { Images, Heart, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import type { GalleryPost } from "@shared/schema";

interface GalleryCardProps {
  post: GalleryPost;
  onClick?: () => void;
  onImageClick?: (post: GalleryPost, imageIndex: number) => void;
}

export function GalleryCard({ post, onClick, onImageClick }: GalleryCardProps) {
  const { accentHue } = useTheme();
  const formattedDate = format(new Date(post.date), "MMM d, yyyy");
  const imageCount = Array.isArray(post.images) ? post.images.length : 0;
  
  // Use default likes since GalleryPost doesn't have ratingCount
  const likes = 0;

  const getModelInitial = (model: string) => model.charAt(0).toUpperCase();
  
  const getModelColor = (model: string) => {
    const colors = {
      "mila-azul": "from-pink-400 to-rose-500",
      mila: "from-orange-400 to-pink-500",
      lena: "from-purple-400 to-blue-500",
      sofia: "from-indigo-400 to-cyan-500"
    };
    return colors[model as keyof typeof colors] || "from-gray-400 to-gray-500";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Metart X": "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
      "Metart": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      "Ultra Films": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      "Wow Girls": "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
      Nature: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      Portrait: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      Fashion: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      Studio: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(post, 0);
    } else {
      // Default behavior: redirect to external URL
      window.open('https://redirect01.vercel.app/', '_blank');
    }
  };

  return (
    <article className="masonry-item group">
      <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden card-hover">
        {/* Cover Image */}
        <div className="relative overflow-hidden">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            loading="lazy"
            onClick={handleImageClick}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Images size={14} />
                  <span className="text-sm font-medium">{imageCount} photos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart size={14} />
                  <span className="text-sm">{likes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getModelColor(post.model)} rounded-full flex items-center justify-center`}>
                <span className="text-white text-sm font-semibold">
                  {getModelInitial(post.model)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {post.model === "mila-azul" ? "Mila Azul" : post.model}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formattedDate}
                </p>
              </div>
            </div>
            <Badge className={getCategoryColor(post.category)}>
              {post.category}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {(post.tags || []).slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
              {(post.tags || []).length > 2 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  +{(post.tags || []).length - 2}
                </Badge>
              )}
            </div>
            <Link href={`/gallery/${post.slug}`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                style={{
                  borderColor: `hsl(${accentHue}, 70%, 50%)`,
                  color: `hsl(${accentHue}, 70%, 50%)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `hsl(${accentHue}, 70%, 50%)`;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = `hsl(${accentHue}, 70%, 50%)`;
                }}
              >
                View Gallery
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
