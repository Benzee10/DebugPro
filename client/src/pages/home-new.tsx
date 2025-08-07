import { useState, useEffect } from 'react';
import { GalleryCardSimple } from '@/components/gallery/gallery-card-simple';
import type { GalleryPost } from '@shared/schema';

export default function HomeNew() {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/api/gallery-data');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Data loaded:', data);
        
        if (data.posts && Array.isArray(data.posts)) {
          setPosts(data.posts);
          console.log('Set posts:', data.posts.length);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg">Loading galleries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Photo Gallery
        </h1>
        
        <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">
          Debug: Loaded {posts.length} posts
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 12).map((post, index) => (
            <GalleryCardSimple key={post.slug || post.title || index} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No galleries available</p>
          </div>
        )}
      </div>
    </div>
  );
}