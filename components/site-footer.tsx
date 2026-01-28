"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export function SiteFooter() {
  const { t, language } = useLanguage()
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5 text-primary-foreground"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-semibold text-lg">CPC Georgia</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {t.footer.aboutBody[language]}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.quickLinks[language]}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/map" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.footer.interactiveMap[language]}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.footer.ourProjects[language]}
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.footer.reportIssue[language]}
                </Link>
              </li>
              <li>
                <Link href="/findings" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.footer.findingsReports[language]}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.contact[language]}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Poti, Georgia</li>
              <li>info@cpc-georgia.org</li>
              <li>+995 XXX XXX XXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t.footer.copyright[language]}</p>
        </div>
      </div>
    </footer>
  )
}
