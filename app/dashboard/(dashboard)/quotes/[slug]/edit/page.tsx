"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { QuoteForm } from "@/components/quote/quote-create-form"
import { getQuoteBySlug } from "@/lib/actions/quote"
import type { FormValues } from "@/lib/schemas/quote"

export default function EditQuotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { user } = useAuth()
  const router = useRouter()
  const [slug, setSlug] = useState<string | null>(null)
  const [quote, setQuote] = useState<FormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    params.then((p) => setSlug(p.slug))
  }, [params])

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getQuoteBySlug(slug).then((data) => {
      if (!data) {
        setNotFound(true)
      } else {
        setQuote(data)
      }
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    if (user?.role === "Viewer") {
      router.replace("/forbidden")
    }
  }, [user, router])

  if (!user || user.role === "Viewer") return null

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-center min-h-[40vh] text-sm text-gray-400">
          Cargando cotización…
        </div>
      </div>
    )
  }

  if (notFound || !quote) {
    return (
      <div className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <Link
            href="/dashboard/quotes"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a cotizaciones
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Cotización no encontrada</h1>
          <p className="text-sm text-gray-500 mt-2">
            La cotización que buscas no existe o fue eliminada.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard/quotes"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a cotizaciones
        </Link>
        {slug && (
          <a
            href={`/q/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ExternalLink size={16} />
            Ver cotización
          </a>
        )}
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Editar cotización
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Actualiza los datos de &ldquo;{quote.title}&rdquo;
        </p>
      </div>
      <QuoteForm mode="edit" initialData={quote} />
    </div>
  )
}
