interface AdBannerProps {
  position: "top" | "middle" | "bottom";
  className?: string;
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const adContent = {
    top: {
      title: "Premium Content",
      description: "Discover exclusive galleries and behind-the-scenes content",
      cta: "Join Premium",
      bgColor: "bg-gradient-to-r from-pink-500 to-rose-500"
    },
    middle: {
      title: "Special Offer",
      description: "Get access to unlimited HD galleries and videos",
      cta: "Claim Offer",
      bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500"
    },
    bottom: {
      title: "More Like This",
      description: "Explore similar content from top photographers",
      cta: "Browse More",
      bgColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
    }
  };

  const ad = adContent[position];

  return (
    <div className={`w-full my-8 ${className}`}>
      <div className={`${ad.bgColor} rounded-lg p-6 text-white text-center shadow-lg`}>
        <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
        <p className="text-white/90 mb-4">{ad.description}</p>
        <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          {ad.cta}
        </button>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">Advertisement</p>
    </div>
  );
}