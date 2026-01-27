"use client"

import { useLanguage } from "@/contexts/language-context"

export function MapLegend() {
  const { t, language } = useLanguage()
  return (
    <div className="space-y-3 text-sm">
      <div>
        <div className="font-semibold mb-2">{t.map.legendStatusTitle[language]}</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-xs">{t.map.status.normal[language]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-xs">{t.map.status.warning[language]}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-xs">{t.map.status.problem[language]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
