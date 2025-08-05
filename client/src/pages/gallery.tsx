import { useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { Lightbox } from "@/components/gallery/lightbox";
import { AdBanner } from "@/components/ads/ad-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, Images, Heart } from "lucide-react";
import { Link } from "wouter";
import { fetchGalleryPost } from "@/lib/api-client";
import { updatePageMeta } from "@/lib/seo";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export default function GalleryPage() {
  const params = useParams();
  const slug = params["*"] || "";
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Load post data
  useEffect(() => {
    fetchGalleryPost(slug).then(postData => {
      setPost(postData);
      setLoading(false);
    });
  }, [slug]);

  // Update SEO meta tags
  useEffect(() => {
    if (post) {
      updatePageMeta(post);
    }
    return () => {
      updatePageMeta(); // Reset to default when component unmounts
    };
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Gallery not found</h1>
          <Link href="/">
            <Button>Return to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy 'at' h:mm a") : format(new Date(), "MMMM d, yyyy 'at' h:mm a");
  
  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    if (selectedImageIndex < post.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const previousImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Gallery
            </Button>
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span className="capitalize">{post.model}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Images size={16} />
              <span>{post.images.length} photos</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={16} />
              <span>{Math.floor(Math.random() * 50) + 10}</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {post.description}
          </p>

          <div className="flex items-center gap-4">
            <Badge className="bg-primary text-primary-foreground">
              {post.category}
            </Badge>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  <Tag size={12} />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        {/* Top Ad */}
        <AdBanner position="top" />

        {/* Gallery Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p>See Full Pictures Here 👉🏼</p>
          <p>{post.description}</p>
        </div>

        {/* Image Gallery - First Half */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {post.images.slice(0, Math.ceil(post.images.length / 2)).map((image: any, index: number) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Images className="text-white" size={24} />
                </div>
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Middle Ad */}
        <AdBanner position="middle" />

        {/* Image Gallery - Second Half */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {post.images.slice(Math.ceil(post.images.length / 2)).map((image: any, index: number) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(index + Math.ceil(post.images.length / 2))}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Images className="text-white" size={24} />
                </div>
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Ad */}
        <AdBanner position="bottom" />

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link href="/">
            <Button variant="outline">← More Galleries</Button>
          </Link>
          <Link href={`/model/${post.model}`}>
            <Button>View More from {post.model === "mila-azul" ? "Mila Azul" : post.model} →</Button>
          </Link>
        </div>
      </article>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          isOpen={lightboxOpen}
          images={post.images}
          currentIndex={selectedImageIndex}
          title={post.title}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      )}
    </div>
  );
}
