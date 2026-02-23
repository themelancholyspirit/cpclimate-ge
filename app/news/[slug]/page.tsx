"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface NewsArticle {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  date: string;
  description_en?: string;
  description_ka?: string;
  content_en?: string;
  content_ka?: string;
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
    if (content.includes("<")) {
      return null; // Will use dangerouslySetInnerHTML instead
    }

    const sections: Array<{ type: "text" | "image"; content: string }> = [];

    // Match both plain URLs and markdown image syntax
    const imageUrlRegex =
      /!\[.*?\]\((https?:\/\/[^\s)]+\/assets\/[a-f0-9-]+)\)|(https?:\/\/[^\s]+\/assets\/[a-f0-9-]+)/gi;

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
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.news?.headerTitle?.[language] || "News"}
          </Link>
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-balance break-words leading-tight">
            {language === "en" ? article.title_en : article.title_ka}
          </h1>

          {/* Header Image */}
          {article.imageUrl && (
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-6">
              <Image
                src={article.imageUrl}
                alt={language === "en" ? article.title_en : article.title_ka}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                {new Date(article.date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description - Lead/Intro Section */}
          {(language === "en"
            ? article.description_en
            : article.description_ka) && (
            <div className="mb-10">
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground break-words whitespace-pre-wrap">
                {language === "en"
                  ? article.description_en
                  : article.description_ka}
              </p>
            </div>
          )}

          {/* Content Divider */}
          {(language === "en" ? article.content_en : article.content_ka) && (
            <Separator className="mb-8" />
          )}

          {/* Article Content */}
          {(language === "en" ? article.content_en : article.content_ka) ? (
            <>
              {parseContent(
                language === "en" ? article.content_en! : article.content_ka!,
              ) ? (
                // Parse and render sections if content has mixed text/images
                <div className="space-y-6">
                  {parseContent(
                    language === "en"
                      ? article.content_en!
                      : article.content_ka!,
                  )!.map((section, index) => {
                    if (section.type === "image") {
                      return (
                        <div
                          key={index}
                          className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden my-8"
                        >
                          <Image
                            src={section.content}
                            alt={`Article image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={index}
                          className="prose prose-lg max-w-none break-words
                            [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8
                            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
                            [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-foreground/80 [&_p]:break-words [&_p]:whitespace-pre-wrap
                            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
                            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2
                            [&_li]:text-base [&_li]:leading-relaxed [&_li]:break-words
                            [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_a]:break-words
                            [&_strong]:font-semibold [&_strong]:text-foreground
                            [&_em]:italic
                            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground [&_blockquote]:break-words
                            [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:break-words
                            [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6"
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {section.content}
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                // Render as HTML if content contains HTML tags
                <div
                  className="prose prose-lg max-w-none break-words
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
                    [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-foreground/80 [&_p]:break-words [&_p]:overflow-wrap-anywhere
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2
                    [&_li]:text-base [&_li]:leading-relaxed [&_li]:break-words
                    [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_a]:break-all
                    [&_strong]:font-semibold [&_strong]:text-foreground
                    [&_em]:italic
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground [&_blockquote]:break-words
                    [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:w-full [&_img]:h-auto [&_img]:max-w-full
                    [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:break-words
                    [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6"
                  dangerouslySetInnerHTML={{
                    __html:
                      language === "en"
                        ? article.content_en!
                        : article.content_ka!,
                  }}
                />
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground mt-8">
              <p>No content available for this article.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
