import { MessageCircle } from "lucide-react"
import { GeneratePdfButton } from "./generate-pdf-button"
import type { QuoteData } from "@/lib/demo-quote-data"

type QuoteActionsProps = {
  phone: string
  title: string
  quote: QuoteData
}

export function QuoteActions({ phone, title, quote }: QuoteActionsProps) {
  const cleanPhone = phone.replace(/\D/g, "")

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola, quiero aprobar la propuesta "${title}".`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:flex-1 rounded-md bg-accent text-white text-sm font-medium py-2.5 hover:bg-accent-hover hover:cursor-pointer transition-colors text-center"
      >
        Aprobar propuesta
      </a>
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola, tengo una pregunta sobre la propuesta "${title}".`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto rounded-md border border-border text-foreground-muted text-sm font-medium px-5 py-2.5 hover:bg-background-secondary hover:cursor-pointer transition-colors inline-flex items-center justify-center gap-2"
      >
        <MessageCircle size={14} />
        Hacer una pregunta
      </a>
      <GeneratePdfButton quote={quote} />
    </div>
  )
}
