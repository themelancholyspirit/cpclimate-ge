"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";

type NavKey =
  | "home"
  | "interactiveMap"
  | "riskAlert"
  | "projects"
  | "findings"
  | "news"
  | "contact"
  | "about";
  
const NAV_ITEMS: { key: NavKey; href: string }[] = [
  { key: "home", href: "/" },
  { key: "interactiveMap", href: "/map" },
  { key: "projects", href: "/projects" },
  { key: "findings", href: "/findings" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
  { key: "about", href: "/about" }
];

const LANG_OPTIONS = [
  {
    code: "en" as const,
    label: "English",
    icon: <img src="/en.png" alt="English" className="w-7 h-6 object-cover" />,
  },
  {
    code: "ka" as const,
    label: "ქართული",
    icon: <img src="/ka.png" alt="ქართული" className="w-7 h-6 object-cover" />,
  },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const currentLang =
    LANG_OPTIONS.find((l) => l.code === language) ?? LANG_OPTIONS[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/cpc.png"
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                prefetch={item.href === "/map" ? false : true}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              >
                {t.nav[item.key][language]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher (Desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-2"
                  aria-label={currentLang.label}
                  title={currentLang.label}
                >
                  <span className="leading-none">{currentLang.icon}</span>
                  <span className="text-sm font-medium ml-1">
                    {currentLang.code.toUpperCase() === "EN" ? "EN" : "ქარ"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px] z-[60]">
                {LANG_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.code}
                    onClick={() => setLanguage(opt.code)}
                    aria-label={opt.label}
                    title={opt.label}
                    className="flex items-center gap-2"
                  >
                    <span className="leading-none">{opt.icon}</span>
                    <span className="text-sm whitespace-nowrap">
                      {opt.code.toUpperCase()}
                    </span>
                    <span className="text-sm whitespace-nowrap text-muted-foreground">
                      {opt.label}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {/* Language Switcher (Mobile) */}
            <div className="flex items-center gap-2 mb-2">
              {LANG_OPTIONS.map((opt) => (
                <Button
                  key={opt.code}
                  variant={language === opt.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLanguage(opt.code)}
                  aria-label={opt.label}
                  title={opt.label}
                  className="flex items-center gap-2"
                >
                  <span className="leading-none">{opt.icon}</span>
                  <span className="text-sm">{opt.label}</span>
                </Button>
              ))}
            </div>

            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav[item.key][language]}
              </Link>
            ))}


          </div>
        </div>
      )}
    </header>
  );
}