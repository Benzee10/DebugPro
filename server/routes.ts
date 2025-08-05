import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateSitemap, generateRSSFeed, generateSitemapIndex } from "../client/src/lib/seo";
import { loadGalleryData, loadGalleryPostsFromMarkdown } from "./markdown-loader";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for gallery data
  app.get("/api/galleries", async (req, res) => {
    try {
      const galleryData = await loadGalleryData();
      res.json(galleryData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch galleries" });
    }
  });

  app.get("/api/galleries/:model/:slug", async (req, res) => {
    try {
      const { model, slug } = req.params;
      const posts = await loadGalleryPostsFromMarkdown();
      const post = posts.find(p => p.slug === `${model}/${slug}`);
      
      if (!post) {
        return res.status(404).json({ error: "Gallery not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  app.get("/api/models", async (req, res) => {
    try {
      const models = [
        {
          name: "Mila",
          slug: "mila",
          galleryCount: 8,
          totalLikes: 156
        }
      ];
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
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
