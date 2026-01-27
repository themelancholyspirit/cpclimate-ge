"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Camera, MapPin, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function ReportPage() {
  const { t, language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      issueType: formData.get("issueType") as string,
      location: formData.get("location") as string,
      locationDesc: formData.get("location") as string,
      description: formData.get("description") as string,
      reporterName: formData.get("reporterName") as string,
      reporterEmail: formData.get("reporterEmail") as string,
      reporterPhone: (formData.get("reporterPhone") as string) || undefined,
    };

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit report");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error submitting report:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {t.reportPage.successTitle[language]}
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {t.reportPage.successDesc[language]}
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setSubmitted(false)}>
                {t.reportPage.submitAnother[language]}
              </Button>
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => (window.location.href = "/map")}
              >
                {t.reportPage.viewMapBtn[language]}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-white text-black">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-4xl md:text-5xl font-bold">
              {t.reportPage.headerTitle[language]}
            </h1>
          </div>
          <p className="text-lg text-black font-bold max-w-3xl leading-relaxed">
            {t.reportPage.headerDesc[language]}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
              <CardHeader>
                <CardTitle>{t.reportPage.submitTitle[language]}</CardTitle>
                <CardDescription>
                  {t.reportPage.submitDesc[language]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="issueType">
                      {t.report.issueType[language]}
                    </Label>
                    <select
                      id="issueType"
                      name="issueType"
                      className="w-full px-3 py-2 rounded-md border border-border bg-background"
                      required
                    >
                      <option value="">
                        {t.report.issueTypeSelect[language]}
                      </option>
                      <option value="water">
                        {t.report.issueTypeOptions.water[language]}
                      </option>
                      <option value="waste">
                        {t.report.issueTypeOptions.waste[language]}
                      </option>
                      <option value="odor">
                        {t.report.issueTypeOptions.odor[language]}
                      </option>
                      <option value="drainage">
                        {t.report.issueTypeOptions.drainage[language]}
                      </option>
                      <option value="flooding">
                        {t.report.issueTypeOptions.flooding[language]}
                      </option>
                      <option value="other">
                        {t.report.issueTypeOptions.other[language]}
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      {t.report.locationDesc[language]}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        name="location"
                        placeholder={t.report.locationPlaceholder[language]}
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="bg-transparent flex-shrink-0"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t.reportPage.locationClickHint[language]}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {t.report.detailedDesc[language]}
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder={t.report.detailedPlaceholder[language]}
                      rows={6}
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="photos">{t.report.photos[language]}</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                      <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {t.report.clickToUpload[language]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.report.uploadHint[language]}
                      </p>
                      <input
                        id="photos"
                        name="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold mb-4">
                      {t.report.contactInfo[language]}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reporterName">
                          {t.report.nameLabel[language]}
                        </Label>
                        <Input
                          id="reporterName"
                          name="reporterName"
                          placeholder={t.report.namePlaceholder[language]}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reporterEmail">
                          Email
                        </Label>
                        <Input
                          id="reporterEmail"
                          name="reporterEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reporterPhone">
                          {t.report.phoneLabel[language]}
                        </Label>
                        <Input
                          id="reporterPhone"
                          name="reporterPhone"
                          type="tel"
                          placeholder="+995 XXX XXX XXX"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1 md:flex-initial"
                      disabled={submitting}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {submitting ? "Submitting..." : t.report.submit[language]}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="bg-transparent"
                      onClick={() => (window.location.href = "/")}
                    >
                      {t.report.cancel[language]}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
