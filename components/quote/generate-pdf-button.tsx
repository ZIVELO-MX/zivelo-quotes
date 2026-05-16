"use client"

import { useState } from "react"
import { FileText, Loader2 } from "lucide-react"
import { generateQuotePdf } from "@/lib/pdf/generate-quote-pdf"

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

type GeneratePdfButtonProps = {
  quote: QuoteData
  className?: string
}

export function GeneratePdfButton({ quote, className }: GeneratePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleClick() {
    if (isGenerating) return
    const pdfWindow = window.open("", "_blank")
    if (!pdfWindow) {
      console.warn("Pop-up blocked. Allow pop-ups to preview the PDF.")
      setIsGenerating(false)
      return
    }
    pdfWindow.document.write(
      "<html><body style='font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#666;'><p>Generando PDF…</p></body></html>"
    )
    setIsGenerating(true)
    try {
      const blob = await generateQuotePdf(quote)
      const url = URL.createObjectURL(blob)
      pdfWindow.location.href = url
    } catch (err) {
      pdfWindow.document.write(
        "<html><body style='font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#c00;'><p>Error al generar el PDF.</p></body></html>"
      )
      console.error("Failed to generate PDF:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isGenerating}
      className={
        "w-full sm:w-auto rounded-md border border-border text-foreground-muted text-sm font-medium px-5 py-2.5 hover:bg-background-secondary transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none" +
        (className ? ` ${className}` : "")
      }
    >
      {isGenerating ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <FileText size={14} />
      )}
      {isGenerating ? "Generando PDF…" : "Descargar PDF"}
    </button>
  )
}
