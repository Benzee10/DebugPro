import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Play } from "lucide-react";

const VIDEO_URLS = [
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b99880ff529.06142108.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9964d538f7.59762869.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b996f8e2100.68901658.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9991c5d4f2.73297277.mp4"
];

export function StickyVideoWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Select random video on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * VIDEO_URLS.length);
    setCurrentVideoUrl(VIDEO_URLS[randomIndex]);
  }, []);

  // Auto-play video when loaded
  useEffect(() => {
    if (videoRef.current && currentVideoUrl) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentVideoUrl]);

  const handleSeeMore = () => {
    window.open('https://shinyvideos.vercel.app/', '_blank');
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleVideoClick = () => {
    handleSeeMore();
  };

  const handleVideoEnd = () => {
    // Play next random video
    const currentIndex = VIDEO_URLS.indexOf(currentVideoUrl);
    const availableVideos = VIDEO_URLS.filter((_, index) => index !== currentIndex);
    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    setCurrentVideoUrl(availableVideos[randomIndex]);
  };

  if (!isVisible || !currentVideoUrl) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-black rounded-lg shadow-2xl overflow-hidden border border-gray-800"
      style={{ width: '280px', height: '200px' }}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="absolute top-2 right-2 z-10 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white border-none"
        data-testid="close-video-widget"
      >
        <X size={16} />
      </Button>

      {/* Video Container */}
      <div 
        className="relative w-full h-full cursor-pointer group"
        onClick={handleVideoClick}
        data-testid="video-container"
      >
        <video
          ref={videoRef}
          src={currentVideoUrl}
          className="w-full h-full object-cover"
          muted
          loop={false}
          playsInline
          onEnded={handleVideoEnd}
          data-testid="sticky-video"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* See More Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={handleSeeMore}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              data-testid="see-more-button"
            >
              <Play size={16} className="mr-2" />
              See More
            </Button>
          </div>
        </div>

        {/* Play indicator when not playing */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play size={24} className="text-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom gradient for better text visibility */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
    </div>
  );
}