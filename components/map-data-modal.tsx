"use client";

import { Button } from "@/components/ui/button";
import { X, MapPin, Calendar, Radio, AlertCircle, Info, ChevronRight } from "lucide-react";
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

const entityColors: Record<EntityType, { bg: string; accent: string; badge: string }> = {
  water:     { bg: "from-sky-950/80 to-slate-950/90",   accent: "text-sky-400",     badge: "bg-sky-500/20 text-sky-300 border-sky-500/30" },
  pollution: { bg: "from-amber-950/80 to-slate-950/90", accent: "text-amber-400",   badge: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  risk:      { bg: "from-rose-950/80 to-slate-950/90",  accent: "text-rose-400",    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30" },
  report:    { bg: "from-violet-950/80 to-slate-950/90",accent: "text-violet-400",  badge: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
};

const severityConfig: Record<string, { label: string; color: string }> = {
  low:      { label: "Low",      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  medium:   { label: "Medium",   color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  high:     { label: "High",     color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  critical: { label: "Critical", color: "bg-red-500/20 text-red-300 border-red-500/30" },
};

export function MapDataModal({ point, onClose }: MapDataModalProps) {
  const { language } = useLanguage();
  const colors = entityColors[point.entityType] ?? entityColors.report;

  const title =
    problemLabels[point.title as keyof typeof problemLabels]?.[language] ??
    (language === "en" ? "Unknown Report" : "უცნობი შეტყობინება");

  const hasCoords = point.lat !== undefined && point.lng !== undefined;
  const coordString = hasCoords
    ? `${point.lat!.toFixed(5)}, ${point.lng!.toFixed(5)}`
    : language === "en" ? "Location unavailable" : "ლოკაცია მიუწვდომელია";

  const severity = point.severity ?? point.riskLevel;
  const severityInfo = severity ? severityConfig[severity] : null;

  const formattedDate = point.createdAt
    ? new Date(point.createdAt).toLocaleString(language === "ka" ? "ka-GE" : "en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
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
          className={`
            relative overflow-hidden rounded-t-2xl sm:rounded-2xl
            bg-gradient-to-br ${colors.bg}
            border border-white/10 shadow-2xl shadow-black/60
            backdrop-blur-xl
          `}
        >
          {/* Decorative top bar */}
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent ${colors.accent} opacity-60`} />

          {/* Drag handle (mobile) */}
          <div className="sm:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
            <div className="flex items-start gap-3 min-w-0">
              {/* Entity type icon badge */}
              <div className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${colors.badge}`}>
                {point.entityType === "water"     && <span className="text-base">💧</span>}
                {point.entityType === "pollution" && <span className="text-base">⚠️</span>}
                {point.entityType === "risk"      && <span className="text-base">🌊</span>}
                {point.entityType === "report"    && <span className="text-base">📋</span>}
              </div>

              <div className="min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${colors.accent}`}>
                  {point.entityType}
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
              className="flex-shrink-0 -mt-1 -mr-1 h-8 w-8 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-white/8" />

          {/* Body */}
          <div className="px-5 py-4 space-y-3">

            {/* Coordinates */}
            <div className="flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/8 px-3 py-2.5">
              <MapPin className={`h-4 w-4 flex-shrink-0 ${colors.accent}`} />
              <span className="text-white/90 text-sm font-mono tracking-tight truncate">{coordString}</span>
              {hasCoords && (
                <a
                  href={`https://maps.google.com?q=${point.lat},${point.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`ml-auto flex-shrink-0 text-xs ${colors.accent} hover:underline flex items-center gap-0.5`}
                  aria-label="Open in Google Maps"
                >
                  {language === "en" ? "Maps" : "რუკა"}
                  <ChevronRight className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-2">
              {/* Date */}
              <div className="flex flex-col gap-1 rounded-xl bg-white/5 border border-white/8 px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-white/40 text-xs uppercase tracking-wider font-medium">
                    {language === "en" ? "Reported" : "თარიღი"}
                  </span>
                </div>
                <span className="text-white/90 text-xs font-medium leading-snug">{formattedDate}</span>
              </div>

              {/* Source */}
              <div className="flex flex-col gap-1 rounded-xl bg-white/5 border border-white/8 px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-white/40 text-xs uppercase tracking-wider font-medium">
                    {language === "en" ? "Source" : "წყარო"}
                  </span>
                </div>
                <span className="text-white/90 text-xs font-medium leading-snug">
                  {language === "en" ? "Citizen Report" : "მოქალაქის შეტყობინება"}
                </span>
              </div>
            </div>

            {/* Severity badge */}
            {severityInfo && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-white/40 flex-shrink-0" />
                <span className="text-white/40 text-xs uppercase tracking-wider font-medium">
                  {language === "en" ? "Severity" : "სიმძიმე"}
                </span>
                <span className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full border ${severityInfo.color}`}>
                  {severityInfo.label}
                </span>
              </div>
            )}

            {/* Description */}
            {point.description && (
              <div className="rounded-xl bg-white/5 border border-white/8 px-3 py-3 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-white/40 text-xs uppercase tracking-wider font-medium">
                    {language === "en" ? "Description" : "აღწერა"}
                  </span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            )}

            {/* Citizen Impact */}
            {point.citizenImpactExplanation && (
              <div className="rounded-xl bg-white/5 border border-white/8 px-3 py-3 space-y-1.5">
                <span className="text-white/40 text-xs uppercase tracking-wider font-medium block">
                  {language === "en" ? "Citizen Impact" : "მოქალაქეებზე გავლენა"}
                </span>
                <p className="text-white/80 text-sm leading-relaxed">
                  {point.citizenImpactExplanation}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-5">
            <button
              onClick={onClose}
              className={`
                w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                bg-white/8 hover:bg-white/14 active:bg-white/20
                border border-white/10 hover:border-white/20
                text-white/70 hover:text-white
              `}
            >
              {language === "en" ? "Close" : "დახურვა"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}