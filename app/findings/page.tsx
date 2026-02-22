"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Search,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Resource {
  id: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  date: string;
  pages: number | null;
  fileUrl: string | null;
}

interface MediaItem {
  id: string;
  title_en: string;
  title_ka: string;
  description_en: string | null;
  description_ka: string | null;
  date: string;
  type: string | null;
  imageUrl: string | null;
}

export default function FindingsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch resources
        const resourcesResponse = await fetch("/api/resources");

        // Fetch media items
        const mediaResponse = await fetch("/api/media");

        if (resourcesResponse.ok) {
          const resourcesData = await resourcesResponse.json();
          if (Array.isArray(resourcesData)) {
            setResources(resourcesData);
          } else {
            console.error("Resources response is not an array");
            setResources([]);
          }
        } else {
          console.error("Failed to fetch resources:", resourcesResponse.status);
          setResources([]);
        }

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
        console.error("Error fetching data:", error);
        setResources([]);
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log("search query: ", JSON.stringify(searchQuery));
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  // Filter resources based on search query
  const filteredResources = resources.filter((resource) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();

    return (
      resource?.title_en?.toLowerCase().includes(query) ||
      resource?.title_ka?.toLowerCase().includes(query) ||
      resource?.description_en?.toLowerCase().includes(query) ||
      resource?.description_ka?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading findings...</div>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.findings.headerTitle[language]}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                language === "en"
                  ? "Search resources..."
                  : "ძიება რესურსებში..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="hover:shadow-lg transition-shadow flex flex-col"
              >
                <CardHeader>
                  <div className="w-full h-48 bg-slate-100 rounded-md mb-4 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <CardTitle className="text-lg text-balance">
                      {language === "en" ? resource.title_en : resource.title_ka}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(resource.date)}</span>
                    </div>
                  </div>
                  <CardDescription className="leading-relaxed line-clamp-3">
                    {language === "en" ? resource.description_en : resource.description_ka}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex gap-2">
                    {resource.fileUrl && (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={resource.fileUrl} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          {t.findings.download[language]}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {language === "en"
                  ? "No resources found matching your search."
                  : "თქვენს ძიებას არ შეესაბამება არცერთი რესურსი."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
