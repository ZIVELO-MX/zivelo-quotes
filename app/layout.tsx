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
  title: "Zivelo Quotes — Interactive Proposal Pages",
  description:
    "Create, share, and present beautiful interactive quotes and proposals with Zivelo Quotes.",
  metadataBase: new URL("https://quotes.zivelo.dev"),
  openGraph: {
    title: "Zivelo Quotes — Interactive Proposal Pages",
    description:
      "Create, share, and present beautiful interactive quotes and proposals with Zivelo Quotes.",
    url: "https://quotes.zivelo.dev",
    siteName: "Zivelo Quotes",
    type: "website",
    locale: "en_US",
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
    title: "Zivelo Quotes — Interactive Proposal Pages",
    description:
      "Create, share, and present beautiful interactive quotes and proposals with Zivelo Quotes.",
    images: ["/og-landing.svg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
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
