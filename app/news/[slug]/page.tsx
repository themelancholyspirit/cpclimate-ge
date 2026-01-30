"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  description?: string;
  content?: string;
  imageUrl?: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/media/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching news article:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to News
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.news?.headerTitle?.[language] || "News"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Header Image */}
      {article.imageUrl && (
        <div className="relative w-full h-[400px] lg:h-[500px]">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Article Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance break-words">
              {article.title}
            </h1>
            {article.description && (
              <p className="text-lg text-muted-foreground leading-relaxed break-words">
                {article.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto overflow-hidden">
          {article.content ? (
            <div 
              className="prose prose-slate dark:prose-invert prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:mb-4
                prose-h2:text-3xl prose-h2:mb-3
                prose-h3:text-2xl prose-h3:mb-2
                prose-p:text-lg prose-p:leading-relaxed prose-p:mb-4
                prose-strong:font-semibold prose-em:italic
                prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6
                prose-li:mb-2
                prose-img:rounded-lg prose-img:shadow-md prose-img:my-8
                prose-a:text-primary prose-a:underline hover:prose-a:no-underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No content available for this article.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
