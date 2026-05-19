import { ImageResponse } from "next/og"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { prisma } from "@/lib/prisma"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const INTER_FONT_URLS = [
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff", 400],
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-500-normal.woff", 500],
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-600-normal.woff", 600],
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff", 700],
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-800-normal.woff", 800],
] as const

async function loadInterFont() {
  return Promise.all(
    INTER_FONT_URLS.map(async ([name, url, weight]) => ({
      name,
      data: await fetch(url).then((response) => response.arrayBuffer()),
      weight,
      style: "normal" as const,
    })),
  )
}

function truncateSummary(text: string, maxLen = 100): string {
  if (text.length <= maxLen) return text
  const truncated = text.slice(0, maxLen)
  const lastBreak = Math.max(truncated.lastIndexOf("."), truncated.lastIndexOf(":"))
  if (lastBreak > maxLen * 0.5) {
    return truncated.slice(0, lastBreak + 1)
  }
  const lastSpace = truncated.lastIndexOf(" ")
  if (lastSpace > maxLen * 0.5) {
    return truncated.slice(0, lastSpace).trimEnd() + "."
  }
  return truncated.trimEnd() + "."
}

async function getLogoDataUrl(logoPath: string): Promise<string | null> {
  const isRemote = logoPath.startsWith("http://") || logoPath.startsWith("https://")

  if (isRemote) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const response = await fetch(logoPath, { signal: controller.signal })
      clearTimeout(timeout)
      const svg = await response.text()
      const base64 = Buffer.from(svg).toString("base64")
      return `data:image/svg+xml;base64,${base64}`
    } catch {
      return null
    }
  }

  try {
    const svg = readFileSync(join(process.cwd(), logoPath), "utf-8")
    const base64 = Buffer.from(svg).toString("base64")
    return `data:image/svg+xml;base64,${base64}`
  } catch {
    return null
  }
}

function getCardWidth(itemCount: number): number {
  if (itemCount === 1) return 380
  if (itemCount === 2) return 340
  return 280
}

type Props = {
  params: Promise<{ quoteSlug: string }>
}

export default async function OpenGraphImage({ params }: Props) {
  const { quoteSlug } = await params

  const row = await prisma.quote.findUnique({ where: { slug: quoteSlug } })
  if (!row) return new ImageResponse(<div style={{ fontSize: 32, color: "#999" }}>Not found</div>, size)

  const items = (row.items as Array<{ title: string }>) ?? []
  const branding = row.branding as { logoPath?: string } | undefined
  const summary = typeof row.summary === "string" ? truncateSummary(row.summary) : ""

  const interFonts = await loadInterFont()
  const logoDataUrl = branding?.logoPath ? await getLogoDataUrl(branding.logoPath) : null
  const displayItems = items.slice(0, 3)

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Inter, Helvetica, Arial, sans-serif",
        background: "#ffffff",
        backgroundImage:
          "linear-gradient(0deg, transparent 24%, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.04) 26%, transparent 27%), linear-gradient(90deg, transparent 24%, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.04) 26%, transparent 27%)",
        backgroundSize: "60px 60px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 6,
          background: "#CC0000",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "#CC0000",
          opacity: 0.04,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -30,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "#CC0000",
          opacity: 0.03,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -10,
          right: 0,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "#CC0000",
          opacity: 0.045,
        }}
      />

      {logoDataUrl && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            paddingLeft: 60,
            paddingTop: 30,
          }}
        >
          <img
            src={logoDataUrl}
            width={160}
            height={56}
            alt="Zivelo"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}

      <div style={{ flex: 1 }} />

      <div
        style={{
          fontSize: 60,
          fontWeight: 800,
          color: "#191919",
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        ¡Tenemos tu cotización!
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 26,
          fontWeight: 500,
          color: "#6b6b6b",
          lineHeight: 1.2,
          textAlign: "center",
        }}
      >
        {row.recipientName}
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 20,
          fontWeight: 400,
          color: "#6b6b6b",
          lineHeight: 1.4,
          textAlign: "center",
          maxWidth: 800,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        {summary}
      </div>

      {displayItems.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 18,
            marginTop: 26,
          }}
        >
          {displayItems.map((item: { title: string }) => {
            return (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: getCardWidth(displayItems.length),
                  height: 100,
                  background: "#ffffff",
                  border: "1px solid #e9e9e7",
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#CC0000",
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#191919",
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div
        style={{
          marginTop: 28,
          marginBottom: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#CC0000",
          borderRadius: 12,
          paddingTop: 18,
          paddingBottom: 18,
          paddingLeft: 56,
          paddingRight: 56,
          boxShadow: "0 4px 16px rgba(204, 0, 0, 0.25)",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: 1,
          }}
        >
          Descubre todos los detalles →
        </span>
      </div>

      <div style={{ flex: 1 }} />
    </div>,
    {
      ...size,
      fonts: interFonts,
    },
  )
}
