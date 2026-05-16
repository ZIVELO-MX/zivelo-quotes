import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type QuoteAttachment = { label: string; url: string }

type QuoteItem = {
  title: string
  shortDescription: string
  description: string
  bullets: string[]
  price: number
  attachments: QuoteAttachment[]
  links: string[]
}

type QuoteData = {
  projectLabel: string
  title: string
  summary: string
  preparedBy: string
  validUntil: string
  currency: string
  items: QuoteItem[]
  logoUrl?: string
}

async function svgToPngDataUrl(svgPath: string): Promise<string> {
  const response = await fetch(svgPath)
  const svgText = await response.text()
  const blob = new Blob([svgText], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)

  const img = new Image()
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load SVG: ${svgPath}`))
    img.src = url
  })

  const canvas = document.createElement("canvas")
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(img, 0, 0)
  URL.revokeObjectURL(url)
  return canvas.toDataURL("image/png")
}

function formatPrice(price: number) {
  return `$${price.toLocaleString("es-MX")} MXN`
}

function buildItemContent(item: QuoteItem): string {
  const lines: string[] = [item.title]

  if (item.shortDescription) {
    lines.push(item.shortDescription)
  }

  if (item.bullets.length > 0) {
    lines.push("")
    lines.push(...item.bullets.map((b) => `  • ${b}`))
  }

  if (item.attachments.length > 0) {
    lines.push("")
    item.attachments.forEach((a) => {
      lines.push(`  • ${a.label} (${a.url})`)
    })
  }

  return lines.join("\n")
}

export async function generateQuotePdf(quote: QuoteData): Promise<Blob> {
  const doc = new jsPDF("p", "mm", "a4")
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let y = margin

  const logoUrl = quote.logoUrl || "/logos/zivelo-bars-dark-full.svg"
  const logoDataUrl = await svgToPngDataUrl(logoUrl)

  const logoWidth = 50
  const logoHeight = 17
  doc.addImage(logoDataUrl, "PNG", margin, y - 2, logoWidth, logoHeight)

  const today = new Date()
  const dateStr = today.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text(`Generado: ${dateStr}`, pageWidth - margin, y + 4, {
    align: "right",
  })

  y += logoHeight + 14

  doc.setFontSize(11)
  doc.setTextColor(204, 0, 0)
  doc.text(quote.projectLabel, margin, y)
  y += 6

  doc.setFontSize(18)
  doc.setTextColor(25, 25, 25)
  doc.text(quote.title, margin, y)
  y += 8

  doc.setFontSize(10)
  doc.setTextColor(107, 107, 107)
  doc.text(`Válido hasta: ${quote.validUntil}`, margin, y)
  y += 10

  doc.setFontSize(10)
  doc.setTextColor(25, 25, 25)
  const summaryLines = doc.splitTextToSize(
    quote.summary,
    pageWidth - margin * 2
  )
  doc.text(summaryLines, margin, y)
  y += summaryLines.length * 5 + 10

  const tableData = quote.items.map((item) => [
    buildItemContent(item),
    formatPrice(item.price),
  ])

  const total = quote.items.reduce((sum, item) => sum + item.price, 0)

  autoTable(doc, {
    startY: y,
    head: [["Concepto", "Precio"]],
    body: tableData,
    foot: [
      [
        { content: "Inversión total", styles: { fontStyle: "bold" } },
        {
          content: formatPrice(total),
          styles: { fontStyle: "bold", halign: "right" },
        },
      ],
    ],
    theme: "grid",
    styles: {
      fontSize: 9,
      textColor: [25, 25, 25],
      lineColor: [210, 210, 210],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [25, 25, 25],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    footStyles: {
      fillColor: [245, 245, 245],
      textColor: [25, 25, 25],
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 40, halign: "right" },
    },
    bodyStyles: {
      cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
    },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 0) {
        const lines = (data.cell.raw as string).split("\n")
        data.cell.text = lines
      }
    },
  })

  const finalY = (doc as any).lastAutoTable.finalY || y

  doc.setFontSize(9)
  doc.setTextColor(120, 120, 120)
  doc.text(
    `Preparado por ${quote.preparedBy}`,
    margin,
    finalY + 15
  )

  return doc.output("blob")
}
