"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { QuoteCreateForm } from "@/components/quote/quote-create-form"

export default function NewQuotePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === "Viewer") {
      router.replace("/forbidden")
    }
  }, [user, router])

  if (user?.role === "Viewer") {
    return null
  }

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al dashboard
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Nueva cotización
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Crea una nueva propuesta interactiva para tu cliente.
        </p>
      </div>
      <QuoteCreateForm />
    </div>
  )
}
