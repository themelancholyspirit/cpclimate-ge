"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Badge } from "@/components/ui/badge";
import { MapClickReportModal } from "./map-click-report-modal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { set } from "date-fns";

// MapEntity.ts
export type EntityType = "water" | "pollution" | "risk" | "report";

export interface MapEntity {
  id: string;
  entityType: EntityType;

  // For points
  lat?: number;
  lng?: number;

  // For polygons/lines
  polygon?: {
    type: string;
    coordinates: any[];
  };

  // Common fields
  title?: string;
  description?: string;

  // Water-specific
  locationName?: string;
  status?: "normal" | "risk" | "problematic";

  // Pollution-specific
  indicatorType?:
    | "waste_accumulation"
    | "illegal_discharge"
    | "odor_stagnation";
  severity?: "low" | "medium" | "high" | "critical";

  // Risk-specific
  riskType?:
    | "flood_zone"
    | "drainage_channel"
    | "sea_intrusion"
    | "erosion_section";
  riskLevel?: "low" | "medium" | "high" | "critical";
  channelStatus?: "existing" | "blocked" | "damaged";

  // Reports
  reportStatus?: string;
  reportedAt?: string;
  testDate?: string;
  citizenImpactExplanation?: string;
  sourceType?: string;

  type?: string;
}

interface MapComponentProps {
  activeLayer: string;
  onPointClick: (point: MapEntity | null) => void;
  setMapDataModalOpen: (isOpen: boolean) => void;
}

const riverOnlyStyle = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", stylers: [{ visibility: "off" }] },
];

const mapRestriction = {
  latLngBounds: {
    east: 41.73217031885423,
    north: 42.14222187777025,
    south: 42.11994330325824,
    west: 41.684105133307355,
  },
  strictBounds: false,
};

const defaultCenter = { lat: 42.1589, lng: 41.6712 };
const mapContainerStyle = { width: "100%", height: "100%" };

export function MapComponent({
  activeLayer,
  onPointClick,
  setMapDataModalOpen,
}: MapComponentProps) {
  const { t, language } = useLanguage();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapPoints, setMapPoints] = useState<MapEntity[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MapEntity | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showClickedMarker, setShowClickedMarker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportPrompt, setShowReportPrompt] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // ------------------- Fetch Map Points -------------------
  useEffect(() => {
    async function fetchMapPoints() {
      try {
        const typeParam = activeLayer !== "all" ? `?type=${activeLayer}` : "";
        const res = await fetch(`/api/map-points${typeParam}`);
        if (!res.ok) throw new Error("Failed to fetch map points");
        const data: MapEntity[] = await res.json();
        setMapPoints(data);
      } catch (err) {
        console.error(err);
        setMapPoints([]);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchMapPoints();
  }, [activeLayer]);

  // ------------------- Marker Icon -------------------
  const getMarkerIcon = useCallback(
    (entity: MapEntity, isHovered = false): google.maps.Symbol | undefined => {
      if (typeof window === "undefined" || !window?.google?.maps?.SymbolPath)
        return undefined;
      let color = "#22c55e";

      const TYPE_COLORS: Record<string, string> = {
        water: "#ef4444",
        channels: "#14b8a6",
        flooding: "#06b6d4",
        sea: "#6366f1",
        erosion: "#78716c",
        waste: "#f97316",
        dump: "#b91c1c",
        odor: "#f59e0b",
      };

      try {
        if (entity.type === "water") {
          color =
            entity.status === "normal"
              ? "#22c55e"
              : entity.status === "risk"
                ? "#eab308"
                : "#ef4444";
        } else {
          color = entity.type
            ? (TYPE_COLORS[entity.type as EntityType] ?? "#64748b")
            : "#64748b";
        }
      } catch {
        color = "#22c55e";
      }

      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: isHovered ? 8.5 : 8,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: isHovered ? 2.3 : 2,
      };
    },
    [],
  );

  // ------------------- Map Load/Unmount -------------------
  const onLoad = useCallback((map: google.maps.Map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  // ------------------- Marker Hover -------------------
  const handleMarkerHover = useCallback(
    (point: MapEntity) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      setHoveredMarkerId(point.id);
      setSelectedPoint(point);
      setMapDataModalOpen(true);
    },
    [hoverTimeout],
  );

  const handleMarkerLeave = useCallback(() => {
    setHoveredMarkerId(null);
    const timeout = setTimeout(() => setSelectedPoint(null), 1);
    setHoverTimeout(timeout);
  }, []);

  const handleMarkerClick = useCallback(
    (point: MapEntity) => onPointClick(point),
    [onPointClick],
  );

  // ------------------- Map Click -------------------
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setClickedLocation({ lat, lng });
    setShowClickedMarker(true);
    setSelectedPoint(null);
    setShowReportPrompt(false);
    setShowReportModal(false);

    setTimeout(() => setShowReportPrompt(true), 500);
  };

  const handleReportSubmit = async (data: any) => {
    if (!clickedLocation) return;
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          lat: clickedLocation.lat,
          lng: clickedLocation.lng,
        }),
      });
      if (res.ok) {
        setShowReportModal(false);
        setClickedLocation(null);
      }
    } catch (err) {}
  };

  const mapOptions: google.maps.MapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      restriction: mapRestriction,
      minZoom: 13,
      maxZoom: 13,
      mapTypeId: "terrain",
      draggable: true,
      scrollwheel: false,
      gestureHandling: "none",
      disableDoubleClickZoom: true,
      styles: riverOnlyStyle,
    }),
    [],
  );

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  if (!apiKey) return <div>Google Maps API key missing</div>;
  if (loadError) return <div>Failed to load Google Maps API</div>;
  if (!isLoaded) return <div>Loading map…</div>;
  if (initialLoading) return <div>Loading map points…</div>;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {mapPoints
          .filter((p) => p.lat && p.lng)
          .map((point) => (
            <Marker
              key={point.id}
              position={{ lat: point.lat!, lng: point.lng! }}
              icon={getMarkerIcon(point, point.id === hoveredMarkerId)}
              onClick={() => handleMarkerClick(point)}
              onMouseOver={() => handleMarkerHover(point)}
              onMouseOut={handleMarkerLeave}
              title={
                point.entityType === "water" ? point.locationName : point.title
              }
            />
          ))}

        {clickedLocation && showClickedMarker && (
          <Marker
            position={clickedLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#ef4444",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 3,
            }}
          />
        )}
      </GoogleMap>

      {showReportPrompt && clickedLocation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 pointer-events-auto overflow-hidden w-64">
            {/* Header */}
            <div className="px-5 pt-5 pb-4 text-center">
              <div className="font-semibold text-sm text-gray-900 mb-1.5">
                {t.map.reportPromptTitle[language]}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">
                {t.map.reportPromptBody[language]}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* Buttons */}
            <div className="flex divide-x divide-gray-100">
              <button
                className="flex-1 py-2.5 text-xs text-muted-foreground hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowReportPrompt(false);
                  setClickedLocation(null);
                  setShowClickedMarker(false);
                }}
              >
                {language === "en" ? "Cancel" : "გაუქმება"}
              </button>
              <button
                className="flex-1 py-2.5 text-xs font-semibold text-black hover:bg-blue-50 transition-colors"
                onClick={() => {
                  setShowReportModal(true);
                  setShowReportPrompt(false);
                }}
              >
                {language === "en" ? "Report" : "შეტყობინება"}
              </button>
            </div>
          </div>
        </div>
      )}
      <MapClickReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setClickedLocation(null);
          setShowClickedMarker(false);
        }}
        coordinates={clickedLocation}
        onSubmit={handleReportSubmit}
        setShowReportModal={setShowReportModal}
      />
    </div>
  );
}
