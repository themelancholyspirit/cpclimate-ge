"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Polygon,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Badge } from "@/components/ui/badge";
import { MapClickReportModal } from "./map-click-report-modal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

// A. Water Sampling Points
interface WaterSamplingPoint {
  id: string;
  locationName: string;
  lat: number;
  lng: number;
  status: "normal" | "risk" | "problematic";
  summaryText: string;
  testDate: string;
  citizenImpactExplanation: string;
  metadata?: any;
  entityType: "water";
}

// B. Pollution Indicators
interface PollutionIndicator {
  id: string;
  indicatorType: "waste_accumulation" | "illegal_discharge" | "odor_stagnation";
  sourceType: "field_observation" | "citizen_report";
  geometryType: "point" | "polygon";
  lat?: number;
  lng?: number;
  polygon?: any;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  reportedAt: string;
  metadata?: any;
  entityType: "pollution";
}

// C. Risk Layers
interface RiskLayer {
  id: string;
  riskType: "flood_zone" | "drainage_channel" | "sea_intrusion" | "erosion_section";
  geometryType: "point" | "polygon" | "line";
  lat?: number;
  lng?: number;
  polygon?: any;
  title: string;
  description: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  channelStatus?: "existing" | "blocked" | "damaged";
  metadata?: any;
  entityType: "risk";
}

type MapEntity = WaterSamplingPoint | PollutionIndicator | RiskLayer;

interface MapComponentProps {
  activeLayer: string;
  onPointClick: (point: MapEntity | null) => void;
}

const riverOnlyStyle = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    stylers: [{ visibility: "off" }],
  },
];

// Define the bounds for Kaparchina River area, Poti, Georgia
// Users will not be able to pan outside this area

const mapRestriction = {
  latLngBounds: {
    east: 41.73217031885423,
    north: 42.14222187777025,
    south: 42.11994330325824,
    west: 41.684105133307355,
  },
  strictBounds: false,
};

// Default center for Kaparchina River, Poti, Georgia
const defaultCenter = {
  lat: 42.1589, // Center based on Google Maps coordinates
  lng: 41.6712, // Center based on Google Maps coordinates
};
// Map container styles
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export function MapComponent({ activeLayer, onPointClick }: MapComponentProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapEntity | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [waterPoints, setWaterPoints] = useState<WaterSamplingPoint[]>([]);
  const [pollutionIndicators, setPollutionIndicators] = useState<PollutionIndicator[]>([]);
  const [riskLayers, setRiskLayers] = useState<RiskLayer[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const { t, language } = useLanguage();

  // Fetch map entities from APIs
  useEffect(() => {
    async function fetchMapData() {
      try {
        // Fetch water sampling points
        if (activeLayer === "all" || activeLayer === "water") {
          try {
            const waterRes = await fetch("/api/water-sampling-points");
            if (waterRes.ok) {
              const data = await waterRes.json();
              if (Array.isArray(data)) {
                setWaterPoints(data.map((p: any) => ({ ...p, entityType: "water" as const })));
              } else {
                console.error("Water sampling points response is not an array");
                setWaterPoints([]);
              }
            } else {
              console.error("Failed to fetch water sampling points", waterRes.status);
              setWaterPoints([]);
            }
          } catch (err) {
            console.error("Error fetching water sampling points:", err);
            setWaterPoints([]);
          }
        } else {
          setWaterPoints([]);
        }

        // Fetch pollution indicators
        if (activeLayer === "all" || ["waste", "illegal_dump", "odor"].includes(activeLayer)) {
          try {
            const indicatorType = activeLayer === "waste" ? "waste_accumulation"
              : activeLayer === "illegal_dump" ? "illegal_discharge"
              : activeLayer === "odor" ? "odor_stagnation"
              : undefined;
            
            const url = indicatorType
              ? `/api/pollution-indicators?indicatorType=${indicatorType}`
              : "/api/pollution-indicators";
            
            const pollutionRes = await fetch(url);
            if (pollutionRes.ok) {
              const data = await pollutionRes.json();
              if (Array.isArray(data)) {
                setPollutionIndicators(data.map((p: any) => ({ ...p, entityType: "pollution" as const })));
              } else {
                console.error("Pollution indicators response is not an array");
                setPollutionIndicators([]);
              }
            } else {
              console.error("Failed to fetch pollution indicators", pollutionRes.status);
              setPollutionIndicators([]);
            }
          } catch (err) {
            console.error("Error fetching pollution indicators:", err);
            setPollutionIndicators([]);
          }
        } else {
          setPollutionIndicators([]);
        }

        // Fetch risk layers - MUST clear immediately before fetch
        if (activeLayer === "all" || ["flood", "drainage", "sea_intrusion", "erosion", "risk"].includes(activeLayer)) {
          // Clear risk layers BEFORE fetching new data
          setRiskLayers([]);
          
          try {
            const riskType = activeLayer === "flood" ? "flood_zone"
              : activeLayer === "drainage" ? "drainage_channel"
              : activeLayer === "sea_intrusion" ? "sea_intrusion"
              : activeLayer === "erosion" ? "erosion_section"
              : undefined;
            
            const url = riskType
              ? `/api/risk-layers?riskType=${riskType}&isActive=true`
              : "/api/risk-layers?isActive=true";
            
            console.log("Fetching risk layers:", url, "for activeLayer:", activeLayer);
            const riskRes = await fetch(url);
            if (riskRes.ok) {
              const data = await riskRes.json();
              console.log("Risk layers received:", data.length, "items");
              data.forEach((d: any) => console.log("  -", d.riskType, d.title));
              if (Array.isArray(data)) {
                setRiskLayers(data.map((p: any) => ({ ...p, entityType: "risk" as const })));
              } else {
                console.error("Risk layers response is not an array");
                setRiskLayers([]);
              }
            } else {
              console.error("Failed to fetch risk layers", riskRes.status);
              setRiskLayers([]);
            }
          } catch (err) {
            console.error("Error fetching risk layers:", err);
            setRiskLayers([]);
          }
        } else {
          setRiskLayers([]);
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
        setWaterPoints([]);
        setPollutionIndicators([]);
        setRiskLayers([]);
      } finally {
        setInitialLoading(false);
      }
    }

    fetchMapData();
  }, [activeLayer]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedPoint(null); // Close any hover InfoWindow
      setShowReportModal(false); // Close report modal
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setClickedLocation({ lat, lng });

      console.log(lat, lng);
      // Don't open modal immediately - just show the marker
      // setShowReportModal(true); // Remove this line
    }
  };

  const handleReportSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          lat: clickedLocation?.lat,
          lng: clickedLocation?.lng,
        }),
      });

      if (response.ok) {
        console.log("Report submitted successfully");
        // Optionally refresh map points to show new report
        setClickedLocation(null);
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  // Callback when map loads
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Get pixel position for custom tooltip
  const getPixelPosition = useCallback(
    (lat: number, lng: number) => {
      if (!map) return null;
      const projection = map.getProjection();
      if (!projection) return null;

      const point = projection.fromLatLngToPoint(
        new google.maps.LatLng(lat, lng),
      );
      if (!point) return null;

      const scale = Math.pow(2, map.getZoom() || 13);
      const worldPoint = new google.maps.Point(
        point.x * scale,
        point.y * scale,
      );

      const bounds = map.getBounds();
      if (!bounds) return null;

      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const nePoint = projection.fromLatLngToPoint(ne);
      const swPoint = projection.fromLatLngToPoint(sw);

      if (!nePoint || !swPoint) return null;

      const neWorldPoint = new google.maps.Point(
        nePoint.x * scale,
        nePoint.y * scale,
      );
      const swWorldPoint = new google.maps.Point(
        swPoint.x * scale,
        swPoint.y * scale,
      );

      const mapDiv = map.getDiv();
      const mapWidth = mapDiv.offsetWidth;
      const mapHeight = mapDiv.offsetHeight;

      const x =
        ((worldPoint.x - swWorldPoint.x) / (neWorldPoint.x - swWorldPoint.x)) *
        mapWidth;
      const y =
        ((worldPoint.y - neWorldPoint.y) / (swWorldPoint.y - neWorldPoint.y)) *
        mapHeight;

      return { x, y };
    },
    [map],
  );

  // Callback when map unmounts
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker hover
  const handleMarkerHover = useCallback(
    (point: MapEntity) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setClickedLocation(null); // Close any clicked location InfoWindow
      setShowReportModal(false); // Close report modal
      setHoveredMarkerId(point.id);
      setSelectedPoint(point);
    },
    [hoverTimeout],
  );

  // Handle marker leave with delay
  const handleMarkerLeave = useCallback(() => {
    setHoveredMarkerId(null);
    const timeout = setTimeout(() => {
      setSelectedPoint(null);
    }, 1);
    setHoverTimeout(timeout);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (point: MapEntity) => {
      onPointClick(point);
    },
    [onPointClick],
  );

  // Map options with restriction
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      restriction: mapRestriction, // Restrict map to specific area
      minZoom: 13, // Lock zoom at 13
      maxZoom: 13, // Lock zoom at 13
      mapTypeId: "terrain",
      draggable: true,
      scrollwheel: false, // Fixed typo: was "scroolWheel"
      gestureHandling: "none",
      disableDoubleClickZoom: true, // Should be true
      styles: riverOnlyStyle,
    }),
    [],
  );

  const getMarkerIcon = useCallback(
    (
      entity: MapEntity,
      isHovered: boolean = false,
    ): google.maps.Symbol | undefined => {
      // Check if Google Maps API is loaded
      if (typeof window === "undefined" || !window?.google?.maps?.SymbolPath) {
        return undefined;
      }

      // Determine color based on entity type and status with safe defaults
      let color = "#22c55e"; // default green
      
      try {
        if (entity.entityType === "water") {
          // Water points: color by status (normal/risk/problematic)
          color = entity.status === "normal" ? "#22c55e"
            : entity.status === "risk" ? "#eab308"
            : entity.status === "problematic" ? "#ef4444"
            : "#22c55e";
        } else if (entity.entityType === "pollution") {
          // Pollution indicators: color by type to match filter buttons
          color = entity.indicatorType === "waste_accumulation" ? "#f97316" // orange-500
            : entity.indicatorType === "illegal_discharge" ? "#b91c1c" // red-700
            : entity.indicatorType === "odor_stagnation" ? "#f59e0b" // amber-500
            : "#f97316"; // default to orange
        } else if (entity.entityType === "risk") {
          // Risk layers: color by type to match filter buttons  
          color = entity.riskType === "flood_zone" ? "#06b6d4" // cyan-500
            : entity.riskType === "drainage_channel" ? "#14b8a6" // teal-500
            : entity.riskType === "sea_intrusion" ? "#6366f1" // indigo-500
            : entity.riskType === "erosion_section" ? "#78716c" // stone-500
            : "#64748b"; // default to slate
        }
      } catch (err) {
        console.error("Error determining marker color:", err);
        color = "#22c55e"; // fallback to green
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
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Load Google Maps JS API once and cache it
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  });

  // Show error if API key is missing
  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-center p-4">
          <p className="text-red-600 font-semibold mb-2">
            {t.map.apiKeyMissingTitle[language]}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.map.apiKeyMissingBody[language]}
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 text-red-600">Failed to load Google Maps API.</div>
    );
  }

  if (!isLoaded) {
    return <div className="p-4 text-muted-foreground">Loading map…</div>;
  }

  if (initialLoading) {
    return <div className="p-4 text-muted-foreground">Loading map data…</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Removed <LoadScript>; render map only when isLoaded */}
      <GoogleMap
        key={`map-${activeLayer}`}
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {/* Render markers for water sampling points */}
        {waterPoints.filter(p => p.lat && p.lng).map((point) => (
          <Marker
            key={point.id}
            position={{ lat: point.lat, lng: point.lng }}
            icon={getMarkerIcon(point, point.id === hoveredMarkerId)}
            onClick={() => handleMarkerClick(point)}
            onMouseOver={() => handleMarkerHover(point)}
            onMouseOut={handleMarkerLeave}
            title={point.locationName}
          />
        ))}

        {/* Render markers for pollution indicators (point geometry only) */}
        {pollutionIndicators.filter(p => p.geometryType === "point" && p.lat && p.lng).map((point) => (
          <Marker
            key={point.id}
            position={{ lat: point.lat!, lng: point.lng! }}
            icon={getMarkerIcon(point, point.id === hoveredMarkerId)}
            onClick={() => handleMarkerClick(point)}
            onMouseOver={() => handleMarkerHover(point)}
            onMouseOut={handleMarkerLeave}
            title={point.title}
          />
        ))}

        {/* Render markers for risk layers - calculate center point for polygons/lines */}
        {riskLayers.map((layer) => {
          try {
            let lat: number | undefined;
            let lng: number | undefined;

            if (layer.geometryType === "point" && layer.lat && layer.lng) {
              // Direct point geometry (if lat/lng fields exist)
              lat = layer.lat;
              lng = layer.lng;
            } else if (layer.geometryType === "polygon" && layer.polygon?.coordinates?.[0]) {
              // Calculate center of polygon
              const coords = layer.polygon.coordinates[0];
              const lats = coords.map((c: [number, number]) => c[1]).filter((v: number) => v);
              const lngs = coords.map((c: [number, number]) => c[0]).filter((v: number) => v);
              if (lats.length > 0 && lngs.length > 0) {
                lat = lats.reduce((a: number, b: number) => a + b, 0) / lats.length;
                lng = lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length;
              }
            } else if (layer.geometryType === "line" && layer.polygon?.coordinates) {
              // Calculate center of line
              const coords = layer.polygon.coordinates;
              const lats = coords.map((c: [number, number]) => c[1]).filter((v: number) => v);
              const lngs = coords.map((c: [number, number]) => c[0]).filter((v: number) => v);
              if (lats.length > 0 && lngs.length > 0) {
                lat = lats.reduce((a: number, b: number) => a + b, 0) / lats.length;
                lng = lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length;
              }
            }

            if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
              console.log(`Skipping risk layer ${layer.riskType} - no valid coordinates`);
              return null;
            }

            return (
              <Marker
                key={layer.id}
                position={{ lat, lng }}
                icon={getMarkerIcon(layer, layer.id === hoveredMarkerId)}
                onClick={() => handleMarkerClick(layer)}
                onMouseOver={() => handleMarkerHover(layer)}
                onMouseOut={handleMarkerLeave}
                title={layer.title}
              />
            );
          } catch (err) {
            console.error("Error rendering risk layer marker:", layer.id, err);
            return null;
          }
        })}

        {/* Render polygons for pollution indicators */}
        {pollutionIndicators.filter(p => p.geometryType === "polygon" && p.polygon).map((indicator) => {
          try {
            const coords = indicator.polygon?.coordinates?.[0]?.map((coord: [number, number]) => ({
              lat: coord?.[1] ?? 0,
              lng: coord?.[0] ?? 0
            })).filter((c: any) => c.lat !== 0 && c.lng !== 0) || [];
            
            if (coords.length < 3) return null;
            
            const color = indicator.severity === "low" ? "#fb923c"
              : indicator.severity === "medium" ? "#f97316"
              : indicator.severity === "high" ? "#dc2626"
              : "#991b1b";

            return (
              <Polygon
                key={indicator.id}
                paths={coords}
                options={{
                  fillColor: color,
                  fillOpacity: 0.35,
                  strokeColor: color,
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  clickable: true,
                }}
                onClick={() => handleMarkerClick(indicator)}
              />
            );
          } catch (err) {
            console.error("Error rendering pollution polygon:", indicator.id, err);
            return null;
          }
        })}



        {clickedLocation && (
          <InfoWindow
            position={{ lat: clickedLocation.lat, lng: clickedLocation.lng }}
            onCloseClick={() => {
              setClickedLocation(null);
            }}
          >
            <div className="p-3 min-w-[200px]">
              <div className="font-semibold text-sm mb-2">
                {t.map.reportPromptTitle[language]}
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                {t.map.reportPromptBody[language]}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setShowReportModal(true);
                    setClickedLocation(null); // Close the InfoWindow when modal opens
                    setSelectedPoint(null); // Close any hover InfoWindow
                    if (hoverTimeout) {
                      clearTimeout(hoverTimeout);
                      setHoverTimeout(null);
                    }
                  }}
                  className="flex-1"
                >
                  {t.map.reportYes[language]}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setClickedLocation(null);
                  }}
                  className="flex-1"
                >
                  {t.map.cancel[language]}
                </Button>
              </div>
            </div>
          </InfoWindow>
        )}
        {/* Info window for selected point */}
        {selectedPoint &&
          (() => {
            try {
              const lat = selectedPoint.entityType === "water" ? selectedPoint.lat
                : selectedPoint.entityType === "pollution" && selectedPoint.geometryType === "point" ? selectedPoint.lat
                : selectedPoint.entityType === "risk" && selectedPoint.geometryType === "point" ? selectedPoint.lat
                : null;
              const lng = selectedPoint.entityType === "water" ? selectedPoint.lng
                : selectedPoint.entityType === "pollution" && selectedPoint.geometryType === "point" ? selectedPoint.lng
                : selectedPoint.entityType === "risk" && selectedPoint.geometryType === "point" ? selectedPoint.lng
                : null;
              
              if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') return null;
              
              const position = getPixelPosition(lat, lng);
              if (!position) return null;

              const title = selectedPoint.entityType === "water" ? (selectedPoint.locationName || "Water Point")
                : (selectedPoint.title || "Map Point");
              
              const date = (() => {
                try {
                  if (selectedPoint.entityType === "water" && selectedPoint.testDate) {
                    return new Date(selectedPoint.testDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
                  } else if (selectedPoint.entityType === "pollution" && selectedPoint.reportedAt) {
                    return new Date(selectedPoint.reportedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
                  }
                  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
                } catch (err) {
                  console.error("Error formatting date:", err);
                  return "N/A";
                }
              })();

              const statusBadge = (() => {
                try {
                  if (selectedPoint.entityType === "water" && selectedPoint.status) {
                    return t?.map?.status?.[selectedPoint.status]?.[language] || selectedPoint.status;
                  } else if (selectedPoint.entityType === "pollution" && selectedPoint.severity) {
                    return selectedPoint.severity.charAt(0).toUpperCase() + selectedPoint.severity.slice(1);
                  } else if (selectedPoint.entityType === "risk" && selectedPoint.riskLevel) {
                    return selectedPoint.riskLevel.charAt(0).toUpperCase() + selectedPoint.riskLevel.slice(1);
                  }
                  return "Unknown";
                } catch (err) {
                  console.error("Error determining status badge:", err);
                  return "Unknown";
                }
              })();

            return (
              <div
                style={{
                  position: "absolute",
                  left: `${position.x}px`,
                  top: `${position.y - 10}px`,
                  transform: "translate(-50%, -100%)",
                  pointerEvents: "auto",
                  zIndex: 1000,
                }}
                onMouseEnter={() => {
                  if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    setHoverTimeout(null);
                  }
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setSelectedPoint(null);
                  }, 300);
                  setHoverTimeout(timeout);
                }}
              >
                <div className="bg-white rounded-lg shadow-lg min-w-[220px] border border-gray-200 overflow-hidden">
                  <div className="p-3">
                    <h3 className="font-semibold text-base mb-2 text-gray-900 leading-tight">
                      {title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">
                      {date}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="text-xs font-medium"
                      >
                        {statusBadge}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
            } catch (err) {
              console.error("Error rendering tooltip:", err);
              return null;
            }
          })()}
      </GoogleMap>

      <MapClickReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setClickedLocation(null);
        }}
        coordinates={clickedLocation}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}
