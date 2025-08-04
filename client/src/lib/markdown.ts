import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import matter from 'gray-matter';
import type { GalleryPost } from '@shared/schema';

export interface ParsedMarkdown {
  frontmatter: Record<string, any>;
  content: string;
  html: string;
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

export async function parseMarkdown(markdownContent: string): Promise<ParsedMarkdown> {
  const { data: frontmatter, content } = matter(markdownContent);
  
  // Process markdown to HTML
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify);
    
  const html = String(await processor.process(content));
  
  // Extract images from markdown content
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: Array<{ src: string; alt: string; caption?: string }> = [];
  
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    images.push({
      src: match[2],
      alt: match[1] || '',
      caption: match[1] || undefined
    });
  }
  
  return {
    frontmatter,
    content,
    html,
    images
  };
}

export function createGalleryPostFromMarkdown(
  markdownContent: string, 
  slug: string
): Promise<GalleryPost> {
  return parseMarkdown(markdownContent).then(parsed => ({
    title: parsed.frontmatter.title || '',
    description: parsed.frontmatter.description || '',
    date: parsed.frontmatter.date || new Date().toISOString(),
    tags: parsed.frontmatter.tags || [],
    model: parsed.frontmatter.model || '',
    category: parsed.frontmatter.category || '',
    cover: parsed.frontmatter.cover || (parsed.images[0]?.src || ''),
    slug,
    images: parsed.images
  }));
}
