"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, ExternalLink, Calendar, Search } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Resource {
  id: string
  title: string
  type: string
  date: string
  description: string
  pages: number | null
  category: string
  fileUrl: string | null
  externalUrl: string | null
}

interface MediaItem {
  id: string
  title: string
  outlet: string
  date: string
  type: string
  url: string | null
}

export default function FindingsPage() {
  const { t, language } = useLanguage()
  const [resources, setResources] = useState<Resource[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // Fetch resources
        const resourcesResponse = await fetch('/api/resources')
        
        // Fetch media items
        const mediaResponse = await fetch('/api/media')
        
        if (resourcesResponse.ok) {
          const resourcesData = await resourcesResponse.json()
          setResources(resourcesData)
        }
        
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json()
          setMediaItems(mediaData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Filter resources based on search query
  const filteredResources = resources.filter(resource => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.category.toLowerCase().includes(query) ||
      resource.type.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading findings...</div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.findings.headerTitle[language]}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t.findings.headerDesc[language]}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === "en" ? "Search resources..." : "ძიება რესურსებში..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="w-full h-48 bg-slate-100 rounded-md mb-4 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-slate-400" />
                </div>
                <div className="flex items-center justify-between mb-2 gap-4">
                  <CardTitle className="text-lg text-balance">{resource.title}</CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(resource.date)}</span>
                  </div>
                </div>
                <CardDescription className="leading-relaxed line-clamp-3">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex gap-2">
                  {resource.fileUrl && (
                    <Button size="sm" className="flex-1" asChild>
                      <a href={resource.fileUrl} download>
                        <Download className="h-4 w-4 mr-1" />
                        {t.findings.download[language]}
                      </a>
                    </Button>
                  )}
                  {resource.externalUrl && (
                    <Button size="sm" variant="outline" className="bg-transparent" asChild>
                      <a href={resource.externalUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {!resource.fileUrl && !resource.externalUrl && (
                    <Button size="sm" className="flex-1" disabled>
                      <Download className="h-4 w-4 mr-1" />
                      {t.findings.download[language]}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
          ) : (
            <div className="col-span-full text-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {language === "en" ? "No resources found matching your search." : "თქვენს ძიებას არ შეესაბამება არცერთი რესურსი."}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
