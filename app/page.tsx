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
import {
  ArrowRight,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Droplet,
  Shield,
} from "lucide-react";
import { Item } from "@radix-ui/react-dropdown-menu";
import { useLanguage } from "@/contexts/language-context";

export default function HomePage() {
  const { t, language } = useLanguage();
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
                <Link href="/contact">
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
                <CardTitle>{t.homePage.communityTitle[language]}</CardTitle>
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
              <Link href="/contact">
                {t.homePage.aboutCPC[language]}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.homePage.featuredProjectsTitle[language]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-blue-100 rounded-md mb-4 flex items-center justify-center">
                  <Droplet className="h-16 w-16 text-blue-600" />
                </div>
                <CardTitle className="text-balance">
                  Kaparchina River: Climate Resilience & Citizen Monitoring
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  Comprehensive environmental monitoring and community
                  engagement for the Kaparchina River ecosystem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/projects/kaparchina">
                    {t.projects.learnMore[language]}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-green-100 rounded-md mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-green-600" />
                </div>
                <CardTitle className="text-balance">
                  Community River Observers Network (C-RON)
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  Training and empowering local citizens to become active
                  environmental monitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/projects/c-ron">
                    {t.projects.learnMore[language]}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-full h-48 bg-slate-100 rounded-md mb-4 flex items-center justify-center">
                  <Shield className="h-16 w-16 text-slate-600" />
                </div>
                <CardTitle className="text-balance">
                  Local Climate Governance Initiatives
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  Building capacity for climate action through evidence-based
                  policy recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/projects/governance">
                    {t.projects.learnMore[language]}
                  </Link>
                </Button>
              </CardContent>
            </Card>
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link href="/map">{t.homePage.reportIssue[language]}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
                  src="kaparcha_1.jpg"
                  alt="Community volunteers participating in river cleanup activities along Kaparchina River"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Medium card - top right */}
            <div className="col-span-6 md:col-span-5 row-span-1">
              <div className="relative h-40 md:h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="kaparcha_1.jpg"
                  alt="Youth environmental education and training workshop"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Small card - middle right */}
            <div className="col-span-6 md:col-span-5 row-span-1">
              <div className="relative h-40 md:h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="kaparcha_1.jpg"
                  alt="Community leaders and women participating in environmental decision-making"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Wide card - bottom left */}
            <div className="col-span-12 md:col-span-7 row-span-1">
              <div className="relative h-44 md:h-48 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="kaparcha_1.jpg"
                  alt="Field monitoring and environmental data collection by citizen scientists"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Vertical card - bottom right */}
            <div className="col-span-12 md:col-span-5 row-span-1 md:row-span-2">
              <div className="relative h-44 md:h-full md:min-h-[260px] bg-gradient-to-br from-green-50 to-slate-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="kaparcha_1.jpg"
                  alt="Community engagement workshop and collaborative environmental planning"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Small square cards - bottom */}
            <div className="col-span-6 md:col-span-4 row-span-1">
              <div className="relative h-40 md:h-44 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="kaparcha_1.jpg"
                  alt="Water quality testing and environmental assessment by community monitors"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 row-span-1">
              <div className="relative h-40 md:h-44 bg-gradient-to-br from-slate-50 to-green-50 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src="kaparcha_1.jpg"
                  alt="Public awareness campaign and environmental education outreach"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Impact & Results */}
      <section className="py-16 md:py-24 bg-muted/30">
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
      </section>

      {/* Partners & Donors */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            {t.homePage.partnersDonorsTitle[language]}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.homePage.partnersDonorsDesc[language]}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {["EU", "UN", "Municipality", "CSO Network"].map((partner, i) => (
              <div
                key={i}
                className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center text-sm font-semibold text-muted-foreground"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources & Publications */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {t.homePage.resourcesTitle[language]}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Kaparchina River Baseline Study 2024",
                type: "Technical Report",
              },
              {
                title: "Climate Resilience Policy Brief",
                type: "Policy Document",
              },
              {
                title: "Community Monitoring Guide",
                type: "Training Material",
              },
            ].map((resource, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="w-full h-40 bg-slate-100 rounded-md mb-4 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-slate-400" />
                  </div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.type}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/findings">
                {t.homePage.accessAllResources[language]}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
