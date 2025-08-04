import { AdBanner } from "./ad-banner";

interface IntelligentAdInjectorProps {
  content: string;
  className?: string;
}

export function IntelligentAdInjector({ content, className = "" }: IntelligentAdInjectorProps) {
  // Parse content and inject ads based on block element count
  const injectAdsIntoContent = (htmlContent: string) => {
    // Split content by paragraphs and images
    const blocks = htmlContent.split(/(<img[^>]*>|<p[^>]*>.*?<\/p>)/gi).filter(block => block.trim());
    
    if (blocks.length < 3) {
      // Too few blocks, just add top and bottom ads
      return (
        <div className={className}>
          <AdBanner position="top" className="mb-8" />
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <AdBanner position="bottom" className="mt-8" />
        </div>
      );
    }

    const midPoint = Math.floor(blocks.length / 2);
    const topBlocks = blocks.slice(0, midPoint);
    const bottomBlocks = blocks.slice(midPoint);

    return (
      <div className={className}>
        {/* Top Ad */}
        <AdBanner position="top" className="mb-8" />
        
        {/* First half of content */}
        <div dangerouslySetInnerHTML={{ __html: topBlocks.join('') }} />
        
        {/* Middle Ad */}
        <AdBanner position="middle" className="my-8" />
        
        {/* Second half of content */}
        <div dangerouslySetInnerHTML={{ __html: bottomBlocks.join('') }} />
        
        {/* Bottom Ad */}
        <AdBanner position="bottom" className="mt-8" />
      </div>
    );
  };

  return injectAdsIntoContent(content);
}

// Hook for intelligent ad placement in markdown content
export function useIntelligentAdPlacement(markdownContent: string) {
  // Convert markdown to HTML with ad injection points
  const processContent = (content: string) => {
    // Split by double line breaks (paragraphs)
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    if (paragraphs.length < 4) {
      return {
        topAd: true,
        content: content,
        bottomAd: true,
        midAd: false
      };
    }

    const midPoint = Math.floor(paragraphs.length / 2);
    
    return {
      topAd: true,
      firstHalf: paragraphs.slice(0, midPoint).join('\n\n'),
      midAd: true,
      secondHalf: paragraphs.slice(midPoint).join('\n\n'),
      bottomAd: true
    };
  };

  return processContent(markdownContent);
}