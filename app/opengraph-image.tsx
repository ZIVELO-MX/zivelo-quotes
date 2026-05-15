import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const INTER_FONT_URLS = [
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-400-normal.woff", 400],
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-500-normal.woff", 500],
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-600-normal.woff", 600],
  ["Inter", "https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff", 700],
] as const

const ITEMS = [
  ["Sistema de Identidad de Marca", "$4,800"],
  ["Rediseño de Sitio Web Corporativo", "$8,200"],
  ["Campaña de Lanzamiento Digital", "$2,400"],
  ["Estrategia de Contenido y SEO", "$3,600"],
  ["Desarrollo de Tienda en Línea", "$6,500"],
  ["Integración de CRM y Automatización", "$5,200"],
  ["Brand Guidelines y Manual de Marca", "$1,800"],
  ["Fotografía y Producción Visual", "$3,200"],
  ["Optimización de Experiencia Móvil", "$2,900"],
  ["Soporte y Mantenimiento Mensual", "$1,500"],
  ["Arquitectura de Información", "$2,800"],
  ["Pruebas de Usuario y QA", "$2,100"],
  ["Capacitación del Equipo Interno", "$1,200"],
]

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

export default async function OpenGraphImage() {
  const interFonts = await loadInterFont()

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
      }}
    >
      {/* Hero text — Swiss poster */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          textAlign: "center",
          paddingTop: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            letterSpacing: "-0.045em",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#191919",
              textShadow: "1.25px 1.25px 0 rgba(0,0,0,0.1)",
            }}
          >
            Cotizaciones
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#191919",
              marginTop: 4,
              textShadow: "1.25px 1.25px 0 rgba(0,0,0,0.1)",
            }}
          >
            que cierran
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#191919",
              marginTop: 4,
            }}
          >
            <div style={{ textShadow: "1.25px 1.25px 0 rgba(0,0,0,0.1)" }}>tratos. </div>
            <div style={{ color: "#CC0000", textShadow: "1.25px 1.25px 0 rgba(0,0,0,0.1)" }}>No PDFs.</div>
          </div>
        </div>
      </div>

      {/* Quote window — subdued */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 896,
          maxWidth: "100%",
          background: "#ffffff",
          border: "1px solid #e9e9e7",
          borderRadius: 12,
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          overflow: "hidden",
          flexShrink: 0,
          marginTop: 36,
          marginBottom: 48,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            borderBottom: "1px solid #e9e9e7",
            background: "#f7f7f5",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#d3d3cf", flexShrink: 0 }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#d3d3cf", flexShrink: 0 }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#d3d3cf", flexShrink: 0 }} />
          <div
            style={{
              marginLeft: 12,
              flex: 1,
              maxWidth: 320,
              borderRadius: 6,
              background: "#efefed",
              color: "#a0a0a0",
              fontSize: 12,
              textAlign: "left",
              padding: "4px 12px",
            }}
          >
            quotes.zivelo.dev/q/acme
          </div>
        </div>

        {/* Card body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: "12px 16px" }}>
          {ITEMS.map(([name, price]) => (
            <div
              key={name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                padding: "12px 16px",
                border: "1px solid #e9e9e7",
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: "#191919", textAlign: "left" }}>{name}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#191919", flexShrink: 0 }}>{price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: interFonts,
    },
  )
}
