"use client";

import { Button } from "@/components/ui/button";
import { X, MapPin, Calendar, Antenna, AlertCircle, Info, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

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
  indicatorType?: "waste_accumulation" | "illegal_discharge" | "odor_stagnation";
  severity?: "low" | "medium" | "high" | "critical";
  riskType?: "flood_zone" | "drainage_channel" | "sea_intrusion" | "erosion_section";
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
}

const problemLabels = {
  water:    { en: "Water Quality",       ka: "წყლის ხარისხი" },
  waste:    { en: "Waste Accumulation",  ka: "ნარჩენების დაგროვება" },
  odor:     { en: "Odor / Stagnation",   ka: "სუნი / სტაგნაცია" },
  drainage: { en: "Drainage Channels",   ka: "სანიაღვრე არხები" },
  flooding: { en: "Flood Zones",         ka: "დატბორვის ზონები" },
  channels: { en: "All Pollution",       ka: "ყველა დაბინძურება" },
  sea:      { en: "Sea Water Intrusion", ka: "ზღვის წყლის შეჭრა" },
  erosion:  { en: "Erosion Sections",    ka: "ეროზიის მონაკვეთები" },
  risk:     { en: "Other Climate Risks", ka: "სხვა კლიმატის რისკები" },
};

const entityTypeLabel: Record<EntityType, { en: string; ka: string }> = {
  water:     { en: "Water",     ka: "წყალი" },
  pollution: { en: "Pollution", ka: "დაბინძურება" },
  risk:      { en: "Risk",      ka: "რისკი" },
  report:    { en: "Report",    ka: "შეტყობინება" },
};

const severityLabels: Record<string, { en: string; ka: string }> = {
  low:      { en: "Low",      ka: "დაბალი" },
  medium:   { en: "Medium",   ka: "საშუალო" },
  high:     { en: "High",     ka: "მაღალი" },
  critical: { en: "Critical", ka: "კრიტიკული" },
};

export function MapDataModal({ point, onClose }: MapDataModalProps) {
  const { language } = useLanguage();

  const title =
    problemLabels[point.title as keyof typeof problemLabels]?.[language] ??
    (language === "en" ? "Unknown Report" : "უცნობი შეტყობინება");

  const hasCoords = point.lat !== undefined && point.lng !== undefined;
  const coordString = hasCoords
    ? `${point.lat!.toFixed(5)}, ${point.lng!.toFixed(5)}`
    : language === "en" ? "Location unavailable" : "ლოკაცია მიუწვდომელია";

  const severity = point.severity ?? point.riskLevel;
  const severityLabel = severity
    ? severityLabels[severity]?.[language] ?? severity
    : null;

  const formattedDate = point.createdAt
    ? new Date(point.createdAt).toLocaleString(language === "ka" ? "ka-GE" : "en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <>
      {/* Backdrop — no blur */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal — bottom sheet on mobile, centered on sm+ */}
      <div
        className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="relative overflow-hidden rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">

          {/* Drag handle (mobile only) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-slate-600" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl border border-slate-600 bg-slate-800 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-slate-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest mb-0.5 text-slate-400">
                  {entityTypeLabel[point.entityType]?.[language] ?? point.entityType}
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
              className="flex-shrink-0 -mt-1 -mr-1 h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-slate-700" />

          {/* Body */}
          <div className="px-5 py-4 space-y-3">

            {/* Coordinates */}
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
              <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span className="text-slate-200 text-sm font-mono tracking-tight truncate">{coordString}</span>
              {hasCoords && (
                <a
                  href={`https://maps.google.com?q=${point.lat},${point.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto flex-shrink-0 text-xs text-slate-400 hover:text-white hover:underline flex items-center gap-0.5 transition-colors"
                >
                  {language === "en" ? "Maps" : "რუკა"}
                  <ChevronRight className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Date + Source */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">
                    {language === "en" ? "Reported" : "თარიღი"}
                  </span>
                </div>
                <span className="text-slate-200 text-xs font-medium leading-snug">{formattedDate}</span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Antenna className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">
                    {language === "en" ? "Source" : "წყარო"}
                  </span>
                </div>
                <span className="text-slate-200 text-xs font-medium leading-snug">
                  {language === "en" ? "Citizen Report" : "მოქალაქის შეტყობინება"}
                </span>
              </div>
            </div>

            {/* Severity */}
            {severityLabel && (
              <div className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5">
                <AlertCircle className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">
                  {language === "en" ? "Severity" : "სიმძიმე"}
                </span>
                <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-600 bg-slate-700 text-slate-200">
                  {severityLabel}
                </span>
              </div>
            )}

            {/* Description */}
            {point.description && (
              <div className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-3 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">
                    {language === "en" ? "Description" : "აღწერა"}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{point.description}</p>
              </div>
            )}

            {/* Citizen Impact */}
            {point.citizenImpactExplanation && (
              <div className="rounded-xl bg-slate-800 border border-slate-700 px-3 py-3 space-y-1.5">
                <span className="text-slate-500 text-xs uppercase tracking-wider font-medium block">
                  {language === "en" ? "Citizen Impact" : "მოქალაქეებზე გავლენა"}
                </span>
                <p className="text-slate-300 text-sm leading-relaxed">{point.citizenImpactExplanation}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white"
            >
              {language === "en" ? "Close" : "დახურვა"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}