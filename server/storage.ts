import fs from 'fs';
import path from 'path';
import { loadGalleryPostsFromMarkdown } from './markdown-loader';
import {
  type User,
  type UpsertUser,
  type Gallery,
  type InsertGallery,
  type Favorite,
  type InsertFavorite,
  type Rating,
  type InsertRating,
  type View, 
  type InsertView,
  type SearchFilters,
  type GalleryPost,
  type GalleryPostMeta,
  type Model
} from '@shared/schema';

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Gallery methods
  getAllGalleries(page?: number, limit?: number): Promise<{ galleries: Gallery[]; total: number }>;
  getGalleryBySlug(slug: string): Promise<Gallery | null>;
  searchGalleries(filters: SearchFilters): Promise<{ galleries: Gallery[]; total: number }>;
  getTrendingGalleries(limit?: number): Promise<Gallery[]>;
  getRecommendedGalleries(userId: string, limit?: number): Promise<Gallery[]>;
  
  // User interaction methods
  addToFavorites(userId: string, galleryId: string): Promise<Favorite>;
  removeFromFavorites(userId: string, galleryId: string): Promise<void>;
  getUserFavorites(userId: string, page?: number, limit?: number): Promise<{ galleries: Gallery[]; total: number }>;
  isFavorited(userId: string, galleryId: string): Promise<boolean>;
  
  rateGallery(userId: string, galleryId: string, rating: number): Promise<Rating>;
  getUserRating(userId: string, galleryId: string): Promise<Rating | null>;
  
  recordView(userId: string | null, galleryId: string, ipAddress?: string, userAgent?: string): Promise<View>;
  
  // Legacy methods for compatibility
  getGalleryBySlugLegacy(slug: string): Promise<GalleryPost | null>;
  getAllModels(): Promise<Model[]>;
  getModelBySlug(slug: string): Promise<Model | null>;
  getCategories(): Promise<string[]>;
  getTags(): Promise<string[]>;
}

export class MemoryStorage implements IStorage {
  private galleries: GalleryPost[] = [];
  private viewCounts: Record<string, number> = {};
  private lastLoaded = 0;
  
  private async loadData() {
    // Load data every 5 minutes or on first load
    const now = Date.now();
    if (now - this.lastLoaded > 5 * 60 * 1000 || this.galleries.length === 0) {
      try {
        // Try loading from JSON first (faster)
        const jsonPath = path.join(process.cwd(), 'api', 'gallery-data.json');
        if (fs.existsSync(jsonPath)) {
          const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
          this.galleries = jsonData.posts || [];
        } else {
          // Fallback to markdown loading
          this.galleries = await loadGalleryPostsFromMarkdown();
        }
        this.lastLoaded = now;
      } catch (error) {
        console.error('Error loading gallery data:', error);
        // Fallback to empty array
        this.galleries = [];
      }
    }
  }

  // User operations (simplified for non-auth environment)
  async getUser(id: string): Promise<User | undefined> {
    return undefined; // No authentication needed
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    throw new Error('Authentication disabled');
  }

  // Gallery methods
  async getAllGalleries(page = 1, limit = 20): Promise<{ galleries: Gallery[]; total: number }> {
    await this.loadData();
    
    const offset = (page - 1) * limit;
    const total = this.galleries.length;
    
    // Convert GalleryPost to Gallery format
    const galleries = this.galleries
      .slice(offset, offset + limit)
      .map(this.convertToGallery.bind(this));

    return { galleries, total };
  }

  async getGalleryBySlug(slug: string): Promise<Gallery | null> {
    await this.loadData();
    
    const post = this.galleries.find(p => p.slug === slug);
    if (!post) return null;
    
    // Increment view count
    this.viewCounts[slug] = (this.viewCounts[slug] || 0) + 1;
    
    return this.convertToGallery(post);
  }

  async searchGalleries(filters: SearchFilters): Promise<{ galleries: Gallery[]; total: number }> {
    await this.loadData();
    
    let filteredGalleries = [...this.galleries];
    
    // Apply query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredGalleries = filteredGalleries.filter(g => 
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query) ||
        g.model.toLowerCase().includes(query)
      );
    }
    
    // Apply model filter
    if (filters.models && filters.models.length > 0) {
      filteredGalleries = filteredGalleries.filter(g =>
        filters.models!.some(model => g.model.toLowerCase().includes(model.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filteredGalleries = filteredGalleries.filter(g =>
        filters.categories!.includes(g.category)
      );
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredGalleries = filteredGalleries.filter(g =>
        filters.tags!.some(tag => g.tags.includes(tag))
      );
    }
    
    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoff.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredGalleries = filteredGalleries.filter(g => 
        new Date(g.date) >= cutoff
      );
    }
    
    // Apply sorting
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    
    filteredGalleries.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'views':
          aValue = this.viewCounts[a.slug] || 0;
          bValue = this.viewCounts[b.slug] || 0;
          break;
        case 'rating':
        case 'date':
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    const total = filteredGalleries.length;
    
    const galleries = filteredGalleries
      .slice(offset, offset + limit)
      .map(this.convertToGallery.bind(this));

    return { galleries, total };
  }

  async getTrendingGalleries(limit = 10): Promise<Gallery[]> {
    await this.loadData();
    
    // Initialize some view counts if empty (to simulate trending behavior)
    if (Object.keys(this.viewCounts).length === 0 && this.galleries.length > 0) {
      this.galleries.forEach((gallery, index) => {
        // Simulate higher view counts for first few galleries
        this.viewCounts[gallery.slug] = Math.max(1, 100 - (index * 5) + Math.floor(Math.random() * 20));
      });
    }
    
    // Sort by view count and recent date
    const trending = [...this.galleries]
      .sort((a, b) => {
        const aViews = this.viewCounts[a.slug] || 0;
        const bViews = this.viewCounts[b.slug] || 0;
        if (aViews !== bViews) return bViews - aViews;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, limit)
      .map(this.convertToGallery.bind(this));
    
    return trending;
  }

  async getRecommendedGalleries(userId: string, limit = 10): Promise<Gallery[]> {
    // Just return trending for now since no user data
    return this.getTrendingGalleries(limit);
  }

  // User interaction methods (simplified/disabled)
  async addToFavorites(userId: string, galleryId: string): Promise<Favorite> {
    throw new Error('Authentication disabled');
  }

  async removeFromFavorites(userId: string, galleryId: string): Promise<void> {
    throw new Error('Authentication disabled');
  }

  async getUserFavorites(userId: string, page = 1, limit = 20): Promise<{ galleries: Gallery[]; total: number }> {
    return { galleries: [], total: 0 };
  }

  async isFavorited(userId: string, galleryId: string): Promise<boolean> {
    return false;
  }

  async rateGallery(userId: string, galleryId: string, rating: number): Promise<Rating> {
    throw new Error('Authentication disabled');
  }

  async getUserRating(userId: string, galleryId: string): Promise<Rating | null> {
    return null;
  }

  async recordView(userId: string | null, galleryId: string, ipAddress?: string, userAgent?: string): Promise<View> {
    // Just increment our simple view counter
    this.viewCounts[galleryId] = (this.viewCounts[galleryId] || 0) + 1;
    return {
      id: Date.now().toString(),
      userId,
      galleryId,
      viewedAt: new Date(),
      ipAddress: ipAddress || null,
      userAgent: userAgent || null
    };
  }

  // Legacy methods for compatibility
  async getGalleryBySlugLegacy(slug: string): Promise<GalleryPost | null> {
    await this.loadData();
    return this.galleries.find(p => p.slug === slug) || null;
  }

  async getAllModels(): Promise<Model[]> {
    await this.loadData();
    
    const modelMap = new Map<string, { count: number; galleries: GalleryPost[] }>();
    
    this.galleries.forEach(gallery => {
      const modelName = gallery.model;
      if (!modelMap.has(modelName)) {
        modelMap.set(modelName, { count: 0, galleries: [] });
      }
      const modelData = modelMap.get(modelName)!;
      modelData.count++;
      modelData.galleries.push(gallery);
    });
    
    return Array.from(modelMap.entries()).map(([name, data]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      avatar: data.galleries[0]?.cover || '',
      bio: `Model with ${data.count} galleries`,
      galleryCount: data.count,
      totalLikes: data.galleries.reduce((sum, g) => sum + (this.viewCounts[g.slug] || 0), 0),
      joinDate: new Date().toISOString()
    }));
  }

  async getModelBySlug(slug: string): Promise<Model | null> {
    const models = await this.getAllModels();
    return models.find(m => m.slug === slug) || null;
  }

  async getCategories(): Promise<string[]> {
    await this.loadData();
    const categories = Array.from(new Set(this.galleries.map(g => g.category)));
    return categories.sort();
  }

  async getTags(): Promise<string[]> {
    await this.loadData();
    const allTags = new Set<string>();
    this.galleries.forEach(gallery => {
      gallery.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }

  private convertToGallery(post: GalleryPost): Gallery {
    return {
      id: post.slug,
      title: post.title,
      description: post.description,
      slug: post.slug,
      model: post.model,
      category: post.category,
      cover: post.cover,
      images: post.images,
      tags: post.tags,
      publishedAt: new Date(post.date),
      viewCount: this.viewCounts[post.slug] || 0,
      averageRating: "0",
      ratingCount: 0,
      createdAt: new Date(post.date),
      updatedAt: new Date(post.date)
    };
  }
}

export const storage = new MemoryStorage();
