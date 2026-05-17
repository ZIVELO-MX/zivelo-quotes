import type { Metadata } from "next"
import { DEMO_QUOTE } from "@/lib/demo-quote-data"

const title = DEMO_QUOTE.title
const description = `${DEMO_QUOTE.preparedBy} tiene algo que decirte.`
const url = "/q/demo"
const image = "/q/demo/opengraph-image"
const imageAlt = "¡Tenemos tu cotización!"

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: "Zivelo Quotes",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: image,
        alt: imageAlt,
      },
    ],
  },
}

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
