"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Search, ChevronDown, Pencil, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { listQuotes, type QuoteSummary } from "@/lib/actions/quote"

// ── Types ──────────────────────────────────────────────────

type QuoteStatus = "active" | "draft" | "expired"

interface Quote {
  id: string
  title: string
  client: string
  status: QuoteStatus
  validUntil: string | null
  total: number
  currency: string
  slug: string
  updatedAt: string
}

// ── Helpers ────────────────────────────────────────────────

function formatPrice(price: number, currency: string) {
  return `$${price.toLocaleString("es-MX")} ${currency}`
}

const STATUS_LABELS: Record<QuoteStatus, string> = {
  active: "Activa",
  draft: "Borrador",
  expired: "Vencida",
}

const STATUS_COLORS: Record<QuoteStatus, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  expired: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
}

// ── Main Page ──────────────────────────────────────────────

export default function QuotesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loadingQuotes, setLoadingQuotes] = useState(true)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    listQuotes().then((result) => {
      if (result.success) {
        setQuotes(result.quotes as Quote[])
      }
      setLoadingQuotes(false)
    })
  }, [])
  if (!user) return null

  const canCreate = user.role !== "Viewer"

  const FILTER_OPTIONS: { value: QuoteStatus | "all"; label: string; dot: string | null }[] = [
    { value: "all", label: "Todos los estados", dot: null },
    { value: "active", label: "Activas", dot: "bg-emerald-500" },
    { value: "draft", label: "Borradores", dot: "bg-gray-400" },
    { value: "expired", label: "Vencidas", dot: "bg-red-500" },
  ]

  const activeFilter = FILTER_OPTIONS.find((o) => o.value === statusFilter)!

  const filtered = quotes.filter((q) => {
    const matchesSearch =
      !search ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.client.toLowerCase().includes(search.toLowerCase()) ||
      q.slug.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || q.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cotizaciones</h1>
          <p className="text-sm text-gray-500 mt-1">Busca, revisa y comparte tus cotizaciones.</p>
        </div>
        {canCreate && (
          <Link
            href="/dashboard/quotes/new"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 text-gray-600 border border-gray-200 hover:text-gray-900 hover:bg-black/[0.04] hover:border-gray-300 hover:shadow-sm"
          >
            <Plus size={16} />
            Nueva cotización
          </Link>
        )}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, título o slug..."
            className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-shadow duration-200"
          />
        </div>
        <div ref={filterRef} className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 h-10 text-sm text-gray-900 bg-white hover:border-gray-300 transition-colors min-w-[160px]"
          >
            {activeFilter.dot && <span className={`w-2 h-2 rounded-full ${activeFilter.dot}`} />}
            <span className="flex-1 text-left">{activeFilter.label}</span>
            <ChevronDown
              size={16}
              strokeWidth={1.5}
              className={`text-gray-400 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 min-w-[180px] bg-white border border-gray-200/80 shadow-lg transition-all duration-200 ease-in-out ${
              filterOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
            }`}
          >
            {FILTER_OPTIONS.map((opt, i) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.value)
                  setFilterOpen(false)
                }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors duration-150 ${
                  statusFilter === opt.value ? "text-gray-900 font-medium" : "text-gray-500"
                } ${i > 0 ? "border-t border-gray-100" : ""}`}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {opt.dot ? <span className={`w-2 h-2 rounded-full ${opt.dot}`} /> : <span className="w-2" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {loadingQuotes ? (
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-12 text-center text-sm text-gray-400">
            Cargando cotizaciones...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-12 text-center text-sm text-gray-400">
            No se encontraron cotizaciones.
          </div>
        ) : (
          filtered.map((q) => {
            const colors = STATUS_COLORS[q.status]
            return (
                <div
                  key={q.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 transition-colors hover:bg-gray-50/50"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate">{q.title}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{q.client}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">{formatPrice(q.total, q.currency)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 ${colors.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                        {STATUS_LABELS[q.status]}
                      </span>
                      <span>·</span>
                      <span>{q.validUntil || "Sin vencimiento"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/q/${q.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-gray-50 text-gray-500 hover:bg-gray-100"
                      >
                        <ExternalLink size={14} />
                        Ver
                      </a>
                      <Link
                        href={`/dashboard/quotes/${q.slug}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        <Pencil size={14} />
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
            )
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white border border-gray-100 rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3 text-left">Título</th>
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3 text-left">Cliente</th>
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3 text-left">Estado</th>
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3 text-left">Vence</th>
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3 text-left">Total</th>
                <th className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 px-5 py-3 text-left" />
              </tr>
            </thead>
            <tbody>
              {loadingQuotes ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                    Cargando cotizaciones...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-400">
                    No se encontraron cotizaciones.
                  </td>
                </tr>
              ) : (
                filtered.map((q) => {
                  const colors = STATUS_COLORS[q.status]
                  return (
                    <tr
                      key={q.id}
                      className="text-sm text-gray-700 border-t border-gray-100 transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{q.title}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{q.client}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 ${colors.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {STATUS_LABELS[q.status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{q.validUntil || "—"}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{formatPrice(q.total, q.currency)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/q/${q.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-gray-50 text-gray-500 hover:bg-gray-100"
                          >
                            <ExternalLink size={14} />
                            Ver
                          </a>
                          <Link
                            href={`/dashboard/quotes/${q.slug}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            <Pencil size={14} />
                            Editar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          Mostrando {filtered.length} de {quotes.length} cotizaciones
        </p>
      )}
    </div>
  )
}
