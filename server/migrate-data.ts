import { db } from './db';
import { galleries } from '@shared/schema';
import { loadGalleryPostsFromMarkdown } from './markdown-loader';
import { eq } from 'drizzle-orm';

export async function migrateGalleryData() {
  console.log('Starting gallery data migration...');
  
  try {
    // Load existing posts from markdown
    const posts = await loadGalleryPostsFromMarkdown();
    console.log(`Found ${posts.length} posts to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const post of posts) {
      try {
        // Check if gallery already exists
        const [existing] = await db.select({ id: galleries.id })
          .from(galleries)
          .where(eq(galleries.slug, post.slug));
        
        if (existing) {
          skippedCount++;
          continue;
        }
        
        // Insert gallery into database
        await db.insert(galleries).values({
          title: post.title,
          description: post.description,
          slug: post.slug,
          model: post.model,
          category: post.category,
          cover: post.cover,
          images: post.images as any,
          tags: post.tags,
          publishedAt: new Date(post.date),
        });
        
        migratedCount++;
        
        if (migratedCount % 10 === 0) {
          console.log(`Migrated ${migratedCount} galleries...`);
        }
      } catch (error) {
        console.error(`Error migrating gallery ${post.slug}:`, error);
      }
    }
    
    console.log(`Migration complete! Migrated: ${migratedCount}, Skipped: ${skippedCount}`);
    return { migratedCount, skippedCount };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateGalleryData()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}