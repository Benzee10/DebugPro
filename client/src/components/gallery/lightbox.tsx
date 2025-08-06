import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryImage } from "@shared/schema";

interface LightboxProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  title: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function Lightbox({
  isOpen,
  images,
  currentIndex,
  title,
  onClose,
  onNext,
  onPrevious
}: LightboxProps) {
  const currentImage = images[currentIndex];
  const hasNext = currentIndex < images.length - 1;
  const hasPrevious = currentIndex > 0;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          if (hasNext) onNext();
          break;
        case "ArrowLeft":
          if (hasPrevious) onPrevious();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, hasNext, hasPrevious, onClose, onNext, onPrevious]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 lightbox-backdrop animate-fade-in">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-6 right-6 text-white hover:text-gray-300 z-10 hover:bg-white/10"
          onClick={onClose}
        >
          <X size={24} />
        </Button>
        
        {/* Navigation Buttons */}
        {hasPrevious && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 hover:bg-white/10"
            onClick={onPrevious}
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        
        {hasNext && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 hover:bg-white/10"
            onClick={onNext}
          >
            <ChevronRight size={24} />
          </Button>
        )}
        
        {/* Image Container */}
        <div 
          className="max-w-full max-h-full flex items-center justify-center cursor-pointer"
          onClick={onClose}
        >
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        {/* Image Info */}
        <div className="absolute bottom-6 left-6 right-6 text-center">
          <div className="inline-flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
            <span>{currentIndex + 1}</span>
            <span className="text-gray-300">/</span>
            <span>{images.length}</span>
            <span className="text-gray-300">•</span>
            <span className="font-medium">
              {title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
