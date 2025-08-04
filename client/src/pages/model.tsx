import { useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Heart, Images } from "lucide-react";
import { Link } from "wouter";
import { getModel, getModelPosts } from "@/lib/gallery-data";
import { format } from "date-fns";

export default function ModelPage() {
  const params = useParams();
  const modelSlug = params.slug!;
  const model = getModel(modelSlug);
  const posts = getModelPosts(modelSlug);

  if (!model) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Model not found</h1>
          <Link href="/">
            <Button>Return to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const joinDate = format(new Date(model.joinDate), "MMMM yyyy");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Gallery
            </Button>
          </Link>
        </div>

        {/* Model Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
              <img
                src={model.avatar}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {model.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {model.bio}
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Images size={16} />
                  <span>{model.galleryCount} galleries</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>{model.totalLikes} total likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model's Galleries */}
        <GalleryGrid
          posts={posts}
          title={`${model.name}'s Galleries`}
          description={`Explore ${model.name}'s complete photography portfolio`}
        />
      </div>
    </div>
  );
}
