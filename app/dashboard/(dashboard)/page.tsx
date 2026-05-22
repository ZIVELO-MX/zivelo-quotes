"use client"

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
  Phone,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// ── Mock data ──────────────────────────────────────────────

const MOCK_SUMMARY = {
  active: 12,
  drafts: 4,
  expired: 3,
  quotedValue: 84000,
  currency: "MXN",
}

const MOCK_QUOTES = [
  {
    id: "1",
    title: "Propuesta de sitio web",
    client: "ACME Corp",
    status: "active" as const,
    validUntil: "30 Jun, 2026",
    total: 24000,
    currency: "MXN",
    slug: "acme-web",
  },
  {
    id: "2",
    title: "Menú digital",
    client: "Restaurante Norte",
    status: "draft" as const,
    total: 12500,
    currency: "MXN",
    slug: "norte-menu",
  },
  {
    id: "3",
    title: "Landing page",
    client: "Clínica Nova",
    status: "expired" as const,
    validUntil: "10 May, 2026",
    total: 18000,
    currency: "MXN",
    slug: "nova-landing",
  },
  {
    id: "4",
    title: "Sistema de inventarios",
    client: "Distribuidora San José",
    status: "active" as const,
    validUntil: "15 Jul, 2026",
    total: 45000,
    currency: "MXN",
    slug: "sanjose-inventarios",
  },
]

const MOCK_ACTIVITY = [
  { action: "Nueva cotización creada", target: "Sistema de inventarios", time: "Hace 2 horas" },
  { action: "Cotización actualizada", target: "Restaurante Norte", time: "Hace 1 día" },
  { action: "Cotización expirada", target: "Clínica Nova", time: "Hace 3 días" },
  { action: "Cotización publicada", target: "ACME Corp", time: "Hace 5 días" },
]

const MOCK_PENDING = [
  { text: "2 borradores sin publicar", icon: FileText },
  { text: "3 cotizaciones por vencer pronto", icon: Clock },
  { text: "Configurar número de WhatsApp", icon: Phone },
  { text: "Revisar cotizaciones vencidas", icon: AlertTriangle },
]

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
  if (!user) return null

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
      <Section title="Resumen" subtitle="Estado general de tus cotizaciones y actividad reciente.">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard label="Activas" value={String(MOCK_SUMMARY.active)} color="text-emerald-600" />
          <SummaryCard label="Borradores" value={String(MOCK_SUMMARY.drafts)} color="text-gray-600" />
          <SummaryCard label="Vencidas" value={String(MOCK_SUMMARY.expired)} color="text-red-600" />
          <SummaryCard label="Cotizado" value={formatPrice(MOCK_SUMMARY.quotedValue, MOCK_SUMMARY.currency)} color="text-gray-900" />
        </div>
      </Section>

      {/* Quote Status + Activity + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Quote Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Estado de cotizaciones</h3>
          <div className="space-y-3">
            <StatusBar
              label="Activas"
              value={MOCK_SUMMARY.active}
              total={MOCK_SUMMARY.active + MOCK_SUMMARY.drafts + MOCK_SUMMARY.expired}
              color="bg-emerald-500"
            />
            <StatusBar
              label="Borradores"
              value={MOCK_SUMMARY.drafts}
              total={MOCK_SUMMARY.active + MOCK_SUMMARY.drafts + MOCK_SUMMARY.expired}
              color="bg-gray-400"
            />
            <StatusBar
              label="Vencidas"
              value={MOCK_SUMMARY.expired}
              total={MOCK_SUMMARY.active + MOCK_SUMMARY.drafts + MOCK_SUMMARY.expired}
              color="bg-red-400"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Actividad reciente</h3>
          <div className="space-y-4">
            {MOCK_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">
                    {a.action}: <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Items */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Pendientes sugeridos</h3>
          <div className="space-y-3">
            {MOCK_PENDING.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon size={16} className="text-gray-400 shrink-0" />
                  <span>{p.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Quotes */}
      <Section title="Cotizaciones recientes" subtitle="Últimas cotizaciones creadas o actualizadas.">
        <div className="space-y-3">
          {MOCK_QUOTES.map((q) => {
            const colors = STATUS_COLORS[q.status]
            return (
              <div
                key={q.id}
                className="bg-white border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900">{q.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Cliente: {q.client}
                      <span className="mx-1.5">·</span>
                      <span className={`inline-flex items-center gap-1.5 ${colors.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                        {STATUS_LABELS[q.status]}
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
                  {q.status === "draft" && (
                    <ActionButton icon={Send} label="Publicar" onClick={() => toast.info("Publicar — próximamente")} />
                  )}
                  {q.status === "active" && (
                    <>
                      <ActionButton icon={Copy} label="Copiar enlace" onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/q/${q.slug}`)
                        toast.success("Enlace copiado")
                      }} primary />
                      <ActionButton icon={Eye} label="Vista previa" onClick={() => window.open(`/q/${q.slug}`, "_blank")} />
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
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/quotes"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
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
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="text-gray-500 font-medium">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
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
  icon: typeof Copy
  label: string
  onClick: () => void
  primary?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
        primary
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  )
}
