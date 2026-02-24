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
import { MapDataModal } from "@/components/map-data-modal";
import { MapClickReportModal } from "@/components/map-click-report-modal";
import { Layers, ArrowLeft, Info } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

type MapPoint = {
  type: string;
};

export default function MapPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [activeLayer, setActiveLayer] = useState<string>("all");
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMapDataModalOpen, setIsMapDataModalOpen] = useState(false);
  const [reportCoordinates, setReportCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [layerCounts, setLayerCounts] = useState({
    all: 0,
    water: 0,
    waste: 0,
    dump: 0,
    odor: 0,
    flooding: 0,
    channels: 0,
    sea: 0,
    erosion: 0,
  });

  // Fetch map points and compute counts by type
  useEffect(() => {
    async function fetchPoints() {
      try {
        const response = await fetch("/api/map-points");
        if (!response.ok) return;

        const points: MapPoint[] = await response.json();
        if (!Array.isArray(points)) return;

        const counts = {
          all: points.length,
          water: 0,
          waste: 0,
          dump: 0,
          odor: 0,
          flooding: 0,
          channels: 0,
          sea: 0,
          erosion: 0,
        };

        points.forEach((point) => {
          if (counts.hasOwnProperty(point.type)) {
            counts[point.type as keyof typeof counts]++;
          }
        });

        setLayerCounts(counts);
      } catch (error) {
        console.error("Failed to fetch map points", error);
      }
    }

    fetchPoints();
  }, []);

const CountBadge = ({
  count,
  active,
}: {
  count: number;
  active: boolean;
}) => (
  <span
    className={`
      ml-auto inline-flex items-center justify-center
      shrink-0
      min-w-[28px]
      h-5
      px-2
      text-[11px] font-semibold
      rounded-full
      transition-colors
      ${
        active
          ? "bg-background/20 text-white backdrop-blur-sm"
          : "bg-muted text-foreground"
      }
    `}
  >
    {count}
  </span>
);

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
          <h1 className="text-3xl md:text-4xl font-bold">
            {t.map.title[language]}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:h-[1000px]">
          {/* Sidebar */}
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
                {/* ALL */}
                <Button
                  variant={activeLayer === "all" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setActiveLayer("all")}
                >
                  {t.map.layerAll[language]}
                  <CountBadge count={layerCounts.all} active={activeLayer === "all"} />
                </Button>

                {/* WATER */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">
                    {language === "en" ? "Water Quality" : "წყლის ხარისხი"}
                  </div>

                  <Button
                    variant={activeLayer === "water" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveLayer("water")}
                  >
                    <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-blue-500 mr-2"></span>
                    {t.map.layerWater[language]}
                    <CountBadge count={layerCounts.water} active={activeLayer === "water"} />
                  </Button>
                </div>

                {/* POLLUTION */}
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
                      <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-orange-500 mr-2"></span>
                      {t.map.layerWaste[language]}
                      <CountBadge count={layerCounts.waste} active={activeLayer === "waste"} />
                    </Button>

                    <Button
                      variant={activeLayer === "dump" ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("dump")}
                    >
                      <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-red-700 mr-2"></span>
                      {t.map.layerIllegalDump[language]}
                      <CountBadge count={layerCounts.dump} active={activeLayer === "dump"} />
                    </Button>

                    <Button
                      variant={activeLayer === "odor" ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("odor")}
                    >
                      <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-amber-500 mr-2"></span>
                      {t.map.layerOdor[language]}
                      <CountBadge count={layerCounts.odor} active={activeLayer === "odor"} />
                    </Button>
                  </div>
                </div>

                {/* RISK */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">
                    {language === "en" ? "Risk Layers" : "რისკის ფენები"}
                  </div>

                  <div className="pl-2 space-y-1 border-l-2 border-muted">
                    <Button
                      variant={
                        activeLayer === "flooding" ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("flooding")}
                    >
                      <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-cyan-500 mr-2"></span>
                      {t.map.layerFlood[language]}
                      <CountBadge count={layerCounts.flooding} active={activeLayer === "flooding"} />
                    </Button>

                    <Button
                      variant={
                        activeLayer === "channels" ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("channels")}
                    >
                      <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-teal-500 mr-2"></span>
                      {t.map.layerDrainage[language]}
                      <CountBadge count={layerCounts.channels} active={activeLayer === "channels"} />
                    </Button>

                    <Button
                      variant={activeLayer === "sea" ? "default" : "outline"}
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("sea")}
                    >
                      <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-indigo-500 mr-2"></span>
                      {t.map.layerSeaIntrusion[language]}
                      <CountBadge count={layerCounts.sea} active={activeLayer === "sea"} />
                    </Button>

                    <Button
                      variant={
                        activeLayer === "erosion" ? "default" : "outline"
                      }
                      className="w-full justify-start text-sm"
                      onClick={() => setActiveLayer("erosion")}
                    >
                      <span className="w-3 h-3 min-w-[12px] min-h-[12px] flex-shrink-0 rounded-full bg-stone-500 mr-2"></span>
                      {t.map.layerErosion[language]}
                      <CountBadge count={layerCounts.erosion} active={activeLayer === "erosion"} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAP */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card className="overflow-hidden p-0 flex-1">
              <div className="relative w-full h-[500px] md:h-[600px] lg:h-full">
                <MapComponent
                  activeLayer={activeLayer}
                  onPointClick={setSelectedPoint}
                  setMapDataModalOpen={setIsMapDataModalOpen}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Point Details Modal */}
      {selectedPoint && (
        <MapDataModal
          point={selectedPoint}
          onClose={() => {
            setIsMapDataModalOpen(false);
            setSelectedPoint(null);
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
        onSubmit={() => {}}
        setShowReportModal={setIsReportModalOpen}
      />
    </div>
  );
}
