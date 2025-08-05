import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { GalleryPost } from '../shared/schema';

export async function loadGalleryPostsFromMarkdown(): Promise<GalleryPost[]> {
  const posts: GalleryPost[] = [];
  const dataDir = path.join(process.cwd(), 'data');
  
  try {
    // Check if data directory exists
    if (!fs.existsSync(dataDir)) {
      console.log('Data directory not found:', dataDir);
      return posts;
    }

    // Read all model directories
    const modelDirs = fs.readdirSync(dataDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const modelDirName of modelDirs) {
      const modelDir = path.join(dataDir, modelDirName);
      const modelSlug = modelDirName.toLowerCase().replace(/\s+/g, '-');
      
      // First check for new structure: gallery subdirectories with index.md
      const items = fs.readdirSync(modelDir, { withFileTypes: true });
      
      // Check for gallery subdirectories
      const galleryDirs = items.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
      for (const gallerySlug of galleryDirs) {
        const galleryDir = path.join(modelDir, gallerySlug);
        const indexFile = path.join(galleryDir, 'index.md');
        
        if (fs.existsSync(indexFile)) {
          const post = await loadPostFromFile(indexFile, `${modelSlug}/${gallerySlug}`, modelSlug);
          if (post) posts.push(post);
        }
      }
      
      // Also check for direct markdown files (old structure)
      const markdownFiles = items.filter(dirent => dirent.isFile() && dirent.name.endsWith('.md')).map(dirent => dirent.name);
      for (const fileName of markdownFiles) {
        const filePath = path.join(modelDir, fileName);
        const fileNameWithoutExt = fileName.replace('.md', '');
        const gallerySlug = fileNameWithoutExt.toLowerCase().replace(/\s+/g, '-');
        
        const post = await loadPostFromFile(filePath, `${modelSlug}/${gallerySlug}`, modelSlug);
        if (post) posts.push(post);
      }
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Loaded ${posts.length} posts from markdown files`);
    return posts;
  } catch (error) {
    console.error('Error loading gallery posts:', error);
    return posts;
  }
}

async function loadPostFromFile(filePath: string, slug: string, modelSlug: string): Promise<GalleryPost | null> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
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

    // Handle different date formats and field names
    let dateValue = frontmatter.date || frontmatter.published;
    if (dateValue && typeof dateValue === 'string' && !dateValue.includes('T')) {
      // If date doesn't include time, add default time
      dateValue = `${dateValue}T10:00:00`;
    } else if (dateValue && typeof dateValue !== 'string') {
      // Handle Date objects or numbers
      dateValue = new Date(dateValue).toISOString();
    }

    // Create gallery post object
    const post: GalleryPost = {
      slug,
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      date: dateValue || new Date().toISOString(),
      tags: frontmatter.tags || [],
      model: frontmatter.model || modelSlug,
      category: frontmatter.category || '',
      cover: frontmatter.cover || frontmatter.image || (images[0]?.src || ''),
      images
    };

    console.log(`Loaded post: ${post.slug}`);
    return post;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

export async function loadGalleryData() {
  const posts = await loadGalleryPostsFromMarkdown();
  
  // Extract unique categories and tags
  const categoriesSet = new Set(posts.map(post => post.category).filter(Boolean));
  const tagsSet = new Set(posts.flatMap(post => post.tags));
  const categories = Array.from(categoriesSet);
  const tags = Array.from(tagsSet);
  
  // Create model data (for now, just Mila Azul)
  const models = [{
    name: "Mila Azul",
    slug: "mila-azul",
    avatar: posts.find(p => p.model === "mila-azul")?.cover || "",
    bio: "Stunning Ukrainian model featured in exclusive Metart, Ultra Films, and Wow Girls productions.",
    galleryCount: posts.filter(p => p.model === "mila-azul").length,
    totalLikes: 892,
    joinDate: "2024-01-15"
  }];

  return {
    posts,
    models,
    categories,
    tags
  };
}