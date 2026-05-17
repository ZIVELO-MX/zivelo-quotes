type QuoteSummaryProps = {
  summary: string
}

export function QuoteSummary({ summary }: QuoteSummaryProps) {
  return (
    <div className="mb-12 p-5 rounded-lg border border-border bg-background-secondary">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-2">
        Resumen ejecutivo
      </p>
      <p className="text-sm text-foreground leading-relaxed">
        {summary}
      </p>
    </div>
  )
}
