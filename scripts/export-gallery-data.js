// Script to export gallery data for Vercel deployment
import { loadGalleryData } from '../server/markdown-loader.ts';
import fs from 'fs';
import path from 'path';

async function exportGalleryData() {
  try {
    console.log('Loading gallery data...');
    const galleryData = await loadGalleryData();
    
    const outputPath = path.join(process.cwd(), 'api', 'gallery-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(galleryData, null, 2));
    
    console.log(`Exported ${galleryData.posts.length} posts to ${outputPath}`);
    console.log(`Models: ${galleryData.models.length}`);
    console.log(`Categories: ${galleryData.categories.length}`);
    console.log(`Tags: ${galleryData.tags.length}`);
  } catch (error) {
    console.error('Failed to export gallery data:', error);
  }
}

exportGalleryData();