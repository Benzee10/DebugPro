import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { updatePageMeta } from "@/lib/seo";
import { fetchGalleryData } from "@/lib/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Images, Calendar, Heart } from "lucide-react";
import type { GalleryData, Model, GalleryPost } from "@shared/schema";

export default function ModelsPage() {
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryData().then(data => {
      setGalleryData(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to fetch gallery data:', error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    updatePageMeta();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-300 rounded w-64 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!galleryData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Failed to load models</h1>
          <p className="text-gray-600 dark:text-gray-400">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Calculate stats for each model
  const modelsWithStats = galleryData.models.map(model => {
    const modelPosts = galleryData.posts.filter(post => post.model === model.slug);
    const totalLikes = modelPosts.length * 150; // Estimated likes per post
    const latestPost = modelPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    return {
      ...model,
      postCount: modelPosts.length,
      totalLikes,
      latestPostDate: latestPost?.date,
    };
  }).sort((a, b) => b.postCount - a.postCount); // Sort by post count (most active first)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Featured Models
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our collection of {galleryData.models.length} talented models featured in {galleryData.posts.length} stunning photo galleries.
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modelsWithStats.map((model) => (
            <Link key={model.slug} href={`/model/${model.slug}`} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group-hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage 
                        src={model.avatar} 
                        alt={model.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {model.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {model.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {model.postCount} {model.postCount === 1 ? 'gallery' : 'galleries'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Images size={14} />
                      <span>{model.postCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      <span>{model.totalLikes}</span>
                    </div>
                    {model.latestPostDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(model.latestPostDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {model.bio && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {model.bio}
                    </p>
                  )}

                  {/* Categories/Tags */}
                  <div className="flex flex-wrap gap-1">
                    {galleryData.posts
                      .filter(post => post.model === model.slug)
                      .map(post => post.category)
                      .filter((cat, idx, arr) => arr.indexOf(cat) === idx) // unique categories
                      .slice(0, 3)
                      .map(category => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {modelsWithStats.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No models found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new model additions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}