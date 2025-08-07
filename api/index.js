// Vercel serverless function entry point
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Import gallery data from the same directory (for Vercel)
const galleryDataPath = path.join(__dirname, 'gallery-data.json');
let galleryData = {};

try {
  if (fs.existsSync(galleryDataPath)) {
    galleryData = JSON.parse(fs.readFileSync(galleryDataPath, 'utf8'));
    console.log(`Loaded ${galleryData.posts?.length || 0} posts for Vercel`);
  } else {
    console.error('Gallery data file not found at:', galleryDataPath);
  }
} catch (error) {
  console.error('Error loading gallery data:', error);
}

app.use(express.json());

// API routes
app.get('/api/gallery-data', (req, res) => {
  try {
    if (!galleryData.posts || galleryData.posts.length === 0) {
      res.status(500).json({ error: 'No gallery data available' });
      return;
    }
    res.json(galleryData);
  } catch (error) {
    console.error('Error serving gallery data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/galleries/trending', (req, res) => {
  try {
    const posts = galleryData.posts || [];
    if (posts.length === 0) {
      res.status(500).json({ error: 'No posts available' });
      return;
    }
    
    const trending = posts.slice(0, 5).map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      slug: post.slug,
      model: post.model,
      category: post.category,
      cover: post.cover,
      images: post.images,
      publishedAt: post.date,
      tags: post.tags || []
    }));
    
    res.json({ galleries: trending });
  } catch (error) {
    console.error('Error serving trending galleries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export for Vercel
export default app;