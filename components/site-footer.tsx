"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

const NAV_ITEMS: { key: NavKey; href: string }[] = [
  { key: "home", href: "/" },
  { key: "interactiveMap", href: "/map" },
  { key: "projects", href: "/projects" },
  { key: "findings", href: "/findings" },
  { key: "news", href: "/news" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];


type NavKey =
  | "home"
  | "interactiveMap"
  | "riskAlert"
  | "projects"
  | "findings"
  | "news"
  | "contact"
  | "about";

export function SiteFooter() {
  const { t, language } = useLanguage()
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/cpc.png"
                  alt="Logo"
                  className="h-14 w-auto object-contain"
                />
              </Link>
              <span className="font-semibold text-lg">CPC Georgia</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {t.footer.aboutBody[language]}
            </p>
          </div>

          {/* Quick Links - same as header navigation */}
          <div>
            <h3 className="font-semibold mb-4">{t.footer.quickLinks[language]}</h3>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link 
                    href={item.href} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.nav[item.key][language]}
                  </Link>
                </li>
              ))}
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
