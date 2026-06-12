"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import {
  FileText,
  Copy,
  Eye,
  Pencil,
  Send,
  RefreshCw,
  CopyCheck,
  Clock,
  AlertTriangle,
  Plus,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { listQuotes, publishQuote, unpublishQuote, type QuoteSummary } from "@/lib/actions/quote"

// ── Helpers ────────────────────────────────────────────────

function formatPrice(price: number, currency: string) {
  return `$${price.toLocaleString("es-MX")} ${currency}`
}

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  draft: "Borrador",
  expired: "Vencida",
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  expired: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
}

// ── Main Page ──────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const [quotes, setQuotes] = useState<QuoteSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    listQuotes().then((res) => {
      setQuotes(res.quotes)
      setLoading(false)
    })
  }, [tick])

  if (!user) return null

  const active = quotes.filter((q) => q.status === "active")
  const drafts = quotes.filter((q) => q.status === "draft")
  const expired = quotes.filter((q) => q.status === "expired")
  const quotedValue = active.reduce((sum, q) => sum + q.total, 0)
  const currency = quotes[0]?.currency ?? "MXN"

  const recentQuotes = quotes.slice(0, 4)

  const pending: { text: string; icon: React.ElementType }[] = []
  if (drafts.length > 0) pending.push({ text: `${drafts.length} borrador${drafts.length > 1 ? "es" : ""} sin publicar`, icon: FileText })
  const soonToExpire = active.filter((q) => {
    if (!q.validUntil) return false
    const diff = (new Date(q.validUntil).getTime() - Date.now()) / 86400000
    return diff >= 0 && diff <= 7
  })
  if (soonToExpire.length > 0) pending.push({ text: `${soonToExpire.length} cotización${soonToExpire.length > 1 ? "es" : ""} por vencer esta semana`, icon: Clock })
  if (expired.length > 0) pending.push({ text: `${expired.length} cotización${expired.length > 1 ? "es" : ""} vencida${expired.length > 1 ? "s" : ""}`, icon: AlertTriangle })

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Hola, {user.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Crea, comparte y da seguimiento a tus cotizaciones.
        </p>
        {user.role !== "Viewer" && (
          <Link
            href="/dashboard/quotes/new"
            className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 h-10 px-4 rounded-lg text-sm font-medium transition-colors mt-4"
          >
            <Plus size={16} />
            Nueva cotización
          </Link>
        )}
      </div>

      {/* Summary */}
      <Section title="Resumen" subtitle="Estado general de tus cotizaciones.">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard label="Activas" value={loading ? "—" : String(active.length)} color="text-emerald-600" />
          <SummaryCard label="Borradores" value={loading ? "—" : String(drafts.length)} color="text-gray-600" />
          <SummaryCard label="Vencidas" value={loading ? "—" : String(expired.length)} color="text-red-600" />
          <SummaryCard label="Cotizado" value={loading ? "—" : formatPrice(quotedValue, currency)} color="text-gray-900" />
        </div>
      </Section>

      {/* Quote Status + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Quote Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Estado de cotizaciones</h3>
          {loading ? (
            <p className="text-sm text-gray-400">Cargando…</p>
          ) : quotes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin cotizaciones aún.</p>
          ) : (
            <div className="space-y-3">
              <StatusBar label="Activas" value={active.length} total={quotes.length} color="bg-emerald-500" />
              <StatusBar label="Borradores" value={drafts.length} total={quotes.length} color="bg-gray-400" />
              <StatusBar label="Vencidas" value={expired.length} total={quotes.length} color="bg-red-400" />
            </div>
          )}
        </div>

        {/* Pending Items */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pendientes</h3>
          {loading ? (
            <p className="text-sm text-gray-400">Cargando…</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-gray-400">Sin pendientes — todo al día.</p>
          ) : (
            <div className="space-y-3">
              {pending.map((p, i) => {
                const Icon = p.icon
                return (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                    <Icon size={16} className="text-gray-400 shrink-0" />
                    <span>{p.text}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Quotes */}
      <Section title="Cotizaciones recientes" subtitle="Últimas cotizaciones creadas o actualizadas.">
        {loading ? (
          <div className="py-8 text-center text-sm text-gray-400">Cargando cotizaciones…</div>
        ) : recentQuotes.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No hay cotizaciones aún.{" "}
            <Link href="/dashboard/quotes/new" className="text-gray-700 underline hover:text-gray-900">
              Crea la primera
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentQuotes.map((q) => {
              const colors = STATUS_COLORS[q.status] ?? STATUS_COLORS.draft
              return (
                <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">{q.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {q.client}
                        <span className="mx-1.5">·</span>
                        <span className={`inline-flex items-center gap-1.5 ${colors.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {STATUS_LABELS[q.status] ?? q.status}
                        </span>
                        {q.validUntil && (
                          <>
                            <span className="mx-1.5">·</span>
                            Vence: {q.validUntil}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 shrink-0">
                      {formatPrice(q.total, q.currency)}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Link
                      href={`/dashboard/quotes/${q.slug}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      <Pencil size={14} />
                      Editar
                    </Link>
                    <a
                      href={`/q/${q.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors bg-gray-50 text-gray-500 hover:bg-gray-100"
                    >
                      <ExternalLink size={14} />
                      Ver
                    </a>
                    {q.status === "draft" && (
                      <ActionButton icon={Send} label="Publicar" onClick={() => {
                        publishQuote(q.slug).then((result) => {
                          if (result.success) { toast.success("Cotización publicada"); setTick((t) => t + 1) }
                          else toast.error(result.error ?? "Error al publicar")
                        })
                      }} />
                    )}
                    {q.status === "active" && (
                      <>
                        <ActionButton icon={Copy} label="Copiar enlace" onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/q/${q.slug}`)
                          toast.success("Enlace copiado")
                        }} primary />
                        <ActionButton icon={Eye} label="Vista previa" onClick={() => window.open(`/q/${q.slug}`, "_blank")} />
                        <ActionButton icon={RefreshCw} label="Despublicar" onClick={() => {
                          unpublishQuote(q.slug).then((result) => {
                            if (result.success) { toast.success("Cotización despublicada"); setTick((t) => t + 1) }
                            else toast.error(result.error ?? "Error al despublicar")
                          })
                        }} />
                      </>
                    )}
                    {q.status === "expired" && (
                      <>
                        <ActionButton icon={RefreshCw} label="Renovar" onClick={() => toast.info("Renovar — próximamente")} />
                        <ActionButton icon={CopyCheck} label="Duplicar" onClick={() => toast.info("Duplicar — próximamente")} />
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="mt-4 text-center">
          <Link href="/dashboard/quotes" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Ver todas las cotizaciones →
          </Link>
        </div>
      </Section>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

function StatusBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        primary ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}
