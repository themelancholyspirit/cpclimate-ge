"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface MapDataModalProps {
  point: any
  onClose: () => void
}

export function MapDataModal({ point, onClose }: MapDataModalProps) {
  const { t, language } = useLanguage()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{point.title}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Badge
            variant={point.status === "normal" ? "default" : "destructive"}
            className={
              point.status === "normal"
                ? "bg-green-600 w-fit"
                : point.status === "warning"
                  ? "bg-yellow-600 w-fit"
                  : "w-fit"
            }
          >
            {t.map.status[point.status][language]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-transparent" variant="outline" onClick={onClose}>
              {t.modals.dataModal.close[language]}
            </Button>
            <Button className="flex-1">{t.modals.dataModal.viewFullReport[language]}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
