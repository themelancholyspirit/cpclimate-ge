"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Target } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface ContentSection {
  type: "text" | "image";
  content: string;
}

interface Project {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  content_en?: string;
  content_ka?: string;
  status: string;
  duration: string;
  icon: string;
  color: string;
  goals_en?: string[];
  goals_ka?: string[];
  headerImage?: string;
  contentSections?: ContentSection[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProject();
    }
  }, [slug]);

  // Helper function to check if content is HTML
  const isHTMLContent = (content: string): boolean => {
    return /<[a-z][\s\S]*>/i.test(content);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
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
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.projects.headerTitle[language]}
            </Link>
          </Button>
        </div>
      </div>

      {/* Header Image */}
      {project.headerImage && (
        <div className="relative w-full h-[400px] lg:h-[500px]">
          <Image
            src={project.headerImage}
            alt={language === "en" ? project.title_en : project.title_ka}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Project Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                variant={project.status === "Active" ? "default" : "secondary"}
                className={
                  project.status === "Active" ? "bg-green-600" : ""
                }
              >
                {project.status}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{project.duration}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance break-words">
              {language === "en" ? project.title_en : project.title_ka}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed break-words">
              {language === "en" ? project.description_en : project.description_ka}
            </p>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto overflow-hidden">


          {/* Main Content with Sections */}
          {project.contentSections && project.contentSections.length > 0 ? (
            <div className="space-y-8">
              {project.contentSections.map((section, index) => {
                if (section.type === "image") {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-[400px] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={section.content}
                        alt={`Project image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="prose prose-slate dark:prose-invert max-w-none break-words
                        [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-2
                        [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                        [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4
                        [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4
                        [&_strong]:font-semibold [&_em]:italic
                        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                        [&_li]:mb-1
                        [&_a]:text-primary [&_a]:underline hover:[&_a]:no-underline
                        [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
                        [&>*]:mb-4"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  );
                }
              })}
            </div>
          ) : (
            // Fallback: Render content directly (supports HTML from Directus rich text editor)
            (language === "en" ? project.content_en : project.content_ka) && (
              <div
                className="prose prose-slate dark:prose-invert max-w-none break-words
                  [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-2
                  [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                  [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4
                  [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4
                  [&_strong]:font-semibold [&_em]:italic
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                  [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                  [&_li]:mb-1
                  [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-4 [&_img]:w-full [&_img]:h-auto
                  [&_a]:text-primary [&_a]:underline hover:[&_a]:no-underline
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
                  [&>*]:mb-4"
                dangerouslySetInnerHTML={{ __html: language === "en" ? project.content_en! : project.content_ka! }}
              />
            )
          )}

        </div>
      </div>
    </div>
  );
}
