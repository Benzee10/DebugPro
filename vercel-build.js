// Build script to prepare data for Vercel deployment
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadPostsFromMarkdown() {
  const dataDir = path.join(__dirname, 'data');
  const posts = [];
  const models = new Set();
  const categories = new Set();
  const tags = new Set();

  function processDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          processDirectory(fullPath);
        } else if (item.isFile() && item.name.endsWith('.md')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const { data: frontmatter, content: bodyContent } = matter(content);
          
          const relativePath = path.relative(dataDir, fullPath);
          const pathParts = relativePath.split(path.sep);
          const modelFolder = pathParts[0];
          const fileName = path.basename(item.name, '.md');
          
          const post = {
            id: `${modelFolder}/${fileName}`,
            title: frontmatter.title || `${modelFolder} Gallery`,
            description: frontmatter.description || `Gallery featuring ${modelFolder}`,
            slug: `${modelFolder}/${fileName}`,
            model: frontmatter.model || modelFolder,
            category: frontmatter.category || 'Gallery',
            cover: frontmatter.cover || (frontmatter.images?.[0]?.src || frontmatter.images?.[0]),
            images: frontmatter.images || [],
            date: frontmatter.date || new Date().toISOString(),
            tags: frontmatter.tags || []
          };
          
          posts.push(post);
          models.add(post.model);
          categories.add(post.category);
          
          if (post.tags) {
            post.tags.forEach(tag => tags.add(tag));
          }
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${dirPath}:`, error);
    }
  }

  processDirectory(dataDir);
  
  return {
    posts,
    models: Array.from(models).map(name => ({ name, slug: name })),
    categories: Array.from(categories),
    tags: Array.from(tags)
  };
}

// Generate the gallery data
console.log('Building gallery data for Vercel deployment...');
const galleryData = loadPostsFromMarkdown();
console.log(`Loaded ${galleryData.posts.length} posts`);

// Write to api directory
const apiDir = path.join(__dirname, 'api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

fs.writeFileSync(
  path.join(apiDir, 'gallery-data.json'),
  JSON.stringify(galleryData, null, 2)
);

console.log('Gallery data built successfully for Vercel deployment!');