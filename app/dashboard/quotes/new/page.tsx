import { QuoteCreateForm } from "@/components/quote/quote-create-form"

export default function NewQuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          New Quote
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Create a new interactive proposal
        </p>
      </div>
      <QuoteCreateForm />
    </div>
  )
}
