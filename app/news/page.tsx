"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Calendar,
  ExternalLink,
  Mic,
  FileText,
  Radio,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface MediaItem {
  id: string;
  slug: string;
  title: string;
  outlet: string;
  date: string;
  type: string;
  url: string | null;
  description: string | null;
  imageUrl: string | null;
}

export default function NewsPage() {
  const { t, language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMediaItems() {
      try {
        setLoading(true);
        const mediaResponse = await fetch("/api/media");

        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          setMediaItems(mediaData);
        }
      } catch (error) {
        console.error("Error fetching media items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMediaItems();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "en" ? "en-US" : "ka-GE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "interview":
        return <Mic className="h-5 w-5" />;
      case "article":
        return <FileText className="h-5 w-5" />;
      case "feature":
        return <Radio className="h-5 w-5" />;
      default:
        return <Newspaper className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "interview":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "article":
        return "bg-green-100 text-green-800 border-green-200";
      case "feature":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {t.news.headerTitle[language]}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t.news.headerDesc[language]}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {mediaItems.length > 0 ? (
          <div className="mb-16">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow flex flex-col overflow-hidden"
                >
                  <CardHeader>
                    <CardTitle className="text-lg mb-2 line-clamp-2 text-balance">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  {item.imageUrl && (
                    <div className="relative w-full h-48 px-6">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  {item.description && (
                    <div className="px-6 py-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  )}
                  
                  <CardContent className="mt-auto space-y-2 pt-4">
                    <Button size="sm" className="w-full" asChild>
                      <a href={`/news/${item.slug}`}>
                        {t.news.readMore?.[language] || "Read More"}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {t.news.noNews[language]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
