"use client";

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
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast({
        variant: "success",
        duration: 5000,
        title: (
          <div className="flex gap-3">
            <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>

            <div className="flex flex-col">
              <span className="text-green-900 font-semibold leading-tight">
                {t.toast.contactSuccess.title[language]}
              </span>
            </div>
          </div>
        ),
        description: (
          <span className="text-green-800 ml-[52px]">
            {t.toast.contactSuccess.description[language]}
          </span>
        ),
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: t.toast.contactError.title[language],
        description: t.toast.contactError.description[language],
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      {/* Back Button */}

      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-8 w-8" />
            {language === "en" ? "Back" : "უკან"}
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.contact.headerTitle[language]}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 flex">
            <Card className="flex flex-col w-full">
              <CardHeader>
                <CardTitle>{t.contact.getInTouch[language]}</CardTitle>
                <CardDescription>
                  {t.contact.weAreHere[language]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 flex-grow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">
                      {t.contact.email[language]}
                    </div>
                    <a
                      href="mailto:info@cpc-georgia.org"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      info@cpc-georgia.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">
                      {t.contact.phone[language]}
                    </div>
                    <a
                      href="tel:+995"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      +995 XXX XXX XXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium mb-1">
                      {t.contact.office[language]}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Poti, Georgia
                      <br />
                      [Address Details]
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 text-base">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="/map">Report Environmental Issue</a>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href="/projects">View Our Projects</a>
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We typically respond to inquiries within 24-48 hours. For
                      urgent environmental concerns, please use our{" "}
                      <a href="/map" className="text-primary hover:underline">
                        interactive map
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 flex">
            <Card className="flex flex-col w-full">
              <CardHeader>
                <CardTitle>{t.contact.sendUsMessage[language]}</CardTitle>
                <CardDescription>
                  {t.contact.sendFormDesc[language]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {t.contact.firstName[language]}
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {t.contact.lastName[language]}
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.contact.email[language]}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {t.contact.phone[language]} (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+995 XXX XXX XXX"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {t.contact.subject[language]}
                    </Label>
                    <Input
                      id="subject"
                      placeholder="What is this about?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t.contact.message[language]}
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting
                      ? "Sending..."
                      : t.contact.sendMessage[language]}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
