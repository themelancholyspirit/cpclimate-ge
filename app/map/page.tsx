"use client";

import { useState, useEffect } from "react";
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
import { AlertCircle, Layers, FileWarning } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function MapPage() {
  const [activeLayer, setActiveLayer] = useState<string>("all");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportCoordinates, setReportCoordinates] = useState<{ lat: number; lng: number } | null>(null);
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
          const normal = points.filter(
            (p: any) => p.status === "normal",
          ).length;
          const warning = points.filter(
            (p: any) => p.status === "warning",
          ).length;
          const problem = points.filter(
            (p: any) => p.status === "problem",
          ).length;

          setStats({
            normal,
            warning,
            problem,
            total: points.length,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
                // Set coordinates to center of Georgia (Tbilisi area) as default
                setReportCoordinates({ lat: 41.7151, lng: 44.8271 });
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Layer Controls */}
          <div className="lg:col-span-1 flex flex-col gap-4">
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
                <Button
                  variant={activeLayer === "water" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveLayer("water")}
                >
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                  {t.map.layerWater[language]}
                </Button>
                <Button
                  variant={activeLayer === "pollution" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveLayer("pollution")}
                >
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  {t.map.layerPollution[language]}
                </Button>
                <Button
                  variant={activeLayer === "risk" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveLayer("risk")}
                >
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  {t.map.layerRisk[language]}
                </Button>
                <Button
                  variant={
                    activeLayer === "infrastructure" ? "default" : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => setActiveLayer("infrastructure")}
                >
                  <span className="w-3 h-3 rounded-full bg-slate-500 mr-2"></span>
                  {t.map.layerInfrastructure[language]}
                </Button>
              </CardContent>

              <CardContent>
                <MapLegend />
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>{t.map.instructionsTitle[language]}</CardTitle>
              </CardHeader>
              <CardContent>
                <MapInstructions />
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card className="overflow-hidden flex-1">
              <div className="relative h-[600px] lg:h-[700px]">
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
      </div>

      {/* Modal for point details */}
      {selectedPoint && (
        <MapDataModal
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
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
          console.log("Report submitted:", data);
          // Handle the submission here
        }}
      />
    </div>
  );
}
