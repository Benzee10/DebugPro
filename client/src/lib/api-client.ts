import type { GalleryPost, Model, GalleryData } from '@shared/schema';

let cachedGalleryData: GalleryData | null = null;

export async function fetchGalleryData(): Promise<GalleryData> {
  if (cachedGalleryData) {
    return cachedGalleryData;
  }

  try {
    const response = await fetch('/api/galleries');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cachedGalleryData = data;
    return data;
  } catch (error) {
    console.error('Failed to fetch gallery data from API:', error);
    // Fallback to static data if API fails
    const { galleryData } = await import('./gallery-data');
    return galleryData;
  }
}

export async function fetchGalleryPost(slug: string): Promise<GalleryPost | undefined> {
  try {
    const [model, gallerySlug] = slug.split('/');
    const response = await fetch(`/api/galleries/${model}/${gallerySlug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch gallery post from API:', error);
    // Fallback to static data
    const { getGalleryPost } = await import('./gallery-data');
    return getGalleryPost(slug);
  }
}

// Clear cache function for development
export function clearCache() {
  cachedGalleryData = null;
}