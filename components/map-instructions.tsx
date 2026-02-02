"use client"

import { useLanguage } from "@/contexts/language-context"
import { Info } from "lucide-react"

export function MapInstructions() {
  const { t, language } = useLanguage()
  
  return (
    <div className="space-y-3 text-sm">
      <ol className="space-y-2 list-decimal list-inside">
        <li className="text-xs leading-relaxed">
          {t.map.instructionStep1[language]}
        </li>
        <li className="text-xs leading-relaxed">
          {t.map.instructionStep2[language]}
        </li>
        <li className="text-xs leading-relaxed">
          {t.map.instructionStep3[language]}
        </li>
        <li className="text-xs leading-relaxed">
          {t.map.instructionStep4[language]}
        </li>
        <li className="text-xs leading-relaxed">
          {t.map.instructionStep5[language]}
        </li>
      </ol>
    </div>
  )
}
