"use client";

import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Mountain,
  Building2,
  Landmark as LandmarkIcon,
  TreePine,
  Church,
  Castle,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// Icon mapping for landmarks
const iconMap: Record<string, any> = {
  "map-pin": MapPin,
  navigation: Navigation,
  mountain: Mountain,
  building: Building2,
  landmark: LandmarkIcon,
  tree: TreePine,
  church: Church,
  castle: Castle,
};

interface Landmark {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  location_ka?: string;
  location_en?: string;
  date: string;
  icon?: string;
  color?: string;
  headerImage: string | null;
}

export default function LandmarksPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);

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
      return "N/A";
    }
  };

  useEffect(() => {
    async function fetchLandmarks() {
      try {
        const response = await fetch("/api/landmarks");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setLandmarks(data);
          } else {
            setLandmarks([]);
          }
        } else {
          setLandmarks([]);
        }
      } catch (error) {
        setLandmarks([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLandmarks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading landmarks...</div>
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
            {t.common.back[language]}
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <LandmarkIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {language === "en" ? "Landmarks" : "ღირსშესანიშნაობები"}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {language === "en" 
              ? "Explore significant environmental and cultural landmarks in our region"
              : "გაეცანით მნიშვნელოვან გარემოს და კულტურულ ღირსშესანიშნაობებს ჩვენს რეგიონში"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-2 py-16">
        {landmarks.length === 0 ? (
          <div className="text-center py-16">
            <LandmarkIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {language === "en"
                ? "No landmarks available at the moment."
                : "ამჟამად ღირსშესანიშნაობები არ არის ხელმისაწვდომი."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landmarks.map((landmark) => (
              <Card
                key={landmark.id}
                className="hover:shadow-lg transition-shadow flex flex-col overflow-hidden py-0"
              >
                {landmark.headerImage && (
                  <div className="p-3">
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg">
                      <img
                        src={landmark.headerImage}
                        alt={language === "en" ? landmark.title_en : landmark.title_ka}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                )}

                <CardHeader className={landmark.headerImage ? "pt-0" : ""}>
                  <CardTitle className="text-lg mb-2 line-clamp-2 text-balance">
                    {language === "en" ? landmark.title_en : landmark.title_ka}
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="h-3 w-3" />
                      <span>{language === "en" ? (landmark.location_en || "Location not specified") : (landmark.location_ka || "მდებარეობა არ არის მითითებული")}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                {(language === "en" ? landmark.description_en : landmark.description_ka) && (
                  <div className="px-6 pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {language === "en" ? landmark.description_en : landmark.description_ka}
                    </p>
                  </div>
                )}

                <CardContent className="mt-auto space-y-2 pt-4 pb-4">
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/landmarks/${landmark.slug}`}>
                      {language === "en" ? "Learn More" : "ვრცლად"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
