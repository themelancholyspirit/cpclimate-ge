"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface MapDataModalProps {
  point: {
    entityType: "water" | "pollution" | "risk";
    geometryType: "point" | "polygon" | "line";
    lat?: number;
    lng?: number;
    // Water-specific fields
    locationName?: string;
    status?: "normal" | "risk" | "problematic";
    summaryText?: string;
    testDate?: string;
    citizenImpactExplanation?: string;
    // Pollution-specific fields
    title?: string;
    indicatorType?: string;
    sourceType?: string;
    severity?: "low" | "medium" | "high";
    reportedAt?: string;
    description?: string;
    // Risk-specific fields
    riskType?: string;
    riskLevel?: "low" | "high";
    channelStatus?: "existing" | "blocked" | "damaged";
  };
  onClose: () => void;
}

export function MapDataModal({ point, onClose }: MapDataModalProps) {
  const { t, language } = useLanguage();
  
  // Determine entity type and extract relevant data
  const isWaterPoint = point.entityType === "water";
  const isPollutionIndicator = point.entityType === "pollution";
  const isRiskLayer = point.entityType === "risk";

  const getDetailedInfo = () => {
    if (isWaterPoint) {
      return {
        title: point.locationName || "Water Sampling Point",
        details: [
          {
            label: "Test Date",
            value: point.testDate 
              ? new Date(point.testDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "N/A",
          },
          {
            label: "Status",
            value: point.status 
              ? point.status.charAt(0).toUpperCase() + point.status.slice(1)
              : "Unknown",
          },
        ],
        summaryText: point.summaryText || "",
        citizenImpact: point.citizenImpactExplanation || "",
      };
    }

    if (isPollutionIndicator) {
      return {
        title: point.title || "Pollution Indicator",
        details: [
          {
            label: "Reported At",
            value: point.reportedAt
              ? new Date(point.reportedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })
              : "N/A",
          },
          {
            label: "Source",
            value: point.sourceType
              ? point.sourceType.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
              : "Unknown",
          },
          {
            label: "Severity",
            value: point.severity
              ? point.severity.charAt(0).toUpperCase() + point.severity.slice(1)
              : "Unknown",
          },
        ],
        description: point.description || "",
      };
    }

    if (isRiskLayer) {
      return {
        title: point.title || "Risk Layer",
        details: [
          {
            label: "Risk Level",
            value: point.riskLevel
              ? point.riskLevel.charAt(0).toUpperCase() + point.riskLevel.slice(1)
              : "Unknown",
          },
          ...(point.channelStatus ? [{
            label: "Channel Status",
            value: point.channelStatus.charAt(0).toUpperCase() + point.channelStatus.slice(1),
          }] : []),
        ],
        description: point.description || "",
      };
    }

    return {
      title: point.title || "Unknown",
      details: [],
      description: point.description || "",
    };
  };

  const info = getDetailedInfo();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <Card className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{info.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {point.geometryType === "point" 
                  ? `Lat: ${point.lat?.toFixed(4)}, Lng: ${point.lng?.toFixed(4)}`
                  : `${point.geometryType.charAt(0).toUpperCase() + point.geometryType.slice(1)} overlay`}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {(isWaterPoint || isPollutionIndicator) && (
            <Badge
              variant={
                isWaterPoint 
                  ? (point.status === "normal" ? "default" : "destructive")
                  : (point.severity === "low" ? "default" : "destructive")
              }
              className={
                isWaterPoint
                  ? point.status === "normal"
                    ? "bg-green-600 w-fit"
                    : point.status === "risk"
                      ? "bg-yellow-600 w-fit"
                      : "bg-red-600 w-fit"
                  : point.severity === "low"
                    ? "bg-orange-500 w-fit"
                    : point.severity === "medium"
                      ? "bg-red-500 w-fit"
                      : "bg-red-700 w-fit"
              }
            >
              {isWaterPoint 
                ? (point.status ? point.status.charAt(0).toUpperCase() + point.status.slice(1) : "Unknown")
                : (point.severity ? point.severity.charAt(0).toUpperCase() + point.severity.slice(1) : "Unknown")}
            </Badge>
          )}
          {isRiskLayer && point.riskLevel && (
            <Badge
              variant={point.riskLevel === "low" ? "default" : "destructive"}
              className={
                point.riskLevel === "low"
                  ? "bg-yellow-600 w-fit"
                  : "bg-red-600 w-fit"
              }
            >
              {point.riskLevel.charAt(0).toUpperCase() + point.riskLevel.slice(1)} Risk
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="space-y-2">
              {info.details.map((detail, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{detail.label}:</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          {isWaterPoint && (
            <>
              {info.summaryText && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold mb-2 text-sm">Summary</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.summaryText}
                  </p>
                </div>
              )}
              {info.citizenImpact && (
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold mb-2 text-sm">Impact on Citizens</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.citizenImpact}
                  </p>
                </div>
              )}
            </>
          )}

          {(isPollutionIndicator || isRiskLayer) && info.description && (
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold mb-2 text-sm">
                {t.modals.dataModal.description[language]}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {info.description}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-transparent"
              variant="outline"
              onClick={onClose}
            >
              {t.modals.dataModal.close[language]}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
