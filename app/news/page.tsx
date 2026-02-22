"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Calendar, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface MediaItem {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  date: string;
  description_en: string | null;
  description_ka: string | null;
  imageUrl: string | null;
}

export default function NewsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMediaItems() {
      try {
        setLoading(true);
        const mediaResponse = await fetch("/api/media");

        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
          if (Array.isArray(mediaData)) {
            setMediaItems(mediaData);
          } else {
            console.error("Media items response is not an array");
            setMediaItems([]);
          }
        } else {
          console.error("Failed to fetch media items:", mediaResponse.status);
          setMediaItems([]);
        }
      } catch (error) {
        console.error("Error fetching media items:", error);
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMediaItems();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString(language === "en" ? "en-US" : "ka-GE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
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
      {/* Back Button */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "en" ? "Back" : "უკან"}
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {t.news.headerTitle[language]}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 py-16">
        {mediaItems.length > 0 ? (
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow flex flex-col overflow-hidden py-0"
                >
                  {item.imageUrl && (
                    <div className="p-3">
                      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg">
                        <Image
                          src={item.imageUrl}
                          alt={language === "en" ? item.title_en : item.title_ka}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  )}

                  <CardHeader className={item.imageUrl ? "pt-0" : ""}>
                    <CardTitle className="text-lg mb-2 line-clamp-2 text-balance">
                      {language === "en" ? item.title_en : item.title_ka}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  { (language === "en" ? item.description_en : item.description_ka) && (
                    <div className="px-6 pb-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {language === "en" ? item.description_en : item.description_ka}
                      </p>
                    </div>
                  )}

                  <CardContent className="mt-auto space-y-2 pt-4 pb-4">
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
              {language === "en"
                ? "No news available at the moment."
                : "ამჟამად სიახლეები არ არის ხელმისაწვდომი."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
