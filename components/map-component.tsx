"use client";

import { useCallback, useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Badge } from "@/components/ui/badge";
import { MapClickReportModal } from "./map-click-report-modal";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface MapPoint {
  id: string;
  type: "water" | "pollution" | "risk" | "infrastructure";
  lat: number;
  lng: number;
  status: "normal" | "warning" | "problem";
  title: string;
  description: string;
}

interface MapComponentProps {
  activeLayer: string;
  onPointClick: (point: MapPoint | null) => void;
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
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const { t, language } = useLanguage();

  // Fetch map points from API
  useEffect(() => {
    async function fetchMapPoints() {
      try {
        setLoading(true);
        const url =
          activeLayer === "all"
            ? "/api/map-points"
            : `/api/map-points?type=${activeLayer}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setMapPoints(data);
        }
      } catch (error) {
        console.error("Error fetching map points:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMapPoints();
  }, [activeLayer]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
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

  const getRedMarkerIcon = useCallback((): google.maps.Symbol | undefined => {
    // Check if Google Maps API is loaded
    if (typeof window === "undefined" || !window.google?.maps?.SymbolPath) {
      return undefined;
    }
    return {
      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
      fillColor: "#ef4444", // red pin
      fillOpacity: 1,
      strokeColor: "#000000", // black outline
      strokeWeight: 2,
      scale: 1.5,
      anchor: new google.maps.Point(12, 24),
    };
  }, []);

  const filteredPoints = mapPoints;

  // Get marker icon based on status
  // Callback when map loads
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      // Optionally fit bounds to show all visible points
      if (filteredPoints.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        filteredPoints.forEach((point) => {
          bounds.extend({ lat: point.lat, lng: point.lng });
        });
        // Only fit bounds if there are points, and don't override restriction
        try {
          map.fitBounds(bounds);
        } catch (e) {
          // If bounds conflict with restriction, just center on first point
          map.setCenter({
            lat: filteredPoints[0].lat,
            lng: filteredPoints[0].lng,
          });
        }
      }
    },
    [filteredPoints],
  );

  // Callback when map unmounts
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker click
  const handleMarkerClick = (point: MapPoint) => {
    setSelectedPoint(point);
    onPointClick(point);
  };

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
    (status: string): google.maps.Symbol | undefined => {
      // Check if Google Maps API is loaded
      if (typeof window === "undefined" || !window.google?.maps?.SymbolPath) {
        return undefined;
      }

      const color =
        status === "normal"
          ? "#22c55e" // green
          : status === "warning"
            ? "#eab308" // yellow
            : "#ef4444"; // red

      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
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

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading map data…</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Removed <LoadScript>; render map only when isLoaded */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {/* Render markers for filtered points */}
        {filteredPoints.map((point) => (
          <Marker
            key={point.id}
            position={{ lat: point.lat, lng: point.lng }}
            icon={getMarkerIcon(point.status)}
            onClick={() => handleMarkerClick(point)}
            title={point.title}
          />
        ))}

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
        {selectedPoint && (
          <InfoWindow
            position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
            onCloseClick={() => {
              setSelectedPoint(null);
              onPointClick(null);
            }}
          >
            <div className="p-2 min-w-[200px]">
              <div className="font-semibold text-sm mb-1">
                {selectedPoint.title}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {selectedPoint.description}
              </div>
              <Badge
                variant={
                  selectedPoint.status === "normal" ? "default" : "destructive"
                }
                className="text-xs"
              >
                {t.map.status[selectedPoint.status][language]}
              </Badge>
            </div>
          </InfoWindow>
        )}
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
