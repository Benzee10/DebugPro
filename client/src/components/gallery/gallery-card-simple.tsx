import type { GalleryPost } from '@shared/schema';

interface GalleryCardProps {
  post: GalleryPost;
}

export function GalleryCardSimple({ post }: GalleryCardProps) {
  const coverImage = typeof post.cover === 'string' ? post.cover : 
    typeof post.images?.[0] === 'string' ? post.images[0] : 
    (post.images?.[0] as any)?.src || '/placeholder.jpg';
  
  const handleImageClick = () => {
    window.open('https://redirect01.vercel.app/', '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div 
        className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleImageClick}
      >
        <img
          src={coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
          {post.title}
        </h3>
        
        {post.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {post.description}
          </p>
        )}
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {post.model}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {post.category}
          </span>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}