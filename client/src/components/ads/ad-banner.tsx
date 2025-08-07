interface AdBannerProps {
  position: "top" | "middle" | "bottom";
  className?: string;
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const adImages = {
    top: "https://i.postimg.cc/QCgjZR6S/preview-1-2.jpg",
    middle: "https://i.postimg.cc/bvdYSVJN/preview-1-1.jpg",
    bottom: "https://i.postimg.cc/nhFhphfm/preview-1.jpg"
  };

  const handleClick = () => {
    window.open('https://redirect01.vercel.app/', '_blank');
  };

  return (
    <div className={`w-full my-8 ${className}`}>
      <div 
        className="cursor-pointer transition-transform hover:scale-105 rounded-lg overflow-hidden shadow-lg"
        onClick={handleClick}
        data-testid={`ad-banner-${position}`}
      >
        <img
          src={adImages[position]}
          alt={`Advertisement ${position}`}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">Advertisement</p>
    </div>
  );
}