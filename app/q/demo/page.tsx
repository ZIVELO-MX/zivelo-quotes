"use client"

import { useState } from "react"
import { Footer } from "@/components/layout/footer"
import { GeneratePdfButton } from "@/components/quote/generate-pdf-button"
import {
  ChevronDown,
  ChevronUp,
  Paperclip,
  FileText,
  MessageCircle,
} from "lucide-react"
import { DEMO_QUOTE, total, formatPrice } from "@/lib/demo-quote-data"

export default function DemoPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-5 pt-24 pb-24">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-1.5">
                {DEMO_QUOTE.projectLabel}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
                {DEMO_QUOTE.title}
              </h1>
              <p className="mt-1.5 text-sm text-foreground-muted">
                Preparado por <span className="text-accent font-medium">{DEMO_QUOTE.preparedBy}</span>
                <span className="mx-2 text-foreground-dim">&middot;</span>
                V&aacute;lido hasta {DEMO_QUOTE.validUntil}
              </p>
            </div>
            <span className="flex-shrink-0 rounded-full bg-green-50 text-green-700 text-xs font-medium px-3 py-1 border border-green-200">
              Activa
            </span>
          </div>
        </div>

        <div className="mb-12 p-5 rounded-lg border border-border bg-background-secondary">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-2">
            Resumen ejecutivo
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            {DEMO_QUOTE.summary}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
          {DEMO_QUOTE.items.map((item, index) => {
            const isExpanded = expandedIndex === index

            return (
              <div key={item.title}>
                {index > 0 && <div className="mx-4 border-t border-border" />}

                <button
                  onClick={() =>
                    setExpandedIndex(isExpanded ? null : index)
                  }
                  className="w-full text-left px-6 py-5 hover:bg-background-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-base font-semibold text-foreground">
                          {item.title}
                        </h3>
                        {item.attachments.length > 0 && (
                          <Paperclip
                            size={12}
                            className="text-foreground-dim flex-shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-sm text-foreground-muted">
                        {item.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-base font-bold text-foreground">
                        {formatPrice(item.price)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-foreground-dim" />
                      ) : (
                        <ChevronDown
                          size={16}
                          className="text-foreground-dim"
                        />
                      )}
                    </div>
                  </div>
                </button>

                <div
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden min-h-0">
                    <div className="border-t border-border px-6 pb-5 pt-4">
                      <p className="text-sm text-foreground leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {item.bullets.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {item.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="text-sm text-foreground-muted flex items-start gap-2.5"
                            >
                              <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground-dim flex-shrink-0" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.attachments.map((att) => (
                        <a
                          key={att.label}
                          href={att.url}
                          className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover font-medium"
                        >
                          <FileText size={14} />
                          {att.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border border-border-strong rounded-lg px-6 py-4 bg-background-secondary">
          <span className="text-sm font-semibold text-foreground">
            Inversi&oacute;n total
          </span>
          <span className="text-xl font-bold text-foreground">
            {formatPrice(total)}
          </span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button className="w-full sm:flex-1 rounded-md bg-accent text-white text-sm font-medium py-2.5 hover:bg-accent-hover transition-colors">
            Aprobar propuesta
          </button>
          <button className="w-full sm:w-auto rounded-md border border-border text-foreground-muted text-sm font-medium px-5 py-2.5 hover:bg-background-secondary transition-colors inline-flex items-center justify-center gap-2">
            <MessageCircle size={14} />
            Hacer una pregunta
          </button>
          <GeneratePdfButton quote={DEMO_QUOTE} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
