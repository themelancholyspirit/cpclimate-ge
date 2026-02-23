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
  Droplet,
  Users,
  Shield,
  Target,
  TrendingUp,
  Calendar,
  Waves,
  TreeDeciduous,
  Leaf,
  Recycle,
  Factory,
  Microscope,
  BarChart3,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// Icon mapping - maps Directus icon values to Lucide React components
const iconMap: Record<string, any> = {
  "water-drop": Droplet,
  waves: Waves,
  river: TreeDeciduous,
  leaf: Leaf,
  recycle: Recycle,
  factory: Factory,
  science: Microscope,
  chart: BarChart3,
  globe: Globe,
  shield: Shield,
  // Legacy support for old values (string keys, not component values)
  Users: Users,
  Droplet: Droplet,
  Shield: Shield,
  Target: Target,
};

interface Project {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  status: string;
  duration: string;
  icon: string;
  color: string;
  goals: string[];
}

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setProjects(data);
          } else {
            setProjects([]);
          }
        } else {
          setProjects([]);
        }
      } catch (error) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading projects...</div>
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
            {t.projects.headerTitle[language]}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Active Projects */}
        <div className="mb-16">
          {projects.length === 0 && (
            <div className="text-muted-foreground">
              {language === "en"
                ? "No projects available at the moment."
                : "ამჟამად პროექტები არ არის ხელმისაწვდომი."}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const IconComponent =
                (project?.icon && iconMap[project.icon]) || Target;
              return (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  <CardHeader className="flex-grow pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: project.color }}
                      >
                        <IconComponent
                          className="h-5 w-5"
                          style={{ color: "white" }}
                        />
                      </div>
                      <Badge variant="default" className="bg-green-600 text-xs">
                        {project.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-1.5 text-balance">
                      {language === "en" ? project.title_en : project.title_ka}
                    </CardTitle>
                    <CardDescription className="leading-relaxed line-clamp-2 text-sm">
                      {language === "en"
                        ? project.description_en
                        : project.description_ka}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{project.duration}</span>
                    </div>
                    <Button asChild className="w-full h-9 text-sm">
                      <Link href={`/projects/${project.slug}`}>
                        {t.projects.viewDetails[language]}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
