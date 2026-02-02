"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, MapPin, Camera } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"

interface MapClickReportModalProps {
  isOpen: boolean
  onClose: () => void
  coordinates: { lat: number; lng: number } | null
  onSubmit: (data: ReportData) => void
}

interface ReportData {
  issueType: string
  description: string
  location: string
  photos?: File[]
  reporterName: string
  reporterEmail: string
  reporterPhone?: string
}

export function MapClickReportModal({
  isOpen,
  onClose,
  coordinates,
  onSubmit,
}: MapClickReportModalProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ReportData>({
    issueType: "",
    description: "",
    location: "",
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
  })


  useEffect(() => {
    console.log(formData)
  }, [formData])

  // Update coordinates when they change
  useEffect(() => {
    if (coordinates) {
      setFormData((prev) => ({
        ...prev,
        location: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`,
      }))
    }
  }, [coordinates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      // Show success toast
      toast({
        title: t.toast.reportSuccess.title[language],
        description: t.toast.reportSuccess.description[language],
      })
      // Reset form
      setFormData({
        issueType: "",
        description: "",
        location: "",
        reporterName: "",
        reporterEmail: "",
        reporterPhone: "",
      })
    } catch (error) {
      console.error('Error submitting report:', error)
      // Show error toast
      toast({
        title: t.toast.reportError.title[language],
        description: t.toast.reportError.description[language],
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{t.modals.clickReport.title[language]}</CardTitle>
              <CardDescription>
                {t.modals.clickReport.body[language]}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {coordinates && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              <span>Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="issueType">{t.report.issueType[language]}</Label>
              <select
                id="issueType"
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
                required
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
              >
                <option value="">{t.report.issueTypeSelect[language]}</option>
                <option value="water">{t.report.issueTypeOptions.water[language]}</option>
                <option value="waste">{t.report.issueTypeOptions.waste[language]}</option>
                <option value="odor">{t.report.issueTypeOptions.odor[language]}</option>
                <option value="drainage">{t.report.issueTypeOptions.drainage[language]}</option>
                <option value="flooding">{t.report.issueTypeOptions.flooding[language]}</option>
                <option value="other">{t.report.issueTypeOptions.other[language]}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t.report.locationDesc[language]}</Label>
              <Input
                id="location"
                placeholder={t.report.locationPlaceholder[language]}
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.report.detailedDesc[language]}</Label>
              <Textarea
                id="description"
                placeholder={t.report.detailedPlaceholder[language]}
                rows={6}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photos">{t.report.photos[language]}</Label>
              <label htmlFor="photos" className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">{t.report.clickToUpload[language]}</p>
                  <p className="text-xs text-muted-foreground">{t.report.uploadHint[language]}</p>
                </div>
              </label>
              <input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setFormData({ ...formData, photos: files })
                }}
              />
              {formData.photos && formData.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {formData.photos.map((file, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPhotos = formData.photos?.filter((_, i) => i !== index)
                          setFormData({ ...formData, photos: newPhotos })
                        }}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">{t.report.contactInfo[language]}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reporterName">{t.report.nameLabel[language]}</Label>
                  <Input
                    id="reporterName"
                    placeholder={t.report.namePlaceholder[language]}
                    required
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reporterEmail">{t.report.emailLabel[language]}</Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    placeholder={t.report.emailPlaceholder[language]}
                    required
                    value={formData.reporterEmail}
                    onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="reporterPhone">{t.report.phoneLabel[language]}</Label>
                <Input
                  id="reporterPhone"
                  type="tel"
                  placeholder="+995 XXX XXX XXX"
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? t.modals.clickReport.submitting[language] : t.report.submit[language]}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isSubmitting}>
                {t.report.cancel[language]}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}