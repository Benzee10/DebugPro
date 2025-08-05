import fs from 'fs';
import path from 'path';
import { eq, desc, asc, and, or, like, sql, count } from 'drizzle-orm';
import { db } from './db';
import {
  users,
  galleries,
  favorites,
  ratings,
  views,
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

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Gallery methods
  async getAllGalleries(page = 1, limit = 20): Promise<{ galleries: Gallery[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const [galleriesResult, totalResult] = await Promise.all([
      db.select().from(galleries)
        .orderBy(desc(galleries.publishedAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(galleries)
    ]);

    return {
      galleries: galleriesResult,
      total: totalResult[0].count
    };
  }

  async getGalleryBySlug(slug: string): Promise<Gallery | null> {
    const [gallery] = await db.select().from(galleries).where(eq(galleries.slug, slug));
    
    if (gallery) {
      // Increment view count
      await db.update(galleries)
        .set({ 
          viewCount: sql`${galleries.viewCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(galleries.id, gallery.id));
    }
    
    return gallery || null;
  }

  async searchGalleries(filters: SearchFilters): Promise<{ galleries: Gallery[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    
    let whereConditions: any[] = [];
    
    if (filters.query) {
      whereConditions.push(
        or(
          like(galleries.title, `%${filters.query}%`),
          like(galleries.description, `%${filters.query}%`),
          like(galleries.model, `%${filters.query}%`)
        )
      );
    }
    
    if (filters.models && filters.models.length > 0) {
      whereConditions.push(
        or(...filters.models.map(model => like(galleries.model, `%${model}%`)))
      );
    }
    
    if (filters.categories && filters.categories.length > 0) {
      whereConditions.push(
        or(...filters.categories.map(category => eq(galleries.category, category)))
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      whereConditions.push(
        or(...filters.tags.map(tag => sql`${galleries.tags} @> ARRAY[${tag}]`))
      );
    }
    
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
      
      whereConditions.push(sql`${galleries.publishedAt} >= ${cutoff}`);
    }
    
    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined;
    
    // Determine sort order
    let orderBy;
    const sortOrder = filters.sortOrder || 'desc';
    const orderFn = sortOrder === 'asc' ? asc : desc;
    
    switch (filters.sortBy) {
      case 'title':
        orderBy = sortOrder === 'asc' ? asc(galleries.title) : desc(galleries.title);
        break;
      case 'rating':
        orderBy = orderFn(galleries.averageRating);
        break;
      case 'views':
        orderBy = orderFn(galleries.viewCount);
        break;
      case 'date':
      default:
        orderBy = orderFn(galleries.publishedAt);
        break;
    }
    
    const [galleriesResult, totalResult] = await Promise.all([
      db.select().from(galleries)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db.select({ count: count() }).from(galleries).where(whereClause)
    ]);

    return {
      galleries: galleriesResult,
      total: totalResult[0]?.count || 0
    };
  }

  async getTrendingGalleries(limit = 10): Promise<Gallery[]> {
    // Get trending based on recent views and ratings
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return await db.select().from(galleries)
      .orderBy(
        desc(galleries.viewCount),
        desc(galleries.averageRating),
        desc(galleries.publishedAt)
      )
      .limit(limit);
  }

  async getRecommendedGalleries(userId: string, limit = 10): Promise<Gallery[]> {
    // Get recommendations based on user's viewed categories and models
    const userViews = await db.select({
      category: galleries.category,
      model: galleries.model
    })
    .from(views)
    .innerJoin(galleries, eq(views.galleryId, galleries.id))
    .where(eq(views.userId, userId))
    .groupBy(galleries.category, galleries.model)
    .limit(20);
    
    if (userViews.length === 0) {
      // Fallback to trending if no viewing history
      return this.getTrendingGalleries(limit);
    }
    
    const categories = Array.from(new Set(userViews.map(v => v.category)));
    const models = Array.from(new Set(userViews.map(v => v.model)));
    
    return await db.select().from(galleries)
      .where(
        or(
          or(...categories.map(cat => eq(galleries.category, cat))),
          or(...models.map(model => like(galleries.model, `%${model}%`)))
        )
      )
      .orderBy(desc(galleries.averageRating), desc(galleries.viewCount))
      .limit(limit);
  }

  // User interaction methods
  async addToFavorites(userId: string, galleryId: string): Promise<Favorite> {
    const [favorite] = await db.insert(favorites)
      .values({ userId, galleryId })
      .onConflictDoNothing()
      .returning();
    return favorite;
  }

  async removeFromFavorites(userId: string, galleryId: string): Promise<void> {
    await db.delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.galleryId, galleryId)));
  }

  async getUserFavorites(userId: string, page = 1, limit = 20): Promise<{ galleries: Gallery[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const [galleriesResult, totalResult] = await Promise.all([
      db.select({
        id: galleries.id,
        title: galleries.title,
        description: galleries.description,
        slug: galleries.slug,
        model: galleries.model,
        category: galleries.category,
        cover: galleries.cover,
        images: galleries.images,
        tags: galleries.tags,
        publishedAt: galleries.publishedAt,
        viewCount: galleries.viewCount,
        averageRating: galleries.averageRating,
        ratingCount: galleries.ratingCount,
        createdAt: galleries.createdAt,
        updatedAt: galleries.updatedAt,
      })
      .from(favorites)
      .innerJoin(galleries, eq(favorites.galleryId, galleries.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt))
      .limit(limit)
      .offset(offset),
      db.select({ count: count() })
        .from(favorites)
        .where(eq(favorites.userId, userId))
    ]);

    return {
      galleries: galleriesResult,
      total: totalResult[0].count
    };
  }

  async isFavorited(userId: string, galleryId: string): Promise<boolean> {
    const [favorite] = await db.select({ id: favorites.id })
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.galleryId, galleryId)));
    return !!favorite;
  }

  async rateGallery(userId: string, galleryId: string, rating: number): Promise<Rating> {
    const [ratingRecord] = await db.insert(ratings)
      .values({ userId, galleryId, rating })
      .onConflictDoUpdate({
        target: [ratings.userId, ratings.galleryId],
        set: { rating, updatedAt: new Date() }
      })
      .returning();

    // Update gallery's average rating
    const ratingStats = await db.select({
      avg: sql<number>`AVG(${ratings.rating})`,
      count: count()
    })
    .from(ratings)
    .where(eq(ratings.galleryId, galleryId));

    if (ratingStats[0]) {
      await db.update(galleries)
        .set({
          averageRating: ratingStats[0].avg.toFixed(2),
          ratingCount: ratingStats[0].count,
          updatedAt: new Date()
        })
        .where(eq(galleries.id, galleryId));
    }

    return ratingRecord;
  }

  async getUserRating(userId: string, galleryId: string): Promise<Rating | null> {
    const [rating] = await db.select()
      .from(ratings)
      .where(and(eq(ratings.userId, userId), eq(ratings.galleryId, galleryId)));
    return rating || null;
  }

  async recordView(userId: string | null, galleryId: string, ipAddress?: string, userAgent?: string): Promise<View> {
    const [view] = await db.insert(views)
      .values({ userId, galleryId, ipAddress, userAgent })
      .returning();
    return view;
  }

  // Legacy methods for compatibility
  async getGalleryBySlugLegacy(slug: string): Promise<GalleryPost | null> {
    const gallery = await this.getGalleryBySlug(slug);
    if (!gallery) return null;
    
    // Convert to legacy format
    return {
      title: gallery.title,
      description: gallery.description,
      date: gallery.publishedAt?.toISOString() || new Date().toISOString(),
      tags: gallery.tags || [],
      model: gallery.model,
      category: gallery.category,
      cover: gallery.cover,
      slug: gallery.slug,
      images: gallery.images as any[] || []
    };
  }

  async getAllModels(): Promise<Model[]> {
    // Generate models from galleries for now
    const modelsData = await db.select({
      model: galleries.model,
      count: count(),
      avgRating: sql<number>`AVG(${galleries.averageRating})`,
      totalViews: sql<number>`SUM(${galleries.viewCount})`
    })
    .from(galleries)
    .groupBy(galleries.model)
    .orderBy(desc(count()));

    return modelsData.map(m => ({
      name: m.model,
      slug: m.model.toLowerCase().replace(/\s+/g, '-'),
      avatar: '', // Could be populated later
      bio: `Model with ${m.count} galleries`,
      galleryCount: m.count,
      totalLikes: m.totalViews || 0,
      joinDate: new Date().toISOString()
    }));
  }

  async getModelBySlug(slug: string): Promise<Model | null> {
    const models = await this.getAllModels();
    return models.find(m => m.slug === slug) || null;
  }

  async getCategories(): Promise<string[]> {
    const categories = await db.selectDistinct({ category: galleries.category })
      .from(galleries)
      .orderBy(asc(galleries.category));
    return categories.map(c => c.category);
  }

  async getTags(): Promise<string[]> {
    const tags = await db.select({ tags: galleries.tags })
      .from(galleries)
      .where(sql`${galleries.tags} IS NOT NULL AND array_length(${galleries.tags}, 1) > 0`);
    
    const allTags = new Set<string>();
    tags.forEach(t => {
      if (t.tags) {
        t.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    return Array.from(allTags).sort();
  }
}

export const storage = new DatabaseStorage();
