import { useState } from "react";
import { X, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyVideoWidgetProps {
  className?: string;
}

export function StickyVideoWidget({ className = "" }: StickyVideoWidgetProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isVisible) return null;

  const handleSeeMore = () => {
    window.open("https://redirecting-kappa.vercel.app/", "_blank");
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-xs ${className}`}>
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
      >
        <X size={14} />
      </button>

      {/* Video Preview */}
      <div className="relative aspect-video bg-gradient-to-br from-pink-500 to-purple-600">
        {!isPlaying ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-colors"
            >
              <Play className="text-white ml-1" size={24} />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="animate-pulse">▶ Playing Preview</div>
            </div>
          </div>
        )}
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h4 className="text-white font-semibold text-sm mb-1">
            Exclusive Content
          </h4>
          <p className="text-white/90 text-xs">
            Premium HD galleries & videos
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-3">
        <Button
          onClick={handleSeeMore}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium text-sm"
          size="sm"
        >
          <ExternalLink size={14} className="mr-2" />
          See More
        </Button>
      </div>
    </div>
  );
}