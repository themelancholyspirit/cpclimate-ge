"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Landmark {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  content_en?: string;
  content_ka?: string;
  location?: string;
  lat?: number;
  lng?: number;
  icon?: string;
  color?: string;
  headerImage?: string;
}

export default function LandmarkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [landmark, setLandmark] = useState<Landmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t, language } = useLanguage();

  // Helper function to parse content and extract text/image sections
  const parseContent = (content: string) => {
    // If content contains HTML tags, render it as HTML
    if (content.includes('<')) {
      return null; // Will use dangerouslySetInnerHTML instead
    }
    
    const sections: Array<{ type: "text" | "image"; content: string }> = [];
    
    // Match both plain URLs and markdown image syntax
    const imageUrlRegex = /!\[.*?\]\((https?:\/\/[^\s)]+\/assets\/[a-f0-9-]+)\)|(https?:\/\/[^\s]+\/assets\/[a-f0-9-]+)/gi;
    
    let lastIndex = 0;
    let match;
    
    imageUrlRegex.lastIndex = 0;
    
    while ((match = imageUrlRegex.exec(content)) !== null) {
      const textBefore = content.substring(lastIndex, match.index).trim();
      if (textBefore) {
        sections.push({ type: "text", content: textBefore });
      }
      
      const imageUrl = match[1] || match[2];
      if (imageUrl) {
        sections.push({ type: "image", content: imageUrl });
      }
      
      lastIndex = imageUrlRegex.lastIndex;
    }
    
    const remainingText = content.substring(lastIndex).trim();
    if (remainingText) {
      sections.push({ type: "text", content: remainingText });
    }
    
    return sections;
  };

  useEffect(() => {
    async function fetchLandmark() {
      try {
        const response = await fetch(`/api/landmarks/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setLandmark(data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching landmark:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchLandmark();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading landmark...</div>
      </div>
    );
  }

  if (error || !landmark) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {language === "en" ? "Landmark Not Found" : "ღირსშესანიშნაობა ვერ მოიძებნა"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === "en"
                ? "The landmark you're looking for doesn't exist or has been removed."
                : "თქვენ მიერ მოძიებული ღირსშესანიშნაობა არ არსებობს ან წაშლილია."}
            </p>
            <Button asChild>
              <Link href="/landmarks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === "en" ? "Back to Landmarks" : "უკან ღირსშესანიშნაობებზე"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const title = language === "en" ? landmark.title_en : landmark.title_ka;
  const description = language === "en" ? landmark.description_en : landmark.description_ka;
  const content = language === "en" ? landmark.content_en : landmark.content_ka;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.back[language]}
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-balance break-words leading-tight">
            {title}
          </h1>

          {/* Header Image */}
          {landmark.headerImage && (
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-6">
              <img
                src={landmark.headerImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            {/* Location Info */}
            {landmark.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="text-base">{landmark.location}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            {description}
          </div>

          {/* Content */}
          {content && (
            <div
              className="prose prose-lg max-w-none 
                [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
                [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-foreground/80
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2
                [&_li]:text-base [&_li]:leading-relaxed
                [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
                [&_strong]:font-semibold [&_strong]:text-foreground
                [&_em]:italic
                [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground
                [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:w-full [&_img]:h-auto
                [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {/* Map Link */}
          {landmark.lat && landmark.lng && (
            <div className="mt-12 p-6 bg-muted/30 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                {language === "en" ? "Location" : "მდებარეობა"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "en"
                  ? "View this landmark on the map"
                  : "იხილეთ ეს ღირსშესანიშნაობა რუკაზე"}
              </p>
              <Button asChild variant="outline" size="sm">
                <a
                  href={`https://www.google.com/maps?q=${landmark.lat},${landmark.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {language === "en" ? "Open in Google Maps" : "გახსენით Google Maps-ში"}
                </a>
              </Button>
            </div>
          )}

          {/* Back to Landmarks */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button asChild variant="ghost">
              <Link href="/landmarks">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === "en" ? "Back to Landmarks" : "უკან ღირსშესანიშნაობებზე"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
