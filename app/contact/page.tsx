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
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { t, language } = useLanguage();
  return (
    <div className="bg-background">
      {/* Header */}

      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t.contact.headerTitle[language]}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {t.contact.headerDesc[language]}
          </p>
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
                    <h3 className="font-semibold mb-3 text-base">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/map">Report Environmental Issue</a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href="/projects">View Our Projects</a>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We typically respond to inquiries within 24-48 hours. For urgent environmental concerns, please use our <a href="/map" className="text-primary hover:underline">interactive map</a>.
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
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {t.contact.firstName[language]}
                      </Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {t.contact.lastName[language]}
                      </Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.contact.email[language]}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
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
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {t.contact.subject[language]}
                    </Label>
                    <Input id="subject" placeholder="What is this about?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t.contact.message[language]}
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto"
                    onClick={(e) => {
                      console.log("submit button has been clicked", e);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t.contact.sendMessage[language]}
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
