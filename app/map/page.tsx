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
import { MapComponent } from "@/components/map-component";
import { MapLegend } from "@/components/map-legend";
import { MapInstructions } from "@/components/map-instructions";
import { MapDataModal } from "@/components/map-data-modal";
import { MapClickReportModal } from "@/components/map-click-report-modal";
import {
  AlertCircle,
  Layers,
  FileWarning,
  ArrowLeft,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function MapPage() {
  const router = useRouter();
  const [activeLayer, setActiveLayer] = useState<string>("all");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMapDataModalOpen, setIsMapDataModalOpen] = useState(false);
  const [reportCoordinates, setReportCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [stats, setStats] = useState({
    normal: 0,
    warning: 0,
    problem: 0,
    total: 0,
  });
  const { t, language } = useLanguage();

  // Fetch stats from API
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/map-points");
        if (response.ok) {
          const points = await response.json();
          if (Array.isArray(points)) {
            const normal = points.filter(
              (p: any) => p?.status === "normal",
            ).length;
            const warning = points.filter(
              (p: any) => p?.status === "warning",
            ).length;
            const problem = points.filter(
              (p: any) => p?.status === "problem",
            ).length;

            setStats({
              normal,
              warning,
              problem,
              total: points.length,
            });
          } else {
            setStats({ normal: 0, warning: 0, problem: 0, total: 0 });
          }
        } else {
          setStats({ normal: 0, warning: 0, problem: 0, total: 0 });
        }
      } catch (error) {
        setStats({ normal: 0, warning: 0, problem: 0, total: 0 });
      }
    }

    fetchStats();
  }, []);

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
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              {t.map.title[language]}
            </h1>
            <Button
              size="lg"
              onClick={() => {
                // General issue without specific location
                setReportCoordinates(null);
                setIsReportModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <FileWarning className="h-5 w-5" />
              {language === "en" ? "Report an Issue" : "პრობლემის მოხსენება"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <Card className="bg-gradient-to-br from-muted/40 to-muted/20 border-2">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl md:text-3xl">
                    {t.map.instructionsTitle[language]}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    {language === "en"
                      ? "Learn how to interact with the map and report environmental issues"
                      : "ისწავლეთ როგორ გამოიყენოთ რუკა და მოახსენოთ გარემოს პრობლემები"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-base">
              <MapInstructions />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:h-[1000px]">
          {/* Sidebar - Layer Controls */}
          <div className="lg:col-span-1 flex flex-col gap-4 lg:h-full lg:overflow-y-auto">
            <Card className="flex-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  <CardTitle>{t.map.layersCardTitle[language]}</CardTitle>
                </div>
                <CardDescription>
                  {t.map.layersCardDesc[language]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeLayer === "all" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveLayer("all")}
                >
                  {t.map.layerAll[language]}
                </Button>

                {/* A. Water Quality Section */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">
                    {language === "en" ? "Water Quality" : "წყლის ხარისხი"}
                  </div>
                  <Button
                    variant={activeLayer === "water" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveLayer("water")}
                  >
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    {t.map.layerWater[language]}
                  </Button>
                </div>

                {/* B. Pollution Indicators Section */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">
                    {language === "en"
                      ? "Pollution Indicators"
                      : "დაბინძურების ინდიკატორები"}
                  </div>
                  <div className="pl-2 space-y-1 border-l-2 border-muted">
                    <Button
                      variant={activeLayer === "waste" ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("waste")}
                    >
                      <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                      {t.map.layerWaste[language]}
                    </Button>
                    <Button
                      variant={
                        activeLayer === "illegal_dump" ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("dump")}
                    >
                      <span className="w-3 h-3 rounded-full bg-red-700 mr-2"></span>
                      {t.map.layerIllegalDump[language]}
                    </Button>
                    <Button
                      variant={activeLayer === "odor" ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("odor")}
                    >
                      <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                      {t.map.layerOdor[language]}
                    </Button>
                  </div>
                </div>

                {/* C. Climate & Infrastructure Risks Section */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">
                    {language === "en" ? "Risk Layers" : "რისკის ფენები"}
                  </div>
                  <div className="pl-2 space-y-1 border-l-2 border-muted">
                    <Button
                      variant={activeLayer === "flood" ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("flooding")}
                    >
                      <span className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></span>
                      {t.map.layerFlood[language]}
                    </Button>
                    <Button
                      variant={
                        activeLayer === "drainage" ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("channels")}
                    >
                      <span className="w-3 h-3 rounded-full bg-teal-500 mr-2"></span>
                      {t.map.layerDrainage[language]}
                    </Button>
                    <Button
                      variant={
                        activeLayer === "sea_intrusion" ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("sea")}
                    >
                      <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                      {t.map.layerSeaIntrusion[language]}
                    </Button>
                    <Button
                      variant={
                        activeLayer === "erosion" ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("erosion")}
                    >
                      <span className="w-3 h-3 rounded-full bg-stone-500 mr-2"></span>
                      {t.map.layerErosion[language]}
                    </Button>
                  </div>
                </div>
              </CardContent>

              <CardContent>
                <MapLegend />
              </CardContent>
            </Card>

            {/* Removed Instructions Card from Sidebar */}
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card className="overflow-hidden p-0 flex-1">
              <div className="relative w-full h-[500px] md:h-[600px] lg:h-full">
                <MapComponent
                  activeLayer={activeLayer}
                  onPointClick={setSelectedPoint}
                />
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.normal}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.map.quickStatsNormal[language]}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {stats.warning}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.map.quickStatsRisk[language]}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {stats.problem}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.map.quickStatsProblem[language]}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {t.map.quickStatsReports[language]}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Map Instructions - Below the map grid */}
      </div>

      {/* Modal for point details */}
      {selectedPoint && (
        <MapDataModal
          point={selectedPoint}
          onClose={() => () => {
            setSelectedPoint(null);
            setIsMapDataModalOpen(false);
          }}
          isOpen={isMapDataModalOpen}
        />
      )}

      {/* Report Modal */}
      <MapClickReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportCoordinates(null);
        }}
        coordinates={reportCoordinates}
        onSubmit={(data) => {
          // Handle the submission here
        }}
      />
    </div>
  );
}
