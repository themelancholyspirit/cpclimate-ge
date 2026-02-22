"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, MapPin, Camera, CheckCircle2, AlertCircle } from "lucide-react"
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
  photos?: File[] | string[]
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
    try {
      if (coordinates?.lat !== undefined && coordinates?.lng !== undefined && 
          typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number') {
        setFormData((prev) => ({
          ...prev,
          location: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`,
        }))
      }
    } catch (error) {
      console.error("Error updating coordinates:", error);
    }
  }, [coordinates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload photos to Directus first if they exist
      let photoIds: string[] = []
      const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
      
      if (formData.photos && formData.photos.length > 0 && Array.isArray(formData.photos)) {
        const photosToUpload = formData.photos.filter((p): p is File => p instanceof File)
        
        for (const photo of photosToUpload) {
          try {
            const photoFormData = new FormData()
            photoFormData.append('file', photo)
            
            const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
              method: 'POST',
              body: photoFormData,
            })
            
            if (uploadResponse.ok) {
              const uploadResult = await uploadResponse.json()
              photoIds.push(uploadResult.data.id)
              console.log('Photo uploaded successfully:', uploadResult.data.id)
            } else {
              console.error('Failed to upload photo:', await uploadResponse.text())
              // Continue with other photos even if one fails
            }
          } catch (uploadError) {
            console.error('Error uploading photo:', uploadError)
            // Continue with other photos even if one fails
          }
        }
      }

      // Submit report with photo IDs
      await onSubmit({
        issueType: formData.issueType,
        description: formData.description,
        location: formData.location,
        reporterName: formData.reporterName,
        reporterEmail: formData.reporterEmail,
        reporterPhone: formData.reporterPhone,
        photos: photoIds,
      })
      // Show success toast
      toast({
        variant: "success",
        duration: 5000,
        title: (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-green-900 font-semibold text-xl">
              {t?.toast?.reportSuccess?.title?.[language] || "Success"}
            </span>
            <span className="text-green-800 text-base">
              {t?.toast?.reportSuccess?.description?.[language] || "Report submitted successfully"}
            </span>
          </div>
        ),
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
        variant: "destructive",
        duration: 5000,
        title: (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-red-900 font-semibold text-xl">
              {t?.toast?.reportError?.title?.[language] || "Error"}
            </span>
            <span className="text-red-800 text-base">
              {t?.toast?.reportError?.description?.[language] || "Failed to submit report"}
            </span>
          </div>
        ),
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
              <CardTitle>{t?.modals?.clickReport?.title?.[language] || "Report an Issue"}</CardTitle>
              <CardDescription>
                {t?.modals?.clickReport?.body?.[language] || "Please provide details about the issue"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {coordinates && typeof coordinates.lat === 'number' && typeof coordinates.lng === 'number' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              <span>Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="issueType">{t?.report?.issueType?.[language] || "Issue Type"}</Label>
              <select
                id="issueType"
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
                required
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
              >
                <option value="">{t?.report?.issueTypeSelect?.[language] || "Select issue type"}</option>
                <option value="water">{t?.report?.issueTypeOptions?.water?.[language] || "Water Quality"}</option>
                <option value="waste">{t?.report?.issueTypeOptions?.waste?.[language] || "Waste"}</option>
                <option value="odor">{t?.report?.issueTypeOptions?.odor?.[language] || "Odor"}</option>
                <option value="drainage">{t?.report?.issueTypeOptions?.drainage?.[language] || "Drainage"}</option>
                <option value="flooding">{t?.report?.issueTypeOptions?.flooding?.[language] || "Flooding"}</option>
                <option value="channels">{t?.report?.issueTypeOptions?.channels?.[language] || "Channels"}</option>
                <option value="sea">{t?.report?.issueTypeOptions?.sea?.[language] || "Sea Intrusion"}</option>
                <option value="erosion">{t?.report?.issueTypeOptions?.erosion?.[language] || "Erosion"}</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">{t?.report?.locationDesc?.[language] || "Location"}</Label>
              <Input
                id="location"
                placeholder={t?.report?.locationPlaceholder?.[language] || "Location description"}
                required
                readOnly
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t?.report?.detailedDesc?.[language] || "Description"}</Label>
              <Textarea
                id="description"
                placeholder={t?.report?.detailedPlaceholder?.[language] || "Describe the issue"}
                rows={6}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photos">{t?.report?.photos?.[language] || "Photos"}</Label>
              <label htmlFor="photos" className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">{t?.report?.clickToUpload?.[language] || "Click to upload photos"}</p>
                  <p className="text-xs text-muted-foreground">{t?.report?.uploadHint?.[language] || "PNG, JPG up to 10MB"}</p>
                </div>
              </label>
              <input
                id="photos"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  try {
                    const files = Array.from(e?.target?.files || [])
                    setFormData({ ...formData, photos: files })
                  } catch (error) {
                    console.error("Error handling photo upload:", error);
                  }
                }}
              />
              {formData.photos && formData.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {formData.photos.map((file, index) => {
                    try {
                      if (!file) return null;
                      return (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const newPhotos = formData.photos?.filter((_, i) => i !== index)
                                setFormData({ ...formData, photos: newPhotos })
                              } catch (error) {
                                console.error("Error removing photo:", error);
                              }
                            }}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    } catch (error) {
                      console.error("Error rendering photo preview:", error);
                      return null;
                    }
                  })}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">{t?.report?.contactInfo?.[language] || "Contact Information"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reporterName">{t?.report?.nameLabel?.[language] || "Name"}</Label>
                  <Input
                    id="reporterName"
                    placeholder={t?.report?.namePlaceholder?.[language] || "Your name"}
                    required
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reporterEmail">{t?.report?.emailLabel?.[language] || "Email"}</Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    placeholder={t?.report?.emailPlaceholder?.[language] || "your.email@example.com"}
                    required
                    value={formData.reporterEmail}
                    onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="reporterPhone">{t?.report?.phoneLabel?.[language] || "Phone"}</Label>
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
                {isSubmitting ? (t?.modals?.clickReport?.submitting?.[language] || "Submitting...") : (t?.report?.submit?.[language] || "Submit Report")}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={onClose} disabled={isSubmitting}>
                {t?.report?.cancel?.[language] || "Cancel"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
