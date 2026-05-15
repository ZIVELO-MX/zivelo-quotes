import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { LanguageProvider } from "@/lib/i18n"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Zivelo Quotes — Cotizaciones interactivas",
  description:
    "Crea, comparte y presenta cotizaciones y propuestas interactivas con Zivelo Quotes.",
  metadataBase: new URL("https://quotes.zivelo.dev"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Zivelo Quotes — Cotizaciones interactivas",
    description:
      "Crea, comparte y presenta cotizaciones y propuestas interactivas con Zivelo Quotes.",
    url: "https://quotes.zivelo.dev",
    siteName: "Zivelo Quotes",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/og-landing.svg",
        width: 1200,
        height: 630,
        alt: "Zivelo Quotes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zivelo Quotes — Cotizaciones interactivas",
    description:
      "Crea, comparte y presenta cotizaciones y propuestas interactivas con Zivelo Quotes.",
    images: ["/og-landing.svg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
          <html lang="es" className="bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
