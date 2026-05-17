"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Paperclip, FileText } from "lucide-react"
import { formatPrice } from "@/lib/demo-quote-data"

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

type QuoteItemsListProps = {
  items: QuoteItem[]
}

export function QuoteItemsList({ items }: QuoteItemsListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="rounded-xl border border-border bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
      {items.map((item, index) => {
        const isExpanded = expandedIndex === index

        return (
          <div key={item.title}>
            {index > 0 && <div className="mx-4 border-t border-border" />}

            <button
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="w-full text-left px-6 py-5 hover:bg-background-secondary hover:cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                    {item.attachments.length > 0 && (
                      <Paperclip size={12} className="text-foreground-dim flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-foreground-muted">{item.shortDescription}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-base font-bold text-foreground">{formatPrice(item.price)}</span>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-foreground-dim" />
                  ) : (
                    <ChevronDown size={16} className="text-foreground-dim" />
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
                  <p className="text-sm text-foreground leading-relaxed mb-4">{item.description}</p>

                  {item.bullets.length > 0 && (
                    <ul className="space-y-1.5 mb-4">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="text-sm text-foreground-muted flex items-start gap-2.5">
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
  )
}
