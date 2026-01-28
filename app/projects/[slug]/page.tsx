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
  title: string;
  description: string;
  status: string;
  duration: string;
  icon: string;
  color: string;
  goals: string[];
  headerImage?: string;
  content?: string;
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

  // Helper function to parse content and extract text/image sections
  const parseContent = (content: string): ContentSection[] => {
    const sections: ContentSection[] = [];
    const imageUrlRegex = /https?:\/\/[^\s]+\/assets\/[a-f0-9-]+/gi;
    
    // Split content by image URLs while keeping the URLs
    const parts = content.split(imageUrlRegex);
    const imageUrls = content.match(imageUrlRegex) || [];
    
    parts.forEach((textPart, index) => {
      // Add text section if not empty
      const trimmedText = textPart.trim();
      if (trimmedText) {
        sections.push({ type: "text", content: trimmedText });
      }
      
      // Add image section if there's a corresponding URL
      if (imageUrls[index]) {
        sections.push({ type: "image", content: imageUrls[index] });
      }
    });
    
    return sections;
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
            alt={project.title}
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
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed break-words">
              {project.description}
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
                      className="relative w-full h-[400px] rounded-lg overflow-hidden my-8"
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
                      className="prose prose-slate dark:prose-invert max-w-none break-words"
                    >
                      <p className="text-lg leading-relaxed text-muted-foreground break-words whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            // Fallback: Parse content field to extract images and text
            project.content && (
              <div className="space-y-8">
                {parseContent(project.content).map((section, index) => {
                  if (section.type === "image") {
                    return (
                      <div
                        key={index}
                        className="relative w-full h-[400px] rounded-lg overflow-hidden my-8"
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
                    // Check for headings and format accordingly
                    const paragraphs = section.content.split("\n\n");
                    return (
                      <div key={index} className="prose prose-slate dark:prose-invert max-w-none break-words overflow-hidden">
                        {paragraphs.map((paragraph, pIndex) => {
                          if (paragraph.startsWith("## ")) {
                            return (
                              <h2 key={pIndex} className="text-2xl font-bold mt-12 mb-4 break-words">
                                {paragraph.replace("## ", "")}
                              </h2>
                            );
                          }
                          return (
                            <p
                              key={pIndex}
                              className="text-lg leading-relaxed text-muted-foreground mb-6 break-words whitespace-pre-wrap"
                            >
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                })}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
