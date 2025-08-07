// Vercel API route for trending galleries
import galleryData from '../gallery-data.json' assert { type: 'json' };

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const posts = galleryData.posts || [];
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
    
    res.status(200).json({ galleries: trending });
  } catch (error) {
    console.error('Error serving trending galleries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}