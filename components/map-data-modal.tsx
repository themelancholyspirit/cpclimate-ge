"use client";

import { Button } from "@/components/ui/button";
import {
  X,
  MapPin,
  Calendar,
  Antenna,
  AlertCircle,
  Info,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useEffect } from "react";

export type EntityType = "water" | "pollution" | "risk" | "report";
export type GeometryType = "point" | "polygon" | "line";

export interface MapEntity {
  id: string;
  entityType: EntityType;
  geometryType?: GeometryType;
  createdAt?: string;
  lat?: number;
  lng?: number;
  polygon?: { type: string; coordinates: any[] };
  title?: string;
  description?: string;
  locationName?: string;
  status?: "normal" | "risk" | "problematic";
  indicatorType?:
    | "waste_accumulation"
    | "illegal_discharge"
    | "odor_stagnation";
  severity?: "low" | "medium" | "high" | "critical";
  riskType?:
    | "flood_zone"
    | "drainage_channel"
    | "sea_intrusion"
    | "erosion_section";
  riskLevel?: "low" | "medium" | "high" | "critical";
  channelStatus?: "existing" | "blocked" | "damaged";
  reportStatus?: string;
  reportedAt?: string;
  testDate?: string;
  citizenImpactExplanation?: string;
  sourceType?: string;
}

interface MapDataModalProps {
  point: MapEntity;
  onClose: () => void;
  isOpen: boolean;
}

const BLUE = "#000000";

const problemLabels = {
  water: { en: "Water Quality", ka: "წყლის ხარისხი" },
  waste: { en: "Waste Accumulation", ka: "ნარჩენების დაგროვება" },
  odor: { en: "Odor / Stagnation", ka: "სუნი / სტაგნაცია" },
  dump: { en: "Illegal Dumping", ka: "არალეგალური ჩაღვრა" },
  flooding: { en: "Flood Zones", ka: "დატბორვის ზონები" },
  channels: { en: "Drainage channels", ka: "სანიაღვრე არხები" },
  sea: { en: "Sea Water Intrusion", ka: "ზღვის წყლის შეჭრა" },
  erosion: { en: "Erosion Sections", ka: "ეროზიის მონაკვეთები" },
};

const entityTypeLabel: Record<EntityType, { en: string; ka: string }> = {
  water: { en: "Water", ka: "წყალი" },
  pollution: { en: "Pollution", ka: "დაბინძურება" },
  risk: { en: "Risk", ka: "რისკი" },
  report: { en: "Report", ka: "შეტყობინება" },
};

const severityLabels: Record<string, { en: string; ka: string }> = {
  low: { en: "Low", ka: "დაბალი" },
  medium: { en: "Medium", ka: "საშუალო" },
  high: { en: "High", ka: "მაღალი" },
  critical: { en: "Critical", ka: "კრიტიკული" },
};

export function MapDataModal({ point, onClose, isOpen }: MapDataModalProps) {
  const { language } = useLanguage();

  const title =
    problemLabels[point.title as keyof typeof problemLabels]?.[language] ??
    (language === "en" ? "Unknown Report" : "უცნობი შეტყობინება");

  const hasCoords = point.lat !== undefined && point.lng !== undefined;
  const coordString = hasCoords
    ? `${point.lat!.toFixed(5)}, ${point.lng!.toFixed(5)}`
    : language === "en"
      ? "Location unavailable"
      : "ლოკაცია მიუწვდომელია";

  const severity = point.severity ?? point.riskLevel;
  const severityLabel = severity
    ? (severityLabels[severity]?.[language] ?? severity)
    : null;

  const formattedDate = point.createdAt
    ? new Date(point.createdAt).toLocaleString(
        language === "ka" ? "ka-GE" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      )
    : "—";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className="relative overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
          style={{ border: `1.5px solid ${BLUE}` }}
        >
          {/* Blue header strip */}
          <div className="px-5 pt-4 pb-3" style={{ backgroundColor: BLUE }}>
            {/* Drag handle (mobile only) */}
            <div className="sm:hidden flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                {/* Icon badge */}
                <div
                  className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-white/60">
                    {language === "en" ? "Report" : "რეპორტი"}
                  </p>
                  <h2 className="text-white font-bold text-base leading-tight line-clamp-2">
                    {title}
                  </h2>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="flex-shrink-0 -mt-1 -mr-1 h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3 bg-white">
            {/* Coordinates */}
            <div
              className="flex flex-col gap-1 rounded-xl px-3 py-2.5"
              style={{
                border: `1px solid ${BLUE}20`,
                backgroundColor: `${BLUE}08`,
              }}
            >
              <div className="flex items-center gap-1.5">
                <MapPin
                  className="h-3.5 w-3.5"
                  style={{ color: `${BLUE}80` }}
                />
                <span
                  className="text-xs uppercase tracking-wider font-medium"
                  style={{ color: `${BLUE}80` }}
                >
                  {language === "en" ? "Coordinates" : "კოორდინატები"}
                </span>
              </div>
              <span
                className="text-xs font-medium leading-snug"
                style={{ color: BLUE }}
              >
                {coordString}
              </span>
            </div>

            {/* Date + Source */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="flex flex-col gap-1 rounded-xl px-3 py-2.5"
                style={{
                  border: `1px solid ${BLUE}20`,
                  backgroundColor: `${BLUE}08`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className="h-3.5 w-3.5"
                    style={{ color: `${BLUE}80` }}
                  />
                  <span
                    className="text-xs uppercase tracking-wider font-medium"
                    style={{ color: `${BLUE}80` }}
                  >
                    {language === "en" ? "Reported" : "თარიღი"}
                  </span>
                </div>
                <span
                  className="text-xs font-medium leading-snug"
                  style={{ color: BLUE }}
                >
                  {formattedDate}
                </span>
              </div>

              <div
                className="flex flex-col gap-1 rounded-xl px-3 py-2.5"
                style={{
                  border: `1px solid ${BLUE}20`,
                  backgroundColor: `${BLUE}08`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Antenna
                    className="h-3.5 w-3.5"
                    style={{ color: `${BLUE}80` }}
                  />
                  <span
                    className="text-xs uppercase tracking-wider font-medium"
                    style={{ color: `${BLUE}80` }}
                  >
                    {language === "en" ? "Source" : "წყარო"}
                  </span>
                </div>
                <span
                  className="text-xs font-medium leading-snug"
                  style={{ color: BLUE }}
                >
                  {language === "en"
                    ? "Citizen Report"
                    : "მოქალაქის შეტყობინება"}
                </span>
              </div>
            </div>

            {/* Description */}
            {point.description && (
              <div
                className="rounded-xl px-3 py-3 space-y-1.5"
                style={{
                  border: `1px solid ${BLUE}20`,
                  backgroundColor: `${BLUE}08`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Info
                    className="h-3.5 w-3.5"
                    style={{ color: `${BLUE}80` }}
                  />
                  <span
                    className="text-xs uppercase tracking-wider font-medium"
                    style={{ color: `${BLUE}80` }}
                  >
                    {language === "en" ? "Description" : "აღწერა"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: BLUE }}>
                  {point.description}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 bg-white">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors text-white"
              style={{ backgroundColor: BLUE }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {language === "en" ? "Close" : "დახურვა"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
