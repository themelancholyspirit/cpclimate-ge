"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface MapDataModalProps {
  point: any
  onClose: () => void
}

export function MapDataModal({ point, onClose }: MapDataModalProps) {
  const { t, language } = useLanguage()
  const getDetailedInfo = () => {
    switch (point.type) {
      case "water":
        return {
          title: t.modals.dataModal.titles.water[language],
          details: [
            { label: "pH Level", value: "7.2" },
            { label: "Dissolved Oxygen", value: "8.5 mg/L" },
            { label: "Turbidity", value: point.status === "problem" ? "High" : "Normal" },
            { label: "Last Tested", value: "Dec 20, 2024" },
          ],
          explanation:
            point.status === "problem"
              ? (language === "ka" ? "ამ ლოკაციაზე მაღალი დაბინძურების დონეა დაფიქსირებული. საჭიროა დაუყოვნებელი ყურადღება." : "This location shows elevated pollution levels. Immediate attention required.")
              : point.status === "warning"
                ? (language === "ka" ? "წყლის ხარისხის პარამეტრები საზრუნავისკენ მიდის. მონიტორინგი გრძელდება." : "Water quality parameters are approaching concerning levels. Monitoring continues.")
                : (language === "ka" ? "წყლის ხარისხი აკმაყოფილებს მისაღებ სტანდარტებს ამ მონიტორინგის პუნქტზე." : "Water quality meets acceptable standards for this monitoring point."),
        }
      case "pollution":
        return {
          title: t.modals.dataModal.titles.pollution[language],
          details: [
            { label: "Type", value: "Waste Accumulation" },
            { label: "Severity", value: "High" },
            { label: t.modals.dataModal.reportedBy[language], value: "Citizen Observer" },
            { label: t.modals.dataModal.dateReported[language], value: "Dec 18, 2024" },
          ],
          explanation:
            (language === "ka"
              ? "რამდენიმე მოქალაქემ მოახსენა უკანონო ნარჩენების დაყრა ამ ლოკაციაზე. ადგილობრივი ხელისუფლება ინფორმირებულია."
              : "Multiple citizens have reported illegal waste dumping at this location. Local authorities have been notified."),
        }
      case "risk":
        return {
          title: t.modals.dataModal.titles.risk[language],
          details: [
            { label: "Risk Type", value: "Flood Zone" },
            { label: "Risk Level", value: "Medium" },
            { label: "Vulnerable Area", value: "0.5 km²" },
            { label: "Last Assessment", value: "Dec 2024" },
          ],
          explanation:
            (language === "ka"
              ? "ეს ტერიტორია მიდრეკილია წყალდიდობისკენ ძლიერი ნალექების დროს. რეკომენდებულია ინფრასტრუქტურის გაუმჯობესება."
              : "This area is prone to flooding during heavy rainfall events. Infrastructure improvements are recommended."),
        }
      default:
        return {
          title: t.modals.dataModal.titles.infrastructure[language],
          details: [
            { label: "Type", value: "Drainage Channel" },
            { label: "Status", value: "Blocked" },
            { label: "Priority", value: "High" },
            { label: "Last Inspection", value: "Dec 15, 2024" },
          ],
          explanation: (language === "ka" ? "ამ დრენაჟულ არხს აუცილებელი ტექნიკური მომსახურება სჭირდება წყალდიდობის თავიდან ასაცილებლად." : "This drainage channel requires immediate maintenance to prevent flooding."),
        }
    }
  }

  const info = getDetailedInfo()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{point.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
              </CardDescription>
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
            <h4 className="font-semibold mb-3">{info.title}</h4>
            <div className="space-y-2">
              {info.details.map((detail, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{detail.label}:</span>
                  <span className="font-medium">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h4 className="font-semibold mb-2 text-sm">{t.modals.dataModal.whatThisMeans[language]}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{info.explanation}</p>
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
