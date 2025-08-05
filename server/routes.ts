import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateSitemap, generateRSSFeed, generateSitemapIndex } from "../client/src/lib/seo";
import { loadGalleryData, loadGalleryPostsFromMarkdown } from "./markdown-loader";
// import { migrateGalleryData } from "./migrate-data"; // Disabled - no longer using database
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Database migration disabled - using JSON/markdown data instead
  console.log('Using JSON/markdown data source - no database migration needed');

  // Gallery routes with new database functionality
  app.get('/api/galleries', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await storage.getAllGalleries(page, limit);
      res.json({
        galleries: result.galleries,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      });
    } catch (error) {
      console.error('Error fetching galleries:', error);
      res.status(500).json({ error: 'Failed to fetch galleries' });
    }
  });

  app.get('/api/galleries/trending', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const galleries = await storage.getTrendingGalleries(limit);
      res.json({ galleries });
    } catch (error) {
      console.error('Error fetching trending galleries:', error);
      res.status(500).json({ error: 'Failed to fetch trending galleries' });
    }
  });

  app.get('/api/galleries/recommended', async (req: any, res) => {
    try {
      // For non-authenticated users, just return trending galleries
      const limit = parseInt(req.query.limit as string) || 10;
      const galleries = await storage.getTrendingGalleries(limit);
      res.json({ galleries });
    } catch (error) {
      console.error('Error fetching recommended galleries:', error);
      res.status(500).json({ error: 'Failed to fetch recommended galleries' });
    }
  });

  // Legacy route with database support
  app.get("/api/galleries/:model/:slug", async (req, res) => {
    try {
      const { model, slug } = req.params;
      const fullSlug = `${model}/${slug}`;
      const gallery = await storage.getGalleryBySlug(fullSlug);
      
      if (!gallery) {
        // Fallback to legacy markdown loader
        const posts = await loadGalleryPostsFromMarkdown();
        const post = posts.find(p => p.slug === fullSlug);
        
        if (!post) {
          return res.status(404).json({ error: "Gallery not found" });
        }
        
        return res.json(post);
      }
      
      // Record anonymous view
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');
      
      try {
        await storage.recordView(null, gallery.id, ipAddress, userAgent);
      } catch (viewError) {
        console.error('Error recording view:', viewError);
      }
      
      res.json(gallery);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  app.get('/api/search', async (req, res) => {
    try {
      const filters = {
        query: req.query.q as string,
        models: req.query.models ? (req.query.models as string).split(',') : undefined,
        categories: req.query.categories ? (req.query.categories as string).split(',') : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        dateRange: req.query.dateRange as any,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20
      };
      
      const result = await storage.searchGalleries(filters);
      res.json({
        galleries: result.galleries,
        total: result.total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(result.total / filters.limit)
      });
    } catch (error) {
      console.error('Error searching galleries:', error);
      res.status(500).json({ error: 'Failed to search galleries' });
    }
  });



  // Model routes
  app.get("/api/models", async (req, res) => {
    try {
      const models = await storage.getAllModels();
      res.json({ models });
    } catch (error) {
      console.error('Error fetching models:', error);
      res.status(500).json({ error: 'Failed to fetch models' });
    }
  });

  app.get('/api/models/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const model = await storage.getModelBySlug(slug);
      
      if (!model) {
        return res.status(404).json({ error: 'Model not found' });
      }
      
      res.json(model);
    } catch (error) {
      console.error('Error fetching model:', error);
      res.status(500).json({ error: 'Failed to fetch model' });
    }
  });

  // Categories and tags
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.get('/api/tags', async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json({ tags });
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  });

  // Legacy compatibility routes
  app.get('/api/posts', async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await storage.getAllGalleries(page, limit);
      
      // Convert to legacy format
      const posts = result.galleries.map(gallery => ({
        ...gallery,
        date: gallery.publishedAt?.toISOString() || new Date().toISOString(),
        imageCount: Array.isArray(gallery.images) ? gallery.images.length : 0,
        likes: gallery.ratingCount || 0
      }));
      
      res.json({ posts });
    } catch (error) {
      console.error('Error fetching posts (legacy):', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  // SEO endpoints
  app.get("/sitemap.xml", (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const sitemap = generateSitemap(baseUrl);
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate sitemap" });
    }
  });

  app.get("/sitemap-index.xml", (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const sitemapIndex = generateSitemapIndex(baseUrl);
      res.set('Content-Type', 'application/xml');
      res.send(sitemapIndex);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate sitemap index" });
    }
  });

  app.get("/rss.xml", (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const rssFeed = generateRSSFeed(baseUrl);
      res.set('Content-Type', 'application/rss+xml');
      res.send(rssFeed);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate RSS feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
