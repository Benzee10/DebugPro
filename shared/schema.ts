import { z } from "zod";

export const galleryPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  model: z.string(),
  category: z.string(),
  cover: z.string(),
  slug: z.string(),
  images: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    caption: z.string().optional()
  }))
});

export const galleryPostMetaSchema = galleryPostSchema.omit({ images: true }).extend({
  imageCount: z.number(),
  likes: z.number().default(0)
});

export const modelSchema = z.object({
  name: z.string(),
  slug: z.string(),
  avatar: z.string(),
  bio: z.string(),
  galleryCount: z.number(),
  totalLikes: z.number(),
  joinDate: z.string()
});

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  models: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  dateRange: z.enum(['all', 'week', 'month', 'year']).optional(),
  sortBy: z.enum(['date', 'likes', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export type GalleryPost = z.infer<typeof galleryPostSchema>;
export type GalleryPostMeta = z.infer<typeof galleryPostMetaSchema>;
export type Model = z.infer<typeof modelSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;

// Static data types for the gallery
export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface GalleryData {
  posts: GalleryPost[];
  models: Model[];
  categories: string[];
  tags: string[];
}
