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
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild size="sm">
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.projects.headerTitle[language]}
          </Link>
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-balance break-words leading-tight">
            {language === "en" ? project.title_en : project.title_ka}
          </h1>

          {/* Header Image */}
          {project.headerImage && (
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden mb-6">
              <Image
                src={project.headerImage}
                alt={language === "en" ? project.title_en : project.title_ka}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            <Badge
              variant={project.status === "Active" ? "default" : "secondary"}
              className="bg-blue-600 text-white text-sm px-4 py-1"
            >
              {
                {
                  Planning: "გეგმაში",
                  "In Progress": "მიმდინარე",
                  Completed: "დასრულებული",
                  Active: "აქტიური",
                }[project.status]
              }
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{project.duration}</span>
            </div>
          </div>

          {/* Description - Lead/Intro Section */}
          <div className="mb-10">
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground break-words whitespace-pre-wrap">
              {language === "en"
                ? project.description_en
                : project.description_ka}
            </p>
          </div>

          {/* Content Divider */}
          {((project.contentSections && project.contentSections.length > 0) || 
            (language === "en" ? project.content_en : project.content_ka)) && (
            <Separator className="mb-8" />
          )}

          {/* Main Content with Sections */}
          {project.contentSections && project.contentSections.length > 0 ? (
            <div className="space-y-6">
              {project.contentSections.map((section, index) => {
                if (section.type === "image") {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden my-8"
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
                      className="prose prose-lg max-w-none break-words
                        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8
                        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                        [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
                        [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-foreground/80 [&_p]:break-words [&_p]:overflow-wrap-anywhere
                        [&_strong]:font-semibold [&_strong]:text-foreground
                        [&_em]:italic
                        [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
                        [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2
                        [&_li]:text-base [&_li]:leading-relaxed [&_li]:break-words
                        [&_a]:text-orange-500 [&_a]:underline hover:[&_a]:text-orange-600 [&_a]:break-all
                        [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground [&_blockquote]:break-words
                        [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:break-words
                        [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  );
                }
              })}
            </div>
          ) : (
            // Fallback: Render content directly
            (language === "en" ? project.content_en : project.content_ka) && (
              <div
                className="prose prose-lg max-w-none break-words
                  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6
                  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
                  [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-foreground/80 [&_p]:break-words [&_p]:overflow-wrap-anywhere
                  [&_strong]:font-semibold [&_strong]:text-foreground
                  [&_em]:italic
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2
                  [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_ol]:space-y-2
                  [&_li]:text-base [&_li]:leading-relaxed [&_li]:break-words
                  [&_img]:rounded-xl [&_img]:shadow-md [&_img]:my-6 [&_img]:w-full [&_img]:h-auto [&_img]:max-w-full
                  [&_a]:text-orange-500 [&_a]:underline hover:[&_a]:text-orange-600 [&_a]:break-all
                  [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-muted-foreground [&_blockquote]:break-words
                  [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:break-words
                  [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6"
                dangerouslySetInnerHTML={{
                  __html:
                    language === "en"
                      ? project.content_en!
                      : project.content_ka!,
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
