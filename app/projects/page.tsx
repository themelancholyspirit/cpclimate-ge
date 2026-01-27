"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// Icon mapping
const iconMap: Record<string, any> = {
  Droplet,
  Users,
  Shield,
  Target,
};

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
}

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
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
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.projects.headerTitle[language]}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t.projects.headerDesc[language]}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Active Projects */}
        <div className="mb-16">
          {/* <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">
              {t.projects.activeTitle[language]}
            </h2>
          </div> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects
              .filter((p) => p.status === "Active")
              .map((project) => {
                const IconComponent = iconMap[project.icon] || Target;
                return (
                  <Card
                    key={project.id}
                    className="hover:shadow-lg transition-shadow flex flex-col h-full"
                  >
                    <CardHeader className="flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${project.color} flex items-center justify-center`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2 text-balance">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="leading-relaxed line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="h-4 w-4" />
                        <span>{project.duration}</span>
                      </div>
                      <Button asChild className="w-full">
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

        {/* Planning Phase z*/}
        {projects.filter((p) => p.status === "Planning").length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {t.projects.inPlanningTitle[language]}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects
                .filter((p) => p.status === "Planning")
                .map((project) => {
                  const IconComponent = iconMap[project.icon] || Target;
                  return (
                    <Card
                      key={project.id}
                      className="hover:shadow-lg transition-shadow flex flex-col h-full"
                    >
                      <CardHeader className="flex-grow">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-lg ${project.color} flex items-center justify-center`}
                          >
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <Badge variant="secondary">{project.status}</Badge>
                        </div>
                        <CardTitle className="text-xl mb-2 text-balance">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="leading-relaxed line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="mb-4">
                          <div className="text-sm font-semibold mb-2">
                            {t.projects.keyGoals[language]}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.goals.map((goal, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="bg-transparent"
                              >
                                {goal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <Link href={`/projects/${project.slug}`}>
                            {t.projects.learnMore[language]}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
