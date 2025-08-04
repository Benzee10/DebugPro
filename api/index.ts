import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import gallery data and SEO functions
import { galleryData } from '../client/src/lib/gallery-data';

// Simple SEO generation functions (inline to avoid import issues)
function generateSimpleSitemap(baseUrl: string): string {
  const posts = galleryData?.posts || [];
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

function generateSimpleRSS(baseUrl: string): string {
  const posts = galleryData?.posts || [];
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
export default function handler(req: VercelRequest, res: VercelResponse) {
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
      res.status(200).json(galleryData?.posts || []);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}