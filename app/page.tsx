"use client";

import Link from "next/link";
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
  ArrowRight,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Droplet,
  Shield,
  Calendar,
  Target,
  Waves,
  TreeDeciduous,
  Leaf,
  Recycle,
  Factory,
  Microscope,
  BarChart3,
  Globe,
} from "lucide-react";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState } from "react";

// Icon mapping for dynamic projects - matches /projects page
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
  // Legacy support
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
  headerImage: string | null;
}

interface NewsArticle {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  excerpt_en?: string;
  excerpt_ka?: string;
  publishedAt: string;
  headerImage: string | null;
  category?: string;
}

interface Landmark {
  id: string;
  slug: string;
  title_en: string;
  title_ka: string;
  description_en: string;
  description_ka: string;
  location?: string;
  date: string;
  headerImage: string | null;
}

export default function HomePage() {
  const { t, language } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [featuredLandmarks, setFeaturedLandmarks] = useState<Landmark[]>([]);
  const [isLoadingLandmarks, setIsLoadingLandmarks] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const response = await fetch("/api/projects/featured");
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.projects)) {
            setFeaturedProjects(data.projects);
          } else {
            console.error("Featured projects response invalid format");
            setFeaturedProjects([]);
          }
        } else {
          console.error("Failed to fetch featured projects:", response.status);
          setFeaturedProjects([]);
        }
      } catch (error) {
        console.error("Error fetching featured projects:", error);
        setFeaturedProjects([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedProjects();
  }, []);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.news)) {
            // Get only the latest 3 news articles
            setNewsArticles(data.news.slice(0, 3));
          } else {
            setNewsArticles([]);
          }
        } else {
          console.error("Failed to fetch news:", response.status);
          setNewsArticles([]);
        }
      } catch (error) {
        setNewsArticles([]);
      } finally {
        setIsLoadingNews(false);
      }
    }

    fetchNews();
  }, []);

  useEffect(() => {
    async function fetchLandmarks() {
      try {
        const response = await fetch("/api/landmarks/featured");
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.landmarks)) {
            setFeaturedLandmarks(data.landmarks);
          } else {
            console.error("Featured landmarks response invalid format");
            setFeaturedLandmarks([]);
          }
        } else {
          console.error("Failed to fetch featured landmarks:", response.status);
          setFeaturedLandmarks([]);
        }
      } catch (error) {
        console.error("Error fetching featured landmarks:", error);
        setFeaturedLandmarks([]);
      } finally {
        setIsLoadingLandmarks(false);
      }
    }

    fetchLandmarks();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {t.homePage.heroTitle[language]}
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 text-balance">
              {t.homePage.heroSubtitle[language]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/map">
                  {t.homePage.ctaMap[language]}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/projects">{t.homePage.ctaProjects[language]}</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Data visualization hint */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Who We Are */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              {t.homePage.whoWeAreTitle[language]}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed text-center mb-8">
              {t.homePage.whoWeAreDesc[language]}
            </p>
            <div className="text-center">
              <Button asChild variant="outline">
                <Link href="/about">
                  {t.homePage.aboutCPC[language]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.homePage.whatWeDoTitle[language]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{t.homePage.evidenceTitle[language]}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {t.homePage.evidenceDesc[language]}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="leading-[1.2]">
                  {t.homePage.communityTitle[language]}
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {t.homePage.communityDesc[language]}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{t.homePage.policyTitle[language]}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {t.homePage.policyDesc[language]}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/about">
                {t.homePage.aboutCPC[language]}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects - only show if there are featured projects */}
      {(isLoading || featuredProjects.length > 0) && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {t.homePage.featuredProjectsTitle[language]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {isLoading
                ? // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-full h-48 bg-slate-200 rounded-md mb-4 animate-pulse" />
                        <div className="h-6 bg-slate-200 rounded mb-2 animate-pulse" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </CardHeader>
                    </Card>
                  ))
                : // Dynamic featured projects - same style as /projects page
                  featuredProjects.map((project) => {
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
                            <Badge
                              variant="default"
                              className="bg-green-600 text-xs"
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
                          </div>
                          <CardTitle className="text-lg mb-1.5 text-balance">
                            {language === "en"
                              ? project.title_en
                              : project.title_ka}
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
            <div className="text-center">
              <Button asChild>
                <Link href="/projects">
                  {t.projects.headerTitle[language]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Map CTA */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.homePage.interactiveMapTitle[language]}
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              {t.homePage.interactiveMapDesc[language]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/map">
                  {t.homePage.openMap[language]}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Landmarks */}
      {(isLoadingLandmarks || featuredLandmarks.length > 0) && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {language === "en"
                ? "Featured Landmarks"
                : "გამორჩეული ღირსშესანიშნაობები"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {isLoadingLandmarks
                ? // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-full h-48 bg-slate-200 rounded-md mb-4 animate-pulse" />
                        <div className="h-6 bg-slate-200 rounded mb-2 animate-pulse" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </CardHeader>
                    </Card>
                  ))
                : // Dynamic featured landmarks
                  featuredLandmarks.map((landmark) => (
                    <Card
                      key={landmark.id}
                      className="hover:shadow-lg transition-shadow flex flex-col overflow-hidden py-0"
                    >
                      {landmark.headerImage && (
                        <div className="p-3">
                          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg">
                            <img
                              src={landmark.headerImage}
                              alt={
                                language === "en"
                                  ? landmark.title_en
                                  : landmark.title_ka
                              }
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}

                      <CardHeader
                        className={landmark.headerImage ? "pt-0" : ""}
                      >
                        <CardTitle className="text-lg mb-2 line-clamp-2 text-balance">
                          {language === "en"
                            ? landmark.title_en
                            : landmark.title_ka}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 leading-relaxed text-sm">
                          {language === "en"
                            ? landmark.description_en
                            : landmark.description_ka}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="mt-auto space-y-2 pt-0 pb-4">
                        <Button size="sm" className="w-full" asChild>
                          <Link href={`/landmarks/${landmark.slug}`}>
                            {language === "en" ? "Learn More" : "გაიგე მეტი"}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
            </div>
            <div className="text-center">
              <Button asChild variant="outline">
                <Link href="/landmarks">
                  {language === "en" ? "View All Landmarks" : "ყველა ლანდშაფტი"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Community in Action */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {t.homePage.communityInAction[language]}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center mb-12 max-w-3xl mx-auto">
            {t.homePage.communityInActionDesc[language]}
          </p>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-3 md:gap-4 max-w-7xl mx-auto">
            {/* Large hero card - spans full width on mobile, 7 cols on desktop */}
            <div className="col-span-12 md:col-span-7 row-span-1 md:row-span-2">
              <div className="relative h-48 md:h-full min-h-[280px] bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="sazogadoeba_mokmedebashi_6.jpg"
                  alt="Community volunteers participating in river cleanup activities along Kaparchina River"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Medium card - top right */}
            <div className="col-span-6 md:col-span-5 row-span-1">
              <div className="relative h-40 md:h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="sazogadoeba_mokmedebashi_5.jpg"
                  alt="Youth environmental education and training workshop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Small card - middle right */}
            <div className="col-span-6 md:col-span-5 row-span-1">
              <div className="relative h-40 md:h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="sazogadoeba_mokmedebashi_4.jpg"
                  alt="Community leaders and women participating in environmental decision-making"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Wide card - bottom left */}
            <div className="col-span-12 md:col-span-7 row-span-1">
              <div className="relative h-44 md:h-48 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="sazogadoeba_mokmedebashi_3.jpg"
                  alt="Field monitoring and environmental data collection by citizen scientists"
                  className="w-full h-full object-cover object-[center_40%]"
                />
              </div>
            </div>

            {/* Vertical card - bottom right */}
            <div className="col-span-12 md:col-span-5 row-span-1 md:row-span-2">
              <div className="relative h-44 md:h-full md:min-h-[260px] bg-gradient-to-br from-green-50 to-slate-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="sazogadoeba_mokmedebashi_7.png"
                  alt="Community engagement workshop and collaborative environmental planning"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Small square cards - bottom */}
            <div className="col-span-6 md:col-span-4 row-span-1">
              <div className="relative h-40 md:h-44 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="sazogadoeba_mokmedebashi_1.jpg"
                  alt="Water quality testing and environmental assessment by community monitors"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 row-span-1">
              <div className="relative h-40 md:h-44 bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="sazogadoeba_mokmedebashi_2.jpg"
                  alt="Public awareness campaign and environmental education outreach"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Results */}
      {/* <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.homePage.impactTitle[language]}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                number: "3",
                label: t.homePage.statsRiversAssessed[language],
                icon: Droplet,
              },
              {
                number: "250+",
                label: t.homePage.statsCitizensEngaged[language],
                icon: Users,
              },
              {
                number: "12",
                label: t.homePage.statsPolicyRecommendations[language],
                icon: FileText,
              },
              {
                number: "45",
                label: t.homePage.statsCommunityMonitors[language],
                icon: TrendingUp,
              },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Partners & Donors */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {t.homePage.partnersDonorsTitle[language]}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.homePage.partnersDonorsDesc[language]}
          </p>
          
          {/* Partners Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              {[
                { name: "CENN", logo: "/partners/cenn-300x240.png" },
                { name: "European Environmental Bureau", logo: "/partners/EEB-logo-on-white-blue-text-cmyk-002-1-300x188.jpg" },
                { name: "IRC", logo: "/partners/irc-300x240.png" },
                { name: "Ozurgeti Municipality", logo: "/partners/ozurgeti.png" },
                { name: "VVG", logo: "/partners/vvg-300x240.png" },
                { name: "Chokhatauri Municipality", logo: "/partners/chokhatauri.png" },
                { name: "iBloki", logo: "/partners/ibloki.png" },
                { name: "Lanchkhuti Municipality", logo: "/partners/lanchkhuti.png" },
                { name: "Poland Ministry", logo: "/partners/poland.png" },
                { name: "Women's Fund Georgia", logo: "/partners/ქალათა_ფონდი.png" },
              ].map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 mx-4 md:mx-6 group"
                  style={{ width: '180px' }}
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-32 flex items-center justify-center group-hover:scale-105">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      title={partner.name}
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
                    {partner.name}
                  </p>
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[
                { name: "CENN", logo: "/partners/cenn-300x240.png" },
                { name: "European Environmental Bureau", logo: "/partners/EEB-logo-on-white-blue-text-cmyk-002-1-300x188.jpg" },
                { name: "IRC", logo: "/partners/irc-300x240.png" },
                { name: "Ozurgeti Municipality", logo: "/partners/ozurgeti.png" },
                { name: "VVG", logo: "/partners/vvg-300x240.png" },
                { name: "Chokhatauri Municipality", logo: "/partners/chokhatauri.png" },
                { name: "iBloki", logo: "/partners/ibloki.png" },
                { name: "Lanchkhuti Municipality", logo: "/partners/lanchkhuti.png" },
                { name: "Poland Ministry", logo: "/partners/poland.png" },
                { name: "Women's Fund Georgia", logo: "/partners/ქალათა_ფონდი.png" },
              ].map((partner, i) => (
                <div
                  key={`dup-${i}`}
                  className="flex-shrink-0 mx-4 md:mx-6 group"
                  style={{ width: '180px' }}
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-32 flex items-center justify-center group-hover:scale-105">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                      title={partner.name}
                    />
                  </div>
                  <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
                    {partner.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Add CSS animation */}
          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            
            .animate-scroll {
              animation: scroll 40s linear infinite;
            }
            
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      </section>

      {/* Latest News - only show if there are news articles */}
      {(isLoadingNews || newsArticles.length > 0) && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              {t.news.headerTitle[language]}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {isLoadingNews
                ? // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="w-full h-40 bg-slate-200 rounded-md mb-4 animate-pulse" />
                        <div className="h-6 bg-slate-200 rounded mb-2 animate-pulse" />
                        <div className="h-4 bg-slate-200 rounded animate-pulse" />
                      </CardHeader>
                    </Card>
                  ))
                : // Dynamic news articles
                  newsArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="hover:shadow-lg transition-shadow flex flex-col overflow-hidden py-0"
                    >
                      {article.headerImage && (
                        <div className="p-3">
                          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg">
                            <img
                              src={article.headerImage}
                              alt={
                                language === "en"
                                  ? article.title_en
                                  : article.title_ka
                              }
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}

                      <CardHeader className={article.headerImage ? "pt-0" : ""}>
                        <CardTitle className="text-lg mb-2 line-clamp-2 text-balance">
                          {language === "en"
                            ? article.title_en
                            : article.title_ka}
                        </CardTitle>
                        <CardDescription className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString(
                                language === "en" ? "en-US" : "ka-GE",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>

                      {(article.excerpt_en || article.excerpt_ka) && (
                        <div className="px-6 pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {language === "en"
                              ? article.excerpt_en
                              : article.excerpt_ka}
                          </p>
                        </div>
                      )}

                      <CardContent className="mt-auto space-y-2 pt-4 pb-4">
                        <Button size="sm" className="w-full" asChild>
                          <Link href={`/news/${article.slug}`}>
                            {t.news.readMore[language]}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
            </div>
            <div className="text-center">
              <Button asChild variant="outline">
                <Link href="/news">
                  {t.news.viewAll[language]}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Get Involved */}
      <section className="py-16 md:py-24 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t.homePage.getInvolvedTitle[language]}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t.homePage.getInvolvedDesc[language]}
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/contact">{t.homePage.contactUs[language]}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
