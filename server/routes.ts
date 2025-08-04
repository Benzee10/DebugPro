import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for gallery data
  app.get("/api/galleries", async (req, res) => {
    try {
      // In a real implementation, this would read from markdown files
      const galleries = [
        {
          slug: "mila/summer-bliss",
          title: "Summer Bliss",
          description: "Soft golden hour set",
          date: "2025-08-04T10:00:00",
          tags: ["sunset", "outdoors"],
          model: "mila",
          category: "Nature",
          cover: "01.jpg"
        }
      ];
      res.json(galleries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch galleries" });
    }
  });

  app.get("/api/galleries/:model/:slug", async (req, res) => {
    try {
      const { model, slug } = req.params;
      // In a real implementation, this would read the specific markdown file
      // and parse it to return the full gallery data with images
      res.json({ message: `Gallery ${model}/${slug} endpoint` });
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

  const httpServer = createServer(app);
  return httpServer;
}
