interface AdBannerProps {
  position: "top" | "middle" | "bottom";
  className?: string;
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const adImages = {
    top: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLnNCb3lbPZ-fHB1I_MsM42u2qw6ocRM5Pfg&s",
    middle: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVESb6AsPFDWPpxAl9oPEP29E1cP2icK4NBo9Od4ruHBy2fhMpFy5r5TayMHOf5lI_O7Q&usqp=CAU",
    bottom: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYZaD3vqGrLWH-PMPS3u-lrh0GK8igAOb_F_i-_zAb9cLsa8bGWdPYl-BVmdx-j7iIBtc&usqp=CAU"
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