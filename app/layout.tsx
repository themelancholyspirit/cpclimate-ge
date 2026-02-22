import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CPC Georgia - Centre for Participation and Collaboration CPC",
  description:
    "Strengthening climate resilience and environmental governance through  community engagement",
  generator: "v0.app",
  icons: {
    icon: 'cpc.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
       <LanguageProvider>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Toaster />
        <Analytics />
        </LanguageProvider>
      </body>
    </html>
  )
}
