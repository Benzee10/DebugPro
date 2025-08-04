import type { GalleryPost, Model, GalleryData } from '@shared/schema';

// Sample data that follows the markdown structure
export const sampleGalleryPosts: GalleryPost[] = [
  {
    slug: "mila/summer-bliss",
    title: "Summer Bliss",
    description: "Soft golden hour set showcasing natural beauty in warm evening light",
    date: "2025-08-04T10:00:00",
    tags: ["sunset", "outdoors", "golden-hour"],
    model: "mila",
    category: "Nature",
    cover: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
    images: [
      {
        src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
        alt: "Golden hour portrait 1",
        caption: "Soft natural lighting"
      },
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=900",
        alt: "Golden hour portrait 2",
        caption: "Evening glow"
      },
      {
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1100",
        alt: "Golden hour portrait 3",
        caption: "Natural beauty"
      }
    ]
  },
  {
    slug: "lena/golden-dreams",
    title: "Golden Dreams",
    description: "Ethereal studio session with dramatic lighting and dreamy atmosphere",
    date: "2025-07-28T14:30:00",
    tags: ["studio", "portrait", "dramatic"],
    model: "lena",
    category: "Portrait",
    cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
    images: [
      {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
        alt: "Studio portrait 1",
        caption: "Dramatic lighting"
      },
      {
        src: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1100",
        alt: "Studio portrait 2",
        caption: "Ethereal mood"
      }
    ]
  },
  {
    slug: "mila/wild-flower",
    title: "Wild Flower",
    description: "Natural beauty captured among vibrant wildflowers in meadow setting",
    date: "2025-07-15T09:15:00",
    tags: ["flowers", "meadow", "natural"],
    model: "mila",
    category: "Nature",
    cover: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=900",
    images: [
      {
        src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=900",
        alt: "Wildflower portrait 1",
        caption: "Among the flowers"
      }
    ]
  },
  {
    slug: "sofia/urban-elegance",
    title: "Urban Elegance",
    description: "Sophisticated city shoot blending modern architecture with timeless elegance",
    date: "2025-07-10T16:00:00",
    tags: ["urban", "fashion", "architecture"],
    model: "sofia",
    category: "Fashion",
    cover: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1100",
    images: [
      {
        src: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1100",
        alt: "Urban portrait 1",
        caption: "City elegance"
      }
    ]
  },
  {
    slug: "lena/autumn-mood",
    title: "Autumn Mood",
    description: "Capturing the warmth and beauty of fall season with rich golden tones",
    date: "2025-10-12T11:30:00",
    tags: ["autumn", "warm", "seasonal"],
    model: "lena",
    category: "Nature",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
    images: [
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
        alt: "Autumn portrait 1",
        caption: "Fall colors"
      }
    ]
  },
  {
    slug: "mila/midnight-blue",
    title: "Midnight Blue",
    description: "Dramatic blue hour session with deep moods and cinematic lighting",
    date: "2025-09-22T20:00:00",
    tags: ["night", "dramatic", "cinematic"],
    model: "mila",
    category: "Portrait",
    cover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
    images: [
      {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1200",
        alt: "Night portrait 1",
        caption: "Blue hour mood"
      }
    ]
  }
];

export const sampleModels: Model[] = [
  {
    name: "Mila",
    slug: "mila",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    bio: "Professional model specializing in natural light photography and outdoor sessions.",
    galleryCount: 8,
    totalLikes: 156,
    joinDate: "2024-01-15"
  },
  {
    name: "Lena",
    slug: "lena",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    bio: "Studio and portrait specialist with expertise in dramatic lighting and artistic compositions.",
    galleryCount: 6,
    totalLikes: 123,
    joinDate: "2024-02-20"
  },
  {
    name: "Sofia",
    slug: "sofia",
    avatar: "https://images.unsplash.com/photo-1617922001439-4a2e6562f328?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    bio: "Fashion and urban photography model with a focus on contemporary styling.",
    galleryCount: 4,
    totalLikes: 89,
    joinDate: "2024-03-10"
  }
];

export const galleryData: GalleryData = {
  posts: sampleGalleryPosts,
  models: sampleModels,
  categories: ["Nature", "Portrait", "Fashion", "Studio"],
  tags: ["sunset", "outdoors", "golden-hour", "studio", "portrait", "dramatic", "flowers", "meadow", "natural", "urban", "fashion", "architecture", "autumn", "warm", "seasonal", "night", "cinematic"]
};

export function getGalleryPost(slug: string): GalleryPost | undefined {
  return sampleGalleryPosts.find(post => post.slug === slug);
}

export function getModel(slug: string): Model | undefined {
  return sampleModels.find(model => model.slug === slug);
}

export function getModelPosts(modelSlug: string): GalleryPost[] {
  return sampleGalleryPosts.filter(post => post.model === modelSlug);
}

export function getCategoryPosts(category: string): GalleryPost[] {
  return sampleGalleryPosts.filter(post => post.category === category);
}
