"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Award, BookOpen, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function JoinPage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "en" ? "Back" : "უკან"}
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border bg-green-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.joinPage.becomeObserver[language]}</h1>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              Join our network of citizen scientists making real impact on environmental protection and climate resilience in Poti, Georgia.
            </p>
            <Button asChild size="lg" className="bg-white text-green-900 hover:bg-green-50">
              <Link href="#apply">{t.joinPage.applyNow[language]}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* What is C-RON */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">{t.joinPage.whatIsCRON[language]}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center mb-8">
            The Community River Observers Network (C-RON) trains and empowers local citizens to become environmental
            monitors. As an observer, you'll contribute to protecting the Kaparchina River through regular monitoring,
            data collection, and community engagement.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.joinPage.whyJoin[language]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                <CardTitle className="text-lg">Free Training</CardTitle>
                <CardDescription>
                  Learn water quality testing, data collection, and environmental monitoring
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-green-600 mb-3" />
                <CardTitle className="text-lg">Certification</CardTitle>
                <CardDescription>Receive official community observer certification upon completion</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-600 mb-3" />
                <CardTitle className="text-lg">Community</CardTitle>
                <CardDescription>Join a network of like-minded citizens making real change</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-orange-600 mb-3" />
                <CardTitle className="text-lg">Flexible</CardTitle>
                <CardDescription>Participate on your own schedule with monthly activities</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* What You'll Do */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.joinPage.whatYouDo[language]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Monthly River Monitoring",
                description: "Conduct regular observations and water quality testing at assigned locations",
              },
              {
                title: "Data Collection",
                description: "Record observations using mobile app and submit reports to our platform",
              },
              {
                title: "Community Events",
                description: "Participate in cleanup days, awareness campaigns, and educational activities",
              },
              {
                title: "Citizen Reporting",
                description: "Alert authorities about pollution incidents and environmental concerns",
              },
            ].map((item, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <CardDescription className="leading-relaxed">{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">{t.joinPage.whoCanJoin[language]}</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p>18 years or older (16+ with parental consent)</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p>Resident of Poti or surrounding areas</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p>Commitment to attend training sessions (3 days)</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p>Ability to conduct monthly monitoring visits</p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p>Basic smartphone or digital device for data entry</p>
            </div>
          </div>
        </div>

        {/* Training Schedule */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">{t.joinPage.upcomingTraining[language]}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { cohort: "Cohort 5", date: "January 15-17, 2025", slots: "8 spots remaining" },
              { cohort: "Cohort 6", date: "February 20-22, 2025", slots: "15 spots available" },
              { cohort: "Cohort 7", date: "March 18-20, 2025", slots: "15 spots available" },
            ].map((session, i) => (
              <Card key={i}>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">
                    {session.cohort}
                  </Badge>
                  <CardTitle className="text-lg">{session.date}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {session.slots}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" size="sm">
                    <Link href="#apply">Apply for {session.cohort}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application CTA */}
        <div id="apply">
          <Card className="bg-blue-900 text-white border-0">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl font-bold mb-4">{t.joinPage.readyToMakeDiff[language]}</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join our next training cohort and become an official Community River Observer
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                  <Link href="/contact?subject=Join%20C-RON">{t.joinPage.submitApplication[language]}</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/contact">{t.joinPage.askQuestions[language]}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
