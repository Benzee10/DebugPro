import type { Gallery } from "@shared/schema";

// Compatibility types for the frontend migration
export interface GalleryData {
  posts: Gallery[];
  models: any[];
  categories: any[];
  tags: any[];
}

// Helper function to safely access tags
export function getTags(gallery: Gallery): string[] {
  return Array.isArray(gallery.tags) ? gallery.tags : [];
}

// Helper function to get formatted date
export function getFormattedDate(gallery: Gallery): Date {
  return gallery.publishedAt ? new Date(gallery.publishedAt) : new Date();
}