import { galleryData } from "./gallery-data";
import type { GalleryPost } from "@shared/schema";

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemap(baseUrl: string): string {
  const entries: SitemapEntry[] = [
    {
      url: baseUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    }
  ];

  // Add gallery posts
  galleryData.posts.forEach(post => {
    entries.push({
      url: `${baseUrl}/gallery/${post.slug}`,
      lastmod: new Date(post.date).toISOString(),
      changefreq: 'monthly',
      priority: 0.8
    });
  });

  // Add model pages
  galleryData.models.forEach(model => {
    entries.push({
      url: `${baseUrl}/model/${model.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
}

export function generateRSSFeed(baseUrl: string): string {
  const sortedPosts = [...galleryData.posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20); // Latest 20 posts

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Shiny Dollop - Premium Photo Galleries</title>
    <description>Curated collections featuring Mila Azul from premium studios including Metart, Ultra Films, and Wow Girls</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Shiny Dollop Gallery</generator>
${sortedPosts.map(post => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${baseUrl}/gallery/${post.slug}</link>
      <guid>${baseUrl}/gallery/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${post.category}</category>
      <enclosure url="${post.cover}" type="image/jpeg" length="0"/>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return rssContent;
}

export function generateSitemapIndex(baseUrl: string): string {
  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndexContent;
}

export function updatePageMeta(post?: GalleryPost) {
  if (post) {
    // Update page title
    document.title = `${post.title} - Shiny Dollop`;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', post.description);

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', post.title);
    updateMetaTag('property', 'og:description', post.description);
    updateMetaTag('property', 'og:image', post.cover);
    updateMetaTag('property', 'og:url', `${window.location.origin}/gallery/${post.slug}`);
    updateMetaTag('property', 'og:type', 'article');

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', post.title);
    updateMetaTag('name', 'twitter:description', post.description);
    updateMetaTag('name', 'twitter:image', post.cover);
  } else {
    // Default homepage meta
    document.title = 'Shiny Dollop - Premium Photo Galleries';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Curated collections featuring Mila Azul from premium studios including Metart, Ultra Films, and Wow Girls');
  }
}

function updateMetaTag(attributeName: string, attributeValue: string, content: string) {
  let metaTag = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', content);
}