"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { X, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
export type EntityType = "water" | "pollution" | "risk" | "report";

export type GeometryType = "point" | "polygon" | "line";
export interface MapEntity {
  id: string;
  entityType: EntityType;
  geometryType?: GeometryType;

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
}

interface MapDataModalProps {
  point: MapEntity;
  onClose: () => void;
}

const problem = {
  water: {
    en: "Water Quality",
    ka: "წყლის ხარისხი",
  },
  waste: {
    en: "Waste Accumulation",
    ka: "ნარჩენების დაგროვება",
  },
  odor: {
    en: "Odor/Stagnation",
    ka: "სუნი/სტაგნაცია",
  },
  drainage: {
    en: "Drainage Channels",
    ka: "სანიაღვრე არხები",
  },
  flooding: {
    en: "Flood Zones",
    ka: "დატბორვის ზონები",
  },
  channels: {
    en: "All Pollution",
    ka: "ყველა დაბინძურება",
  },
  sea: {
    en: "Sea Water Intrusion",
    ka: "ზღვის წყლის შეჭრა",
  },
  erosion: {
    en: "Erosion Sections",
    ka: "ეროზიის მონაკვეთები",
  },
  risk: {
    en: "Other Climate Risks",
    ka: "სხვა კლიმატის რისკები",
  },
};

export function MapDataModal({ point, onClose }: MapDataModalProps) {
  const { t, language } = useLanguage();

  const capitalize = (str?: string | null) =>
    str && typeof str === "string" && str.length > 0
      ? str.charAt(0).toUpperCase() + str.slice(1)
      : "Unknown";

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">
                {language === "en" ? problem[point.title as keyof typeof problem]?.en : problem[point.title as keyof typeof problem]?.ka}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {point.lat !== undefined && point.lng !== undefined
                  ? `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`
                  : "Location unknown"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {point.description && (
            <div>
              <h4 className="font-semibold mb-1 text-sm">
                {language === "en" ? "Description" : "აღწერა"}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
