// Gallery data - complete dataset exported from the full application
const fs = require('fs');
const path = require('path');

let galleryData = null;

function loadGalleryData() {
  if (!galleryData) {
    try {
      const dataPath = path.join(__dirname, 'gallery-data.json');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      galleryData = JSON.parse(rawData);
      console.log(`Loaded ${galleryData.posts.length} posts from gallery-data.json`);
    } catch (error) {
      console.error('Failed to load gallery data:', error);
      // Fallback to minimal dataset
      galleryData = {
        posts: [],
        models: [],
        categories: [],
        tags: []
      };
    }
  }
  return galleryData;
}

// Simple SEO generation functions
function generateSimpleSitemap(baseUrl) {
  const data = loadGalleryData();
  const posts = data?.posts || [];
  const entries = [
    `  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`
  ];

  posts.forEach(post => {
    entries.push(`  <url>
    <loc>${baseUrl}/gallery/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
}

function generateSimpleRSS(baseUrl) {
  const data = loadGalleryData();
  const posts = data?.posts || [];
  const sortedPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const items = sortedPosts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${baseUrl}/gallery/${post.slug}</link>
      <guid>${baseUrl}/gallery/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
    </item>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shiny Dollop - Premium Photo Galleries</title>
    <description>Curated collections featuring Mila Azul from premium studios</description>
    <link>${baseUrl}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

// Main handler function
function handler(req, res) {
  const { url } = req;

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const baseUrl = `https://${req.headers.host}`;

    // Route handling
    if (url === '/sitemap.xml') {
      const sitemap = generateSimpleSitemap(baseUrl);
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(sitemap);
    } else if (url === '/sitemap-index.xml') {
      const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(sitemapIndex);
    } else if (url === '/rss.xml') {
      const rssFeed = generateSimpleRSS(baseUrl);
      res.setHeader('Content-Type', 'application/rss+xml');
      res.status(200).send(rssFeed);
    } else if (url === '/api/health') {
      res.status(200).json({ message: 'Server is running', timestamp: new Date().toISOString() });
    } else if (url === '/api/galleries') {
      const data = loadGalleryData();
      const posts = data?.posts || [];
      
      // Parse query parameters for pagination
      const urlParts = new URL(url, `http://${req.headers.host}`);
      const page = parseInt(urlParts.searchParams.get('page') || '1');
      const limit = parseInt(urlParts.searchParams.get('limit') || '20');
      
      const total = posts.length;
      const offset = (page - 1) * limit;
      const galleries = posts.slice(offset, offset + limit).map(post => ({
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
        viewCount: 0,
        averageRating: "0",
        ratingCount: 0,
        createdAt: new Date(post.date),
        updatedAt: new Date(post.date)
      }));
      
      res.status(200).json({
        galleries,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    } else if (url === '/api/galleries/trending') {
      const data = loadGalleryData();
      const posts = data?.posts || [];
      
      // Parse query parameters
      const urlParts = new URL(url, `http://${req.headers.host}`);
      const limit = parseInt(urlParts.searchParams.get('limit') || '10');
      
      // Return most recent posts as "trending"
      const galleries = posts.slice(0, limit).map(post => ({
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
        viewCount: Math.floor(Math.random() * 1000), // Random view count for trending
        averageRating: "0",
        ratingCount: 0,
        createdAt: new Date(post.date),
        updatedAt: new Date(post.date)
      }));
      
      res.status(200).json({ galleries });
    } else if (url.startsWith('/api/galleries/') && url.includes('/')) {
      // Handle individual gallery requests like /api/galleries/mila-azul/sunset-dreams
      const pathParts = url.split('/');
      const slug = pathParts.slice(3).join('/'); // Get everything after /api/galleries/
      
      const data = loadGalleryData();
      const posts = data?.posts || [];
      const post = posts.find(p => p.slug === slug);
      
      if (!post) {
        res.status(404).json({ error: 'Gallery not found' });
        return;
      }
      
      const gallery = {
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
        viewCount: Math.floor(Math.random() * 500),
        averageRating: "0",
        ratingCount: 0,
        createdAt: new Date(post.date),
        updatedAt: new Date(post.date)
      };
      
      res.status(200).json(gallery);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Export as CommonJS module
module.exports = handler;
module.exports.default = handler;