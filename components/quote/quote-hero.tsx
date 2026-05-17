type QuoteHeroProps = {
  projectLabel: string
  title: string
  preparedBy: string
  validUntil: string
  status: string
}

export function QuoteHero({ projectLabel, title, preparedBy, validUntil, status }: QuoteHeroProps) {
  const statusLabel = status === "active" ? "Activa" : status === "draft" ? "Borrador" : "Expirada"
  const statusColor =
    status === "active"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "draft"
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : "bg-gray-50 text-gray-600 border-gray-200"

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-accent mb-1.5">
            {projectLabel}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground text-balance">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Preparado por <span className="text-accent font-medium">{preparedBy}</span>
            <span className="mx-2 text-foreground-dim">&middot;</span>
            V&aacute;lido hasta {validUntil}
          </p>
        </div>
        <span className={`flex-shrink-0 rounded-full text-xs font-medium px-3 py-1 border ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  )
}
